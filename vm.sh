#!/usr/bin/env bash
#
# single-gpu-passthrough-setup.sh
#
# Automated single-GPU passthrough setup for Debian stable, built around
# Rising Prism's hook layout:
#   https://gitlab.com/risingprismtv/single-gpu-passthrough
#
# What it does:
#   1. Installs QEMU/KVM, libvirt, OVMF (UEFI), swtpm (TPM 2.0), virt-manager
#   2. Detects your AMD / NVIDIA GPU (and its audio/USB functions) and checks IOMMU
#   3. Enables IOMMU in GRUB if needed
#   4. Clones the Rising Prism repo and installs the libvirt hooks, tailored to your GPU
#   5. Downloads the Windows 11 ISO (from Microsoft) and the virtio-win driver ISO
#   6. Asks how much storage / RAM / CPU to give the VM, then creates and defines it
#
# Usage:  sudo ./single-gpu-passthrough-setup.sh
#
# Optional environment overrides:
#   WIN_ISO_SOURCE=/path/to/Win11.iso   use an ISO you already have (or a direct URL)
#   WIN_LANG="German"                   Windows language (default: English (United States))
#
set -u -o pipefail

# ----------------------------------------------------------------------------
# Constants
# ----------------------------------------------------------------------------
REPO_URL="https://gitlab.com/risingprismtv/single-gpu-passthrough.git"
REPO_DIR="/opt/single-gpu-passthrough"
IMG_DIR="/var/lib/libvirt/images"
VIRTIO_URL="https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso"
VIRTIO_ISO="$IMG_DIR/virtio-win.iso"
WIN_ISO="$IMG_DIR/Win11_x64.iso"
CONF="/etc/single-gpu-passthrough.conf"
LOG="/var/log/single-gpu-passthrough-setup.log"
UA="Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
WIN_PAGE="https://www.microsoft.com/en-us/software-download/windows11"
TOTAL_STEPS=11
BAR_W=40
NEED_REBOOT=0

PACKAGES=(
  qemu-system-x86 qemu-utils
  libvirt-daemon-system libvirt-clients virtinst virt-manager
  ovmf swtpm swtpm-tools
  dnsmasq-base iptables nftables
  git curl jq pciutils usbutils psmisc ca-certificates
  samba
)

# ----------------------------------------------------------------------------
# Output helpers
# ----------------------------------------------------------------------------
if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'; C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_CYAN=$'\033[36m'
else
  C_RESET=""; C_BOLD=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_CYAN=""
fi

STEP_NO=0
step() { STEP_NO=$((STEP_NO + 1)); printf '\n%s[%d/%d] %s%s\n' "$C_BOLD" "$STEP_NO" "$TOTAL_STEPS" "$*" "$C_RESET"; }
info() { printf '  %s\n' "$*" >&2; }
ok()   { printf '  %s✔%s %s\n' "$C_GREEN" "$C_RESET" "$*" >&2; }
warn() { printf '  %s!%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
die()  { printf '\n%s✘ %s%s\n' "$C_RED" "$*" "$C_RESET" >&2; printf 'Log: %s\n' "$LOG" >&2; exit 1; }
trap 'printf "\n"; die "Interrupted."' INT TERM

draw_bar() { # draw_bar <percent> <label>
  local pct=$1 label=${2:-} filled empty fill rest
  (( pct < 0 )) && pct=0
  (( pct > 100 )) && pct=100
  filled=$(( pct * BAR_W / 100 )); empty=$(( BAR_W - filled ))
  printf -v fill '%*s' "$filled" ''; printf -v rest '%*s' "$empty" ''
  fill=${fill// /█}; rest=${rest// /░}
  printf '\r\033[K  %s[%s%s]%s %3d%%  %s' "$C_CYAN" "$fill" "$rest" "$C_RESET" "$pct" "${label:0:45}"
}

# Reads a text stream on stdin, draws a bar from any "NN%" / "NN.N%" it sees.
percent_from_stream() { # percent_from_stream <label>
  local label=$1 line last=-1 pct re='([0-9]+)(\.[0-9]+)?%'
  while IFS= read -r line; do
    if [[ $line =~ $re ]]; then
      pct=${BASH_REMATCH[1]}
      if (( pct != last )); then draw_bar "$pct" "$label"; last=$pct; fi
    else
      [[ -n $line ]] && printf '%s\n' "$line" >>"$LOG"
    fi
  done
  printf '\n'
}

apt_progress() { # parses apt's machine-readable status fd
  local label=$1 type pkg pct msg last=-1
  while IFS=: read -r type pkg pct msg; do
    case $type in
      pmstatus|dlstatus)
        pct=${pct%%.*}
        [[ $pct =~ ^[0-9]+$ ]] || continue
        if (( pct != last )); then draw_bar "$pct" "${msg:-$label}"; last=$pct; fi
        ;;
    esac
  done
  draw_bar 100 "$label"; printf '\n'
}

apt_run() { # apt_run <label> <apt-get args...>
  local label=$1; shift
  DEBIAN_FRONTEND=noninteractive apt-get -y \
    -o APT::Status-Fd=3 -o Dpkg::Use-Pty=0 -o Dpkg::Options::=--force-confold \
    "$@" 3>&1 >>"$LOG" 2>&1 | apt_progress "$label"
}

download() { # download <url> <dest> <label>
  local url=$1 dest=$2 label=$3
  if [[ -s $dest ]]; then
    ok "$label already downloaded ($(du -h "$dest" | cut -f1))"
    return 0
  fi
  info "Downloading $label"
  if curl -fL --retry 5 --retry-delay 3 --retry-connrefused --connect-timeout 20 \
          -C - -A "$UA" -# -o "$dest.part" "$url" 2>&1 \
        | tr '\r' '\n' | percent_from_stream "$label"; then
    mv -f "$dest.part" "$dest"
    ok "$label downloaded ($(du -h "$dest" | cut -f1))"
  else
    return 1
  fi
}

ask_int() { # ask_int <var> <prompt> <default> <min> <max>
  local __var=$1 prompt=$2 def=$3 min=$4 max=$5 ans
  while true; do
    read -r -p "  $prompt [$def]: " ans
    ans=${ans:-$def}
    if [[ $ans =~ ^[0-9]+$ ]] && (( ans >= min && ans <= max )); then
      printf -v "$__var" '%s' "$ans"; return 0
    fi
    warn "Please enter a whole number between $min and $max."
  done
}

ask_yn() { # ask_yn <prompt> <default y|n>  -> returns 0 for yes
  local prompt=$1 def=$2 ans hint
  [[ $def == y ]] && hint="Y/n" || hint="y/N"
  read -r -p "  $prompt [$hint]: " ans
  ans=${ans:-$def}
  [[ ${ans,,} == y* ]]
}

# ----------------------------------------------------------------------------
# Step 0: preflight
# ----------------------------------------------------------------------------
[[ $EUID -eq 0 ]] || { echo "Please run as root:  sudo $0" >&2; exit 1; }
: >>"$LOG" || { echo "Cannot write $LOG" >&2; exit 1; }
printf '\n===== run started %s =====\n' "$(date -Is)" >>"$LOG"

printf '%sSingle GPU Passthrough setup (Rising Prism layout) for Debian%s\n' "$C_BOLD" "$C_RESET"

# shellcheck disable=SC1091
. /etc/os-release
if [[ ${ID:-} != "debian" ]]; then
  warn "This script targets Debian stable; detected '${PRETTY_NAME:-unknown}'."
  ask_yn "Continue anyway?" n || exit 1
fi
[[ $(dpkg --print-architecture) == "amd64" ]] || die "Only amd64 is supported."
grep -Eq '(vmx|svm)' /proc/cpuinfo || die "CPU virtualization (VT-x/AMD-V) not available. Enable it in your BIOS/UEFI."
[[ -d /sys/firmware/efi ]] || warn "Host is not booted in UEFI mode. Passthrough usually works best with UEFI."

REAL_USER=${SUDO_USER:-}
[[ $REAL_USER == root ]] && REAL_USER=""

# ----------------------------------------------------------------------------
# Step 1: packages
# ----------------------------------------------------------------------------
step "Installing required packages"
info "Updating package lists"
apt_run "apt update" update || die "apt update failed (see log)."
info "Installing: ${PACKAGES[*]}"
apt_run "Installing packages" install "${PACKAGES[@]}" || die "Package installation failed (see log)."
ok "Packages installed"

# ----------------------------------------------------------------------------
# Step 2: detect GPU, check IOMMU group
# ----------------------------------------------------------------------------
step "Detecting GPU"

GPU_BDFS=(); GPU_VENDORS=(); GPU_DESCS=()
for dev in /sys/bus/pci/devices/*; do
  cls=$(<"$dev/class"); ven=$(<"$dev/vendor")
  [[ $cls == 0x03* ]] || continue
  case $ven in
    0x10de) v="nvidia" ;;
    0x1002) v="amd" ;;
    *) continue ;;
  esac
  bdf=${dev##*/}
  boot=""; [[ -r $dev/boot_vga && $(<"$dev/boot_vga") == 1 ]] && boot=" (primary/boot GPU)"
  GPU_BDFS+=("$bdf"); GPU_VENDORS+=("$v")
  GPU_DESCS+=("$(lspci -s "$bdf" -nn | cut -d' ' -f2-)$boot")
done

(( ${#GPU_BDFS[@]} > 0 )) || die "No AMD or NVIDIA GPU found."

if (( ${#GPU_BDFS[@]} == 1 )); then
  sel=0
else
  info "Multiple GPUs found:"
  for i in "${!GPU_BDFS[@]}"; do
    printf '    %d) [%s] %s  %s\n' "$((i + 1))" "${GPU_VENDORS[$i]}" "${GPU_BDFS[$i]}" "${GPU_DESCS[$i]}"
  done
  ask_int sel "Which GPU should go to the VM?" 1 1 "${#GPU_BDFS[@]}"
  sel=$((sel - 1))
fi
GPU_BDF=${GPU_BDFS[$sel]}; GPU_VENDOR=${GPU_VENDORS[$sel]}; GPU_DESC=${GPU_DESCS[$sel]}
GPU_SLOT=${GPU_BDF%.*}
ok "Using ${GPU_VENDOR^^} GPU at $GPU_BDF: $GPU_DESC"

# every function in the same slot (video, HDMI audio, USB-C, ...) goes to the VM
GPU_FUNCS=()
for f in /sys/bus/pci/devices/"$GPU_SLOT".*; do GPU_FUNCS+=("${f##*/}"); done
for f in "${GPU_FUNCS[@]}"; do info "function $f: $(lspci -s "$f" | cut -d' ' -f2-)"; done

GROUP_LINK="/sys/bus/pci/devices/$GPU_BDF/iommu_group"
if [[ -e $GROUP_LINK ]]; then
  bad=()
  for d in "$GROUP_LINK"/devices/*; do
    b=${d##*/}
    [[ $b == "$GPU_SLOT".* ]] && continue
    c=$(<"$d/class")
    [[ $c == 0x0604* || $c == 0x0600* ]] && continue   # bridges are fine
    bad+=("$b $(lspci -s "$b" | cut -d' ' -f2-)")
  done
  if (( ${#bad[@]} )); then
    warn "The GPU shares its IOMMU group with other devices:"
    for b in "${bad[@]}"; do info "  - $b"; done
    warn "Passthrough may need the ACS override patch or a different PCIe slot."
  else
    ok "IOMMU group is clean"
  fi
else
  warn "IOMMU groups not available yet (will be enabled below; a reboot is needed)."
fi

# ----------------------------------------------------------------------------
# Step 3: IOMMU kernel parameters
# ----------------------------------------------------------------------------
step "Checking IOMMU"
if [[ -n $(ls -A /sys/kernel/iommu_groups 2>/dev/null) ]]; then
  ok "IOMMU is active"
else
  if grep -q GenuineIntel /proc/cpuinfo; then IOMMU_PARAM="intel_iommu=on"; else IOMMU_PARAM="amd_iommu=on"; fi
  params="$IOMMU_PARAM iommu=pt"
  if [[ -f /etc/default/grub ]]; then
    if grep -E '^GRUB_CMDLINE_LINUX_DEFAULT=' /etc/default/grub | grep -q "$IOMMU_PARAM"; then
      warn "$IOMMU_PARAM already set but IOMMU is inactive: enable VT-d / AMD-Vi (IOMMU) in your BIOS/UEFI."
    else
      cp -a /etc/default/grub "/etc/default/grub.bak.$(date +%s)"
      if grep -qE '^GRUB_CMDLINE_LINUX_DEFAULT=' /etc/default/grub; then
        sed -i -E "s/^(GRUB_CMDLINE_LINUX_DEFAULT=\"[^\"]*)\"/\1 $params\"/" /etc/default/grub
      else
        echo "GRUB_CMDLINE_LINUX_DEFAULT=\"$params\"" >>/etc/default/grub
      fi
      update-grub >>"$LOG" 2>&1 || warn "update-grub failed, see log."
      ok "Added '$params' to GRUB (backup saved next to /etc/default/grub)"
    fi
  else
    warn "No /etc/default/grub found (systemd-boot?). Add this to your kernel command line: $params"
  fi
  NEED_REBOOT=1
  warn "Also make sure VT-d / AMD-Vi (IOMMU) is enabled in BIOS/UEFI."
fi

# ----------------------------------------------------------------------------
# Questions: VM name, storage, RAM, CPU, USB devices
# ----------------------------------------------------------------------------
step "Configuring the virtual machine"

while true; do
  read -r -p "  VM name [win11]: " VM_NAME; VM_NAME=${VM_NAME:-win11}
  [[ $VM_NAME =~ ^[A-Za-z0-9_-]+$ ]] || { warn "Use only letters, digits, '-' and '_'."; continue; }
  DISK="$IMG_DIR/$VM_NAME.qcow2"
  if virsh dominfo "$VM_NAME" >/dev/null 2>&1; then
    warn "A VM named '$VM_NAME' already exists."
    if ask_yn "Replace its definition? (its disk image is kept)" n; then
      virsh destroy "$VM_NAME" >>"$LOG" 2>&1
      virsh undefine "$VM_NAME" --nvram >>"$LOG" 2>&1 || die "Could not undefine existing VM."
    else
      continue
    fi
  fi
  [[ -e $DISK ]] && { warn "$DISK already exists, pick another name or remove it."; continue; }
  break
done

mkdir -p "$IMG_DIR"
AVAIL_GB=$(( $(df -B1 --output=avail "$IMG_DIR" | tail -n1) / 1024 / 1024 / 1024 ))
HOST_RAM_GB=$(awk '/MemTotal/ {print int($2/1024/1024)}' /proc/meminfo)
HOST_THREADS=$(nproc)

info "Free space in $IMG_DIR: ${AVAIL_GB} GB   |   Host RAM: ${HOST_RAM_GB} GB   |   Host CPU threads: ${HOST_THREADS}"

(( HOST_RAM_GB >= 8 )) || warn "Host has under 8 GB RAM; Windows 11 plus the host will be tight."
RAM_MAX=$(( HOST_RAM_GB > 6 ? HOST_RAM_GB - 2 : 4 )); RAM_DEF=$(( HOST_RAM_GB / 2 ))
(( RAM_DEF < 4 )) && RAM_DEF=4; (( RAM_DEF > 16 )) && RAM_DEF=16; (( RAM_DEF > RAM_MAX )) && RAM_DEF=$RAM_MAX

ask_int DISK_GB "Storage for the Windows disk in GB (min 64)" 128 64 4096
ask_int RAM_GB  "RAM for the VM in GB (min 4)" "$RAM_DEF" 4 "$RAM_MAX"
VCPU_MAX=$(( HOST_THREADS > 2 ? HOST_THREADS - 2 : 2 ))
VCPU_DEF=$(( HOST_THREADS / 2 )); (( VCPU_DEF < 2 )) && VCPU_DEF=2; (( VCPU_DEF % 2 )) && VCPU_DEF=$((VCPU_DEF + 1))
(( VCPU_DEF > VCPU_MAX )) && VCPU_DEF=$VCPU_MAX
ask_int VCPUS "Virtual CPU threads for the VM (min 2)" "$VCPU_DEF" 2 "$VCPU_MAX"

if (( AVAIL_GB < DISK_GB + 10 )); then
  warn "Disk image is thin-provisioned, but free space (${AVAIL_GB} GB) is lower than ${DISK_GB} GB + ISOs."
  ask_yn "Continue anyway?" n || exit 1
fi

# USB devices (the host keyboard/mouse disappear while the VM runs, so pass them in)
USB_IDS=()
mapfile -t USB_LIST < <(lsusb | grep -v ' 1d6b:' || true)
if (( ${#USB_LIST[@]} )); then
  info "Pass USB devices to the VM (your keyboard and mouse, otherwise you cannot control Windows):"
  for i in "${!USB_LIST[@]}"; do printf '    %d) %s\n' "$((i + 1))" "${USB_LIST[$i]}" >&2; done
  read -r -p "  Numbers separated by spaces (blank = none): " picks
  for n in $picks; do
    if [[ $n =~ ^[0-9]+$ ]] && (( n >= 1 && n <= ${#USB_LIST[@]} )); then
      id=$(grep -Eo 'ID [0-9a-f]{4}:[0-9a-f]{4}' <<<"${USB_LIST[$((n - 1))]}" | cut -d' ' -f2)
      USB_IDS+=("$id")
    fi
  done
fi
(( ${#USB_IDS[@]} )) || warn "No USB devices selected. You will need another way (e.g. SSH) to control the VM."

# Shared folder (Samba, reachable only from the VM network)
SHARE_NAME="shared"
SHARE_USER=${REAL_USER:-}
if [[ -z $SHARE_USER ]]; then
  while true; do
    read -r -p "  Linux user who owns the shared folder: " SHARE_USER
    if [[ $SHARE_USER != root ]] && id "$SHARE_USER" >/dev/null 2>&1; then break; fi
    warn "That user does not exist (root is not allowed)."
  done
fi
SHARE_HOME=$(getent passwd "$SHARE_USER" | cut -d: -f6)
read -r -p "  Shared folder on Linux [$SHARE_HOME/WindowsShare]: " SHARE_DIR
SHARE_DIR=${SHARE_DIR:-$SHARE_HOME/WindowsShare}
[[ $SHARE_DIR == /* ]] || SHARE_DIR="$SHARE_HOME/$SHARE_DIR"
info "Windows signs in to the share as '$SHARE_USER'. Choose a password for it (separate from your Linux password)."
while true; do
  read -r -s -p "  Share password: " SMB_PASS; printf '\n'
  read -r -s -p "  Repeat password: " SMB_PASS2; printf '\n'
  [[ -n $SMB_PASS && $SMB_PASS == "$SMB_PASS2" ]] && break
  warn "Passwords are empty or do not match."
done
unset SMB_PASS2

DEFAULT_LANG="${WIN_LANG:-English (United States)}"
printf '\n  %sSummary%s\n' "$C_BOLD" "$C_RESET"
printf '    VM name: %s\n    GPU:     %s (%s)\n    Disk:    %s GB   RAM: %s GB   vCPUs: %s\n    USB:     %s\n    Share:   %s (user %s)\n' \
  "$VM_NAME" "$GPU_DESC" "${GPU_FUNCS[*]}" "$DISK_GB" "$RAM_GB" "$VCPUS" "${USB_IDS[*]:-none}" "$SHARE_DIR" "$SHARE_USER"
ask_yn "Proceed?" y || exit 0

# ----------------------------------------------------------------------------
# Step 4: Rising Prism repo + hooks
# ----------------------------------------------------------------------------
step "Installing Rising Prism single GPU passthrough hooks"

if [[ -d $REPO_DIR/.git ]]; then
  info "Updating existing clone in $REPO_DIR"
  git -C "$REPO_DIR" pull --ff-only >>"$LOG" 2>&1 || warn "Could not update the clone; using the existing copy."
  draw_bar 100 "repository up to date"; printf '\n'
else
  rm -rf "$REPO_DIR"
  git clone --depth 1 --progress "$REPO_URL" "$REPO_DIR" 2>&1 | tr '\r' '\n' | percent_from_stream "Cloning repository" \
    || die "Could not clone $REPO_URL"
fi

mkdir -p /etc/libvirt/hooks /var/log/libvirt

# Run the repo's own installer first (it backs up existing files itself) ...
if [[ -f $REPO_DIR/install_hooks.sh ]]; then
  ( cd "$REPO_DIR" && bash ./install_hooks.sh ) >>"$LOG" 2>&1 \
    && ok "Ran the repository's install_hooks.sh" \
    || warn "install_hooks.sh reported problems (see log); the hooks below are written regardless."
fi

# ... then write hooks tailored to the detected GPU and VM name. The repo's
# stock scripts are hard-coded for other hardware / a different VM name.
for f in /etc/libvirt/hooks/qemu /usr/local/bin/vfio-startup /usr/local/bin/vfio-teardown; do
  [[ -f $f && ! -f $f.rising-original ]] && cp -a "$f" "$f.rising-original"
done

PCI_NODEDEVS=""
for f in "${GPU_FUNCS[@]}"; do PCI_NODEDEVS+=" pci_${f//[:.]/_}"; done
cat >"$CONF" <<EOF
# Generated by single-gpu-passthrough-setup.sh
VM_NAME="$VM_NAME"
GPU_VENDOR="$GPU_VENDOR"
PCI_DEVICES=($PCI_NODEDEVS )
EOF

cat >/usr/local/bin/vfio-startup <<'EOF'
#!/bin/bash
# Detach the GPU from the host and hand it to vfio-pci (Rising Prism layout).
# shellcheck source=/dev/null
source /etc/single-gpu-passthrough.conf || exit 1
STATE=/run/single-gpu-passthrough.modules
set -x

case "$GPU_VENDOR" in
  nvidia) CANDIDATES=(i2c_nvidia_gpu nvidia_drm nvidia_modeset nvidia_uvm nvidia nouveau) ;;
  amd)    CANDIDATES=(amdgpu radeon) ;;
  *)      echo "unknown GPU vendor"; exit 1 ;;
esac

# Stop the display manager and wait for it to be gone
systemctl stop display-manager.service
for _ in $(seq 1 15); do systemctl is-active --quiet display-manager.service || break; sleep 1; done
systemctl stop nvidia-persistenced.service 2>/dev/null || true

# Unbind framebuffer consoles and firmware framebuffers
for vt in /sys/class/vtconsole/vtcon*; do
  if [ -e "$vt/name" ] && grep -q 'frame buffer' "$vt/name"; then echo 0 > "$vt/bind"; fi
done
for drv in efi-framebuffer simple-framebuffer; do
  for dev in /sys/bus/platform/drivers/$drv/$drv.*; do
    [ -e "$dev" ] && basename "$dev" > "/sys/bus/platform/drivers/$drv/unbind"
  done
done
sleep 2

# Unload GPU drivers (remember which ones, so teardown can reload them)
: > "$STATE"
for m in "${CANDIDATES[@]}"; do
  if lsmod | awk '{print $1}' | grep -qx "$m"; then
    echo "$m" >> "$STATE"
    done_=0
    for _ in $(seq 1 10); do
      if modprobe -r "$m"; then done_=1; break; fi
      sleep 1
    done
    if [ "$done_" -ne 1 ]; then
      echo "Could not unload $m; processes still using the GPU:"
      fuser -v /dev/dri/* /dev/nvidia* 2>&1
      /usr/local/bin/vfio-teardown
      exit 1
    fi
  fi
done

modprobe vfio-pci
for dev in "${PCI_DEVICES[@]}"; do
  if ! virsh nodedev-detach "$dev"; then
    echo "Failed to detach $dev, restoring the host display"
    /usr/local/bin/vfio-teardown
    exit 1
  fi
done
exit 0
EOF

cat >/usr/local/bin/vfio-teardown <<'EOF'
#!/bin/bash
# Give the GPU back to the host and restart the display manager.
# shellcheck source=/dev/null
source /etc/single-gpu-passthrough.conf || exit 1
STATE=/run/single-gpu-passthrough.modules
set -x

for dev in "${PCI_DEVICES[@]}"; do virsh nodedev-reattach "$dev"; done

# Reload the drivers that startup unloaded, in reverse order
if [ -s "$STATE" ]; then
  mapfile -t mods < <(tac "$STATE")
  for m in "${mods[@]}"; do modprobe "$m"; done
  rm -f "$STATE"
fi

for vt in /sys/class/vtconsole/vtcon*; do
  if [ -e "$vt/name" ] && grep -q 'frame buffer' "$vt/name"; then echo 1 > "$vt/bind"; fi
done

[ "$GPU_VENDOR" = nvidia ] && systemctl start nvidia-persistenced.service 2>/dev/null
systemctl start display-manager.service
exit 0
EOF

cat >/etc/libvirt/hooks/qemu <<'EOF'
#!/bin/bash
# libvirt hook: $1 = guest name, $2 = operation, $3 = sub-operation
# shellcheck source=/dev/null
source /etc/single-gpu-passthrough.conf || exit 0
OBJECT="$1"; OPERATION="$2"; SUB="$3"
LOGFILE=/var/log/libvirt/custom_hooks.log

if [ "$OBJECT" = "$VM_NAME" ]; then
  case "$OPERATION/$SUB" in
    prepare/begin)
      systemctl start "libvirt-nosleep@$OBJECT" >>"$LOGFILE" 2>&1
      /usr/local/bin/vfio-startup >>"$LOGFILE" 2>&1
      exit $?
      ;;
    release/end)
      /usr/local/bin/vfio-teardown >>"$LOGFILE" 2>&1
      systemctl stop "libvirt-nosleep@$OBJECT" >>"$LOGFILE" 2>&1
      ;;
  esac
fi
exit 0
EOF

# Keep the repo's no-sleep unit if present, otherwise write an equivalent one
NOSLEEP=/etc/systemd/system/libvirt-nosleep@.service
if [[ -f $REPO_DIR/systemd-no-sleep/libvirt-nosleep@.service ]]; then
  cp -f "$REPO_DIR/systemd-no-sleep/libvirt-nosleep@.service" "$NOSLEEP"
elif [[ ! -f $NOSLEEP ]]; then
  cat >"$NOSLEEP" <<'EOF'
[Unit]
Description=Preventing sleep while libvirt domain "%i" is running

[Service]
Type=simple
ExecStart=/usr/bin/systemd-inhibit --what=sleep --why="Libvirt domain \"%i\" is running" --who=%U --mode=block sleep infinity
EOF
fi

# Permissions
chown root:root /etc/libvirt/hooks/qemu /usr/local/bin/vfio-startup /usr/local/bin/vfio-teardown "$CONF" "$NOSLEEP"
chmod 755 /etc/libvirt/hooks /etc/libvirt/hooks/qemu /usr/local/bin/vfio-startup /usr/local/bin/vfio-teardown
chmod 644 "$CONF" "$NOSLEEP"
touch /var/log/libvirt/custom_hooks.log; chmod 640 /var/log/libvirt/custom_hooks.log
systemctl daemon-reload
draw_bar 100 "hooks installed"; printf '\n'
ok "Hooks installed: /etc/libvirt/hooks/qemu, /usr/local/bin/vfio-startup, /usr/local/bin/vfio-teardown"

# ----------------------------------------------------------------------------
# Step 5: libvirt service, groups, network
# ----------------------------------------------------------------------------
step "Configuring libvirt and permissions"

systemctl enable --now libvirtd.service >>"$LOG" 2>&1 || systemctl enable --now libvirtd.socket >>"$LOG" 2>&1 \
  || warn "Could not enable libvirtd (see log)."
systemctl restart libvirtd.service >>"$LOG" 2>&1 || warn "Could not restart libvirtd; run 'sudo systemctl restart libvirtd' before starting the VM."
sleep 2
virsh net-info default >/dev/null 2>&1 || virsh net-define /usr/share/libvirt/networks/default.xml >>"$LOG" 2>&1
virsh net-autostart default >>"$LOG" 2>&1
virsh net-start default >>"$LOG" 2>&1 || true
ok "libvirt running, default network enabled"

if [[ -n $REAL_USER ]]; then
  for g in libvirt kvm; do getent group "$g" >/dev/null && usermod -aG "$g" "$REAL_USER"; done
  ok "Added $REAL_USER to the libvirt and kvm groups (log out and in again to apply)"
fi
draw_bar 100 "libvirt configured"; printf '\n'

# ----------------------------------------------------------------------------
# Step 6: shared folder (Samba, bound to the VM network only)
# ----------------------------------------------------------------------------
step "Setting up the shared folder"

VM_NET_IP=$(virsh net-dumpxml default 2>/dev/null | sed -n "s/.*<ip address='\([0-9.]*\)'.*/\1/p" | head -n1)
VM_NET_IP=${VM_NET_IP:-192.168.122.1}

install -d -o "$SHARE_USER" -g "$(id -gn "$SHARE_USER")" -m 775 "$SHARE_DIR" \
  || die "Could not create $SHARE_DIR"
draw_bar 20 "shared folder created"

# Convenience script for Windows (CRLF line endings), maps the share as drive S:
printf '@echo off\r\nnet use S: \\\\%s\\%s /user:%s * /persistent:yes\r\npause\r\n' \
  "$VM_NET_IP" "$SHARE_NAME" "$SHARE_USER" >"$SHARE_DIR/Map-Shared-Drive.bat"
chown "$SHARE_USER": "$SHARE_DIR/Map-Shared-Drive.bat"

SMB_CONF=/etc/samba/smb.conf
[[ -f $SMB_CONF ]] || printf '[global]\n   workgroup = WORKGROUP\n   server role = standalone server\n' >"$SMB_CONF"
cp -a "$SMB_CONF" "$SMB_CONF.bak.$(date +%s)"
sed -i '/^# BEGIN single-gpu-passthrough share/,/^# END single-gpu-passthrough share/d' "$SMB_CONF"

# Only listen on the loopback and the VM network, not on your LAN
if grep -Eq '^[[:space:]]*(bind interfaces only|interfaces)[[:space:]]*=' "$SMB_CONF"; then
  warn "smb.conf already restricts interfaces. Make sure it includes 'virbr0' so Windows can connect."
elif grep -q '^\[global\]' "$SMB_CONF"; then
  sed -i "0,/^\[global\]/s//[global]\n   interfaces = lo virbr0\n   bind interfaces only = yes/" "$SMB_CONF"
else
  warn "No [global] section in smb.conf; could not restrict Samba to the VM network."
fi

cat >>"$SMB_CONF" <<EOF

# BEGIN single-gpu-passthrough share
[$SHARE_NAME]
   comment = Shared folder between the Linux host and the Windows VM
   path = $SHARE_DIR
   browseable = yes
   read only = no
   guest ok = no
   valid users = $SHARE_USER
   force user = $SHARE_USER
   hosts allow = ${VM_NET_IP%.*}. 127.0.0.1
   hosts deny = ALL
   create mask = 0664
   directory mask = 0775
# END single-gpu-passthrough share
EOF

if ! testparm -s "$SMB_CONF" >>"$LOG" 2>&1; then
  latest=$(ls -t "$SMB_CONF".bak.* | head -n1); cp -a "$latest" "$SMB_CONF"
  die "Generated Samba config was invalid; restored your previous smb.conf (see log)."
fi
draw_bar 60 "samba configured"

printf '%s\n%s\n' "$SMB_PASS" "$SMB_PASS" | smbpasswd -s -a "$SHARE_USER" >>"$LOG" 2>&1 \
  || die "Could not set the Samba password for $SHARE_USER (see log)."
unset SMB_PASS

# Start Samba after libvirt, so the virbr0 interface exists
mkdir -p /etc/systemd/system/smbd.service.d
cat >/etc/systemd/system/smbd.service.d/after-libvirt.conf <<'EOF'
[Unit]
After=libvirtd.service
Wants=libvirtd.service
EOF
systemctl daemon-reload
systemctl enable smbd.service >>"$LOG" 2>&1
systemctl restart smbd.service >>"$LOG" 2>&1 || warn "smbd did not start; check 'systemctl status smbd'."
draw_bar 90 "samba started"

if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q 'Status: active'; then
  ufw allow in on virbr0 to any port 445 proto tcp >>"$LOG" 2>&1 && ok "ufw: allowed SMB (445) on virbr0 only"
fi

draw_bar 100 "shared folder ready"; printf '\n'
ss -ltn "sport = :445" 2>/dev/null | grep -q "$VM_NET_IP" \
  && ok "Samba is listening on $VM_NET_IP" \
  || warn "Samba is not listening on $VM_NET_IP yet; it will after the VM network is up (reboot or 'sudo systemctl restart smbd')."
ok "Share '$SHARE_NAME' -> $SHARE_DIR (from Windows: \\\\$VM_NET_IP\\$SHARE_NAME)"

# ----------------------------------------------------------------------------
# Step 7: ISOs
# ----------------------------------------------------------------------------
step "Downloading virtio drivers"
download "$VIRTIO_URL" "$VIRTIO_ISO" "virtio-win drivers" \
  || die "Could not download the virtio-win ISO. Re-run the script to resume."

step "Getting the Windows 11 ISO"

resolve_win_iso_url() { # prints the URL on stdout; diagnostics on stderr
  local lang=$1 sid pid skus sku links url
  local api="https://www.microsoft.com/software-download-connector/api" page
  sid=$(cat /proc/sys/kernel/random/uuid)
  page=$(curl -fsSL --max-time 30 -A "$UA" "$WIN_PAGE") || { warn "Could not reach Microsoft's download page."; return 1; }
  pid=$(grep -Eo '<option value="[0-9]+">Windows' <<<"$page" | head -n1 | grep -Eo '[0-9]+')
  [[ -n $pid ]] || { warn "Could not find the Windows 11 edition ID on Microsoft's page."; return 1; }
  curl -fsS --max-time 30 -A "$UA" -o /dev/null \
    "https://vlscppe.microsoft.com/tags?org_id=y6jn8c31&session_id=$sid" || true
  skus=$(curl -fsS --max-time 30 -A "$UA" \
    "$api/getskuinformationbyproductedition?profile=606624d44113&productEditionId=$pid&SKU=undefined&friendlyFileName=undefined&Locale=en-US&sessionID=$sid") \
    || { warn "Microsoft's SKU lookup failed."; return 1; }
  sku=$(jq -r --arg l "${lang,,}" \
    '[.Skus[]? | select(((.Language // "") | ascii_downcase) == $l or ((.LocalizedLanguage // "") | ascii_downcase) == $l)][0].Id // empty' <<<"$skus")
  if [[ -z $sku ]]; then
    warn "Language '$lang' not offered. Available: $(jq -r '[.Skus[]?.LocalizedLanguage] | join(", ")' <<<"$skus")"
    return 2
  fi
  links=$(curl -fsS --max-time 30 -A "$UA" --referer "$WIN_PAGE" \
    "$api/GetProductDownloadLinksBySku?profile=606624d44113&productEditionId=undefined&SKU=$sku&friendlyFileName=undefined&Locale=en-US&sessionID=$sid") \
    || { warn "Microsoft's download-link request failed."; return 1; }
  url=$(jq -r '[.ProductDownloadOptions[]? | select(.Uri | test("x64"))][0].Uri // empty' <<<"$links")
  if [[ -z $url ]]; then
    warn "Microsoft did not return a download link: $(jq -r '.Errors[0].Value // "unknown reason"' <<<"$links")"
    warn "This happens when Microsoft flags the IP (VPN, too many requests). Try again later."
    return 3
  fi
  printf '%s' "$url"
}

manual_iso() {
  info "Download the Windows 11 x64 ISO from: $WIN_PAGE"
  while true; do
    read -r -p "  Path to the ISO file, or a direct download URL: " src
    if [[ $src =~ ^https?:// ]]; then
      download "$src" "$WIN_ISO" "Windows 11 ISO" && return 0
    elif [[ -f $src ]]; then
      info "Copying ISO into place"
      cp --reflink=auto "$src" "$WIN_ISO" && return 0
    else
      warn "Not found: $src"
    fi
  done
}

if [[ -s $WIN_ISO ]]; then
  ok "Windows 11 ISO already present ($(du -h "$WIN_ISO" | cut -f1))"
elif [[ -n ${WIN_ISO_SOURCE:-} ]]; then
  if [[ $WIN_ISO_SOURCE =~ ^https?:// ]]; then
    download "$WIN_ISO_SOURCE" "$WIN_ISO" "Windows 11 ISO" || die "Download failed."
  else
    cp --reflink=auto "$WIN_ISO_SOURCE" "$WIN_ISO" || die "Could not copy $WIN_ISO_SOURCE"
  fi
else
  read -r -p "  Windows language [$DEFAULT_LANG]: " WLANG; WLANG=${WLANG:-$DEFAULT_LANG}
  info "Asking Microsoft for a download link"
  WIN_URL=$(resolve_win_iso_url "$WLANG"); rc=$?
  if (( rc == 0 )) && [[ -n $WIN_URL ]]; then
    download "$WIN_URL" "$WIN_ISO" "Windows 11 ISO" || { warn "Automatic download failed."; manual_iso; }
  else
    warn "Automatic ISO lookup did not work."
    manual_iso
  fi
fi
ISO_SIZE=$(stat -c %s "$WIN_ISO")
(( ISO_SIZE > 3000000000 )) || die "$WIN_ISO looks too small ($ISO_SIZE bytes), remove it and re-run."

# ----------------------------------------------------------------------------
# Step 7: create the disk and the VM
# ----------------------------------------------------------------------------
step "Creating the virtual machine"

draw_bar 0 "creating ${DISK_GB} GB disk"
qemu-img create -f qcow2 -o lazy_refcounts=on "$DISK" "${DISK_GB}G" >>"$LOG" 2>&1 || die "qemu-img failed (see log)."
draw_bar 100 "disk created"; printf '\n'

QEMU_USER="libvirt-qemu"; id "$QEMU_USER" >/dev/null 2>&1 || QEMU_USER="root"
chown "$QEMU_USER":"$(id -gn "$QEMU_USER")" "$DISK"; chmod 660 "$DISK"
chown root:root "$WIN_ISO" "$VIRTIO_ISO"; chmod 644 "$WIN_ISO" "$VIRTIO_ISO"

# CPU topology
if (( VCPUS % 2 == 0 )); then CORES=$((VCPUS / 2)); THREADS=2; else CORES=$VCPUS; THREADS=1; fi

# PCI hostdevs
HOSTDEVS=""
for f in "${GPU_FUNCS[@]}"; do
  HOSTDEVS+="    <hostdev mode='subsystem' type='pci' managed='yes'>
      <source>
        <address domain='0x${f:0:4}' bus='0x${f:5:2}' slot='0x${f:8:2}' function='0x${f:11:1}'/>
      </source>
    </hostdev>
"
done
for id in "${USB_IDS[@]}"; do
  HOSTDEVS+="    <hostdev mode='subsystem' type='usb' managed='yes'>
      <source>
        <vendor id='0x${id%%:*}'/>
        <product id='0x${id##*:}'/>
      </source>
    </hostdev>
"
done

KVM_HIDDEN=""; VENDOR_ID=""
if [[ $GPU_VENDOR == nvidia ]]; then
  KVM_HIDDEN="<kvm><hidden state='on'/></kvm>"
  VENDOR_ID="<vendor_id state='on' value='KVMKVMKVM'/>"
fi

XML=$(mktemp /tmp/"$VM_NAME".XXXXXX.xml)
cat >"$XML" <<EOF
<domain type='kvm'>
  <name>$VM_NAME</name>
  <metadata>
    <description>Windows 11 single GPU passthrough VM (created by single-gpu-passthrough-setup.sh)</description>
  </metadata>
  <memory unit='GiB'>$RAM_GB</memory>
  <currentMemory unit='GiB'>$RAM_GB</currentMemory>
  <vcpu placement='static'>$VCPUS</vcpu>
  <os firmware='efi'>
    <type arch='x86_64' machine='q35'>hvm</type>
    <firmware>
      <feature enabled='yes' name='enrolled-keys'/>
      <feature enabled='yes' name='secure-boot'/>
    </firmware>
  </os>
  <features>
    <acpi/>
    <apic/>
    <hyperv mode='custom'>
      <relaxed state='on'/>
      <vapic state='on'/>
      <spinlocks state='on' retries='8191'/>
      <vpindex state='on'/>
      <runtime state='on'/>
      <synic state='on'/>
      <stimer state='on'/>
      $VENDOR_ID
      <frequencies state='on'/>
    </hyperv>
    $KVM_HIDDEN
    <vmport state='off'/>
    <smm state='on'/>
  </features>
  <cpu mode='host-passthrough' check='none' migratable='off'>
    <topology sockets='1' dies='1' cores='$CORES' threads='$THREADS'/>
    <cache mode='passthrough'/>
    <feature policy='require' name='topoext'/>
  </cpu>
  <clock offset='localtime'>
    <timer name='rtc' tickpolicy='catchup'/>
    <timer name='pit' tickpolicy='delay'/>
    <timer name='hpet' present='no'/>
    <timer name='hypervclock' present='yes'/>
  </clock>
  <on_poweroff>destroy</on_poweroff>
  <on_reboot>restart</on_reboot>
  <on_crash>destroy</on_crash>
  <pm>
    <suspend-to-mem enabled='no'/>
    <suspend-to-disk enabled='no'/>
  </pm>
  <devices>
    <emulator>/usr/bin/qemu-system-x86_64</emulator>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2' cache='none' io='native' discard='unmap'/>
      <source file='$DISK'/>
      <target dev='vda' bus='virtio'/>
      <boot order='2'/>
    </disk>
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <source file='$WIN_ISO'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
      <boot order='1'/>
    </disk>
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <source file='$VIRTIO_ISO'/>
      <target dev='sdb' bus='sata'/>
      <readonly/>
    </disk>
    <controller type='usb' model='qemu-xhci' ports='15'/>
    <interface type='network'>
      <source network='default'/>
      <model type='virtio'/>
    </interface>
    <tpm model='tpm-crb'>
      <backend type='emulator' version='2.0'/>
    </tpm>
$HOSTDEVS    <memballoon model='none'/>
  </devices>
</domain>
EOF
# The Windows install runs on the passed-through GPU's monitor: no virtual display is added.

virsh define "$XML" >>"$LOG" 2>&1 || { cat "$XML" >>"$LOG"; die "virsh define failed (see log; XML is at $XML)."; }
rm -f "$XML"
draw_bar 100 "VM defined"; printf '\n'
ok "VM '$VM_NAME' defined"

# ----------------------------------------------------------------------------
# Step 8: done
# ----------------------------------------------------------------------------
step "Finished"
cat <<EOF

  ${C_GREEN}${C_BOLD}Setup complete.${C_RESET}

  GPU:   ${GPU_VENDOR^^}  $GPU_DESC
  VM:    $VM_NAME  (${DISK_GB} GB disk, ${RAM_GB} GB RAM, ${VCPUS} vCPUs, UEFI + Secure Boot + TPM 2.0)
  Disk:  $DISK
  Log:   $LOG   (hook log: /var/log/libvirt/custom_hooks.log)

EOF
if (( NEED_REBOOT )); then
  printf '  %s>>> REBOOT REQUIRED to activate IOMMU. Do this before starting the VM. <<<%s\n\n' "$C_YELLOW" "$C_RESET"
fi
cat <<EOF
  ${C_BOLD}Starting the VM${C_RESET}
    Your desktop will close and the monitor will show Windows. When the VM shuts
    down, the desktop comes back. For the first run, keep an SSH session open
    from another device so you can recover if something goes wrong:
        sudo virsh start $VM_NAME

  ${C_BOLD}Installing Windows${C_RESET}
    1. Press a key when "Press any key to boot from CD or DVD" appears.
    2. At "Where do you want to install Windows?" click "Load driver" > Browse and
       pick the CD drive virtio-win: viostor\\w11\\amd64  (this makes the disk visible).
    3. No internet at the first setup screen: press Shift+F10, run OOBE\\BYPASSNRO
       (the PC restarts), then choose "I don't have internet".
    4. Inside Windows, run virtio-win-guest-tools.exe from the virtio-win CD,
       then install the ${GPU_VENDOR^^} graphics driver from the vendor's site.

  ${C_BOLD}Shared folder${C_RESET}
    Linux:   $SHARE_DIR   (paste files here from your file manager)
    Windows: open File Explorer, type  \\\\$VM_NET_IP\\$SHARE_NAME  in the address bar,
             sign in as '$SHARE_USER' with the share password and tick "Remember my credentials".
             Right-click the share > "Map network drive" to get a permanent drive letter,
             or run Map-Shared-Drive.bat from inside the share (maps it as S:).
    Open files straight from the share, or copy them onto the Windows C: drive.
    Samba only listens on the VM network (virbr0), not on your LAN.

  ${C_BOLD}Notes${C_RESET}
    - Older AMD cards (Vega, Navi 10) may suffer the "reset bug"; see the vendor-reset project.
    - If you ever get a black screen after the VM stops, switch to a TTY (Ctrl+Alt+F3)
      and run: sudo /usr/local/bin/vfio-teardown
    - The repo's original hook files were saved with a ".rising-original" suffix.
    - Group changes for $REAL_USER need a re-login.
EOF
