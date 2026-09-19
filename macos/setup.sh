#!/usr/bin/env bash
#
# setup.sh — unified dotfiles manager for ./macos
#
# Replaces: dotfilesupdate.sh + macosdefaults.sh + start.sh
#
# Behaviour:
#   * Detects whether dotfiles are already installed on this Mac.
#     If YES -> skips installer, notifies user, offers:
#       [1] apply macOS defaults / animations (tiling vs normie)
#       [2] launch programs (aerospace / borders / sketchybar / …)
#       [3] update repo (sync ~/.config + ~/.* dotfiles + brew lists
#           into ./macos/files/, then git add/commit/push with changelog)
#   * If NO  -> runs a comprehensive installer:
#       yes-to-everything mode (instant animations, hidden dock,
#       always-visible menubar, aerospace+borders autostart, all apps)
#   or step-by-step mode (tiling stack only? full apps? etc.)
#
# Menus use vim keybinds: j/k or arrow keys to move, Enter to select,
# 1-N to jump straight to an option, g/G first/last, q/Esc to go back.
# y/n prompts are single-keypress (no Enter needed) on a TTY.
# The screen clears after every selection to keep things readable.
#
# Usage:
#   ./setup.sh                        # auto-detect + interactive menu
#   ./setup.sh --check                # only print detection result
#   ./setup.sh --install [--yes]      # force fresh installer
#   ./setup.sh --update  [--yes]      # force repo sync + push
#   ./setup.sh --defaults             # only macOS defaults menu
#   ./setup.sh --launch               # only launch programs
#   ./setup.sh --help
#
set -u

# ---------------------------------------------------------------- paths ---

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FILES_DIR="${SCRIPT_DIR}/files"
BREWFILE="${FILES_DIR}/Brewfile"
FORMULAE_TXT="${FILES_DIR}/formulae.txt"
CASKS_TXT="${FILES_DIR}/casks.txt"
SENTINEL="${HOME}/.dotfiles_installed"

# Home dotfiles managed by this repo (top-level files in FILES_DIR).
HOME_DOTFILES=( ".aerospace.toml" ".zshrc" ".skhdrc" ".yabairc" ".wezterm.lua" )
# Extra home dirs synced on update.
HOME_SYNC_DIRS=( ".mpd" )
# ~/.config subdirs we never push (secrets / caches / noise).
CONFIG_EXCLUDES=( "gh" "opencode" "sketchybar_backup" "Cache" "cache" )

# Minimal tiling stack (used for "tiling only" installs).
TILING_FORMULAE="borders yabai skhd"
TILING_CASKS="aerospace alt-tab monitorcontrol"

# Fallback full lists (used when no Brewfile/formulae.txt exists yet).
# Regenerated from `brew list` on 2026-09-19; `setup.sh --update`
# refreshes formulae.txt / casks.txt / Brewfile automatically.
FALLBACK_FORMULAE="abseil adwaita-icon-theme aom appstream autoconf automake boost borders btop ca-certificates cairo certifi cffi chromaprint cmake dav1d deno faad2 fastfetch ffmpeg fftw fileicon flac fluid-synth fmt fontconfig freetype fribidi game-music-emu gdk-pixbuf gettext gh giflib git git-lfs glib gmp gnutls gobject-introspection gradle gradle-completion gradle@8 graphene graphite2 gtk4 harfbuzz hf hicolor-icon-theme icu4c@78 imagemagick iproute2mac jpeg-turbo json-c lame libadwaita libao libdatrie libde265 libepoxy libevent libfyaml libheif libid3tag libidn2 libmicrohttpd libmikmod libmpdclient libnfs libnghttp2 libnpupnp libogg libomp libpng libpsl librsvg libsamplerate libsass libshout libsndfile libsoxr libtasn1 libthai libtiff libtool libunistring libuv libvmaf libvorbis libvpx libx11 libxau libxcb libxdmcp libxext libxmlb libxrender libyaml little-cms2 lpeg lua luajit luv lz4 lzo m4 miniupnpc mlx mlx-c molten-vk mpd mpdecimal mpg123 mysql nasm ncmpcpp ncurses neovim nettle nicotine-plus ninja nowplaying-cli ollama opencode openjdk openjdk@17 openjdk@21 openjdk@25 openssl@3 opus p11-kit p7zip pango pcre2 pixman pkgconf portaudio protobuf py3cairo pycparser pygobject3 python@3.12 python@3.13 python@3.14 readline ripgrep rmpc sdl2-compat sdl3 sevenzip skhd speex sqlite svt-av1 switchaudio-osx taglib theora transmission-cli tree-sitter ueberzugpp unbound unibilium utf8cpp utf8proc wavpack webp x264 x265 xorgproto xz yabai yazi yt-dlp yyjson zlib-ng-compat zsh-autosuggestions zstd"
FALLBACK_CASKS="aerospace alacritty alt-tab audacity balenaetcher brave-browser claude-code discord dolphin firefox font-hack-nerd-font font-sf-mono font-sf-pro gimp karabiner-elements kitty libreoffice librewolf localsend lunar-client monitorcontrol mos mullvad-vpn obs obsidian prismlauncher raycast sf-symbols steam temurin@21 temurin@8 unsloth utm vorssaint zoom"
GAMES_CASKS="steam ungoogled-chromium balenaetcher heroic luanti mullvad-vpn obs obsidian discord prismlauncher dolphin ares-emulator"

YES_TO_ALL=0
FORCE_MODE=""

# ----------------------------------------------------------------- ui ---

if [ -t 1 ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'
  GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BLUE=$'\033[34m'; RESET=$'\033[0m'
else
  BOLD=""; DIM=""; RED=""; GREEN=""; YELLOW=""; BLUE=""; RESET=""
fi

info()    { printf "%s[..]%s %s\n" "${BLUE}" "${RESET}" "$*"; }
success() { printf "%s[ok]%s %s\n" "${GREEN}" "${RESET}" "$*"; }
warn()    { printf "%s[!!]%s %s\n" "${YELLOW}" "${RESET}" "$*"; }
err()     { printf "%s[err]%s %s\n" "${RED}" "${RESET}" "$*" >&2; }
header()  { printf "\n%s== %s ==%s\n" "${BOLD}" "$*" "${RESET}"; }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

# ask_yes_no "prompt" [default N|Y] -> return 0 for yes
# Single keypress (y/n/Enter/q/Esc) when stdin is a TTY, line-based otherwise.
ask_yes_no() {
  local prompt="$1" def="${2:-N}" ans hint key
  if [ "${YES_TO_ALL}" -eq 1 ]; then return 0; fi
  if [ "${def}" = "Y" ]; then hint="Y/n"; else hint="y/N"; fi
  if [ -t 0 ]; then
    while true; do
      printf "%s [%s] (y/n, q=no): " "$prompt" "$hint"
      IFS= read -rsn1 key || key=""
      printf "\n"
      case "${key}" in
        "") [ "${def}" = "Y" ] && return 0 || return 1 ;;
        [Yy]) return 0 ;;
        [Nn]|q|Q|$'\e') return 1 ;;
      esac
    done
  fi
  printf "%s [%s]: " "$prompt" "$hint"
  read -r ans || ans=""
  case "$ans" in
    [Yy]|[Yy][Ee][Ss]) return 0 ;;
    "") [ "${def}" = "Y" ] && return 0 || return 1 ;;
    *) return 1 ;;
  esac
}

# vim_menu "prompt" "opt1" "opt2" [...] -> echoes 1-based index of choice.
# Returns nonzero on q/Esc (caller should treat as Back/Quit).
# Interactive keys: j/k or Up/Down move, Enter selects, 1-N jumps straight
# to an option, g/G first/last, q or Esc backs out.
# The menu UI goes to stderr so $(...) captures only the result number.
# When stdin is not a TTY (pipes/CI) it falls back to a plain numbered read
# and echoes back whatever was typed (callers handle unknown via `*)`).
vim_menu() {
  local prompt="$1"; shift
  local options=("$@")
  local count=$# sel=1 i key k2 k3
  [ "${count}" -gt 0 ] || return 1
  if [ ! -t 0 ]; then
    local n
    for n in "${!options[@]}"; do printf '  [%d] %s\n' "$((n + 1))" "${options[$n]}" >&2; done
    printf '%s [1-%d]: ' "${prompt}" "${count}" >&2
    read -r key || key=""
    echo "${key}"
    return 0
  fi
  local first=1
  while true; do
    if [ "${first}" -eq 0 ]; then printf '\033[%dA' "$((count + 1))" >&2; fi
    first=0
    printf '%s %s(j/k + Enter, 1-%d jump, q back)%s\n' "${prompt}" "${DIM}" "${count}" "${RESET}" >&2
    for ((i = 1; i <= count; i++)); do
      if [ "${i}" -eq "${sel}" ]; then
        printf '\r\033[K%s> %d) %s%s\n' "${GREEN}" "${i}" "${options[$((i - 1))]}" "${RESET}" >&2
      else
        printf '\r\033[K  %d) %s\n' "${i}" "${options[$((i - 1))]}" >&2
      fi
    done
    IFS= read -rsn1 key || { clear_screen; return 1; }
    case "${key}" in
      $'\e')
        IFS= read -rsn1 -t 0.2 k2 || k2=""
        if [ "${k2}" = "[" ] || [ "${k2}" = "O" ]; then
          IFS= read -rsn1 -t 0.2 k3 || k3=""
          case "${k3}" in
            A) [ "${sel}" -gt 1 ] && sel=$((sel - 1)) ;;
            B) [ "${sel}" -lt "${count}" ] && sel=$((sel + 1)) ;;
          esac
        else
          clear_screen; return 1
        fi
        ;;
      "") clear_screen; echo "${sel}"; return 0 ;;
      j|J) [ "${sel}" -lt "${count}" ] && sel=$((sel + 1)) ;;
      k|K) [ "${sel}" -gt 1 ] && sel=$((sel - 1)) ;;
      g) sel=1 ;;
      G) sel="${count}" ;;
      q|Q) clear_screen; return 1 ;;
      [1-9]) if [ "${key}" -le "${count}" ]; then clear_screen; echo "${key}"; return 0; fi ;;
    esac
  done
}

pause() { if [ -t 0 ]; then printf "%sPress Enter to continue...%s" "${DIM}" "${RESET}"; read -r _ || true; fi; }

# Wipe the screen on real terminals only (never in pipes/logs).
# Always writes to stderr so $(...) captures stay clean.
# Tests fd 2 as well as fd 1 because menus run inside $(...) (where fd 1
# is a pipe) while their UI — and the user's terminal — is on stderr.
clear_screen() { if [ -t 1 ] || [ -t 2 ]; then clear >&2 2>/dev/null || printf '\033c' >&2; fi; }

usage() {
  sed -n '2,/^set -u$/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
  echo "Flags: --check --install --update --defaults --launch --yes (-y) --help (-h)"
}

# ------------------------------------------------------------ detection ---

# Installed == sentinel exists OR enough known dotfiles are in place.
dotfiles_installed() {
  if [ -f "${SENTINEL}" ]; then return 0; fi
  local hits=0 f
  for f in ".aerospace.toml" ".zshrc" ".skhdrc" ".yabairc"; do
    [ -f "${HOME}/${f}" ] && hits=$((hits + 1))
  done
  for f in "nvim" "sketchybar" "borders" "alacritty" "btop" "karabiner"; do
    [ -d "${HOME}/.config/${f}" ] && hits=$((hits + 1))
  done
  [ "${hits}" -ge 4 ]
}

print_detection() {
  if dotfiles_installed; then
    success "Dotfiles appear to be INSTALLED on this Mac (marker files found in \$HOME / ~/.config)."
  else
    warn "Dotfiles do NOT appear to be installed on this Mac."
  fi
}

# --------------------------------------------------------------- brew ---

ensure_brew() {
  if have_cmd brew; then success "Homebrew already installed ($(brew --version | head -n1))"; return 0; fi
  header "Installing Homebrew"
  if ! ask_yes_no "Install Homebrew now?" Y; then warn "Skipping Homebrew — package steps will fail."; return 1; fi
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  if [ -x "/opt/homebrew/bin/brew" ]; then eval "$(/opt/homebrew/bin/brew shellenv)"; fi
  have_cmd brew || { err "Homebrew install failed."; return 1; }
  success "Homebrew installed."
}

brew_install_list() {
  local kind="$1"; shift  # kind = formula|cask, rest = packages
  local extra="" pkg failed=0
  [ "${kind}" = "cask" ] && extra="--cask"
  # shellcheck disable=SC2086
  for pkg in $*; do
    [ -z "${pkg}" ] && continue
    if [ "${kind}" = "cask" ] && brew list --cask "${pkg}" >/dev/null 2>&1; then
      info "cask ${pkg} already installed, skipping."
    elif [ "${kind}" = "formula" ] && brew list --formula "${pkg}" >/dev/null 2>&1; then
      info "formula ${pkg} already installed, skipping."
    else
      info "brew install ${extra} ${pkg} ..."
      # shellcheck disable=SC2086
      if ! brew install ${extra} "${pkg}"; then warn "failed: ${pkg}"; failed=$((failed+1)); fi
    fi
  done
  return "${failed}"
}

install_from_brewfile() {
  if [ ! -f "${BREWFILE}" ]; then return 1; fi
  header "Installing from Brewfile"
  brew bundle --file="${BREWFILE}" || warn "brew bundle reported errors (continuing)."
}

# Desired full formula/cask list: formulae.txt > Brewfile parse > fallback.
desired_formulae() {
  if [ -f "${FORMULAE_TXT}" ]; then tr '\n' ' ' < "${FORMULAE_TXT}"
  else echo "${FALLBACK_FORMULAE}"
  fi
}
desired_casks() {
  if [ -f "${CASKS_TXT}" ]; then tr '\n' ' ' < "${CASKS_TXT}"
  else echo "${FALLBACK_CASKS}"
  fi
}

install_packages_step() {
  header "Homebrew packages"
  local c
  if [ "${YES_TO_ALL}" -eq 1 ]; then c="2"; else
    c=$(vim_menu "Homebrew packages" \
      "Tiling stack only (${TILING_FORMULAE} / ${TILING_CASKS})" \
      "Full workstation (formulae.txt/casks.txt or Brewfile)" \
      "Full + games/proprietary extras" \
      "Skip") || c="4"
  fi
  case "${c}" in
    1)
      # shellcheck disable=SC2086
      brew_install_list formula ${TILING_FORMULAE}
      # shellcheck disable=SC2086
      brew_install_list cask ${TILING_CASKS}
      ;;
    2)
      if [ -f "${BREWFILE}" ] && ([ "${YES_TO_ALL}" -eq 1 ] || ask_yes_no "Use Brewfile (${BREWFILE})?" Y); then
        install_from_brewfile
      else
        # shellcheck disable=SC2046
        brew_install_list formula $(desired_formulae)
        # shellcheck disable=SC2046
        brew_install_list cask $(desired_casks)
      fi
      ;;
    3)
      if [ -f "${BREWFILE}" ]; then install_from_brewfile; else
        # shellcheck disable=SC2046
        brew_install_list formula $(desired_formulae)
        # shellcheck disable=SC2046
        brew_install_list cask $(desired_casks)
      fi
      # shellcheck disable=SC2086
      brew_install_list cask ${GAMES_CASKS}
      ;;
    *) info "Skipping package install." ;;
  esac
}

install_ohmyzsh_step() {
  if [ -d "${HOME}/.oh-my-zsh" ]; then info "oh-my-zsh already present."; return 0; fi
  if [ "${YES_TO_ALL}" -eq 1 ] || ask_yes_no "Install oh-my-zsh?" Y; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended || warn "oh-my-zsh install failed."
  fi
}

# ------------------------------------------------------------- dotfiles ---

install_dotfiles() {
  header "Installing dotfiles"
  [ -d "${FILES_DIR}" ] || { err "Missing ${FILES_DIR} — run from the repo checkout."; return 1; }
  local ts backup
  ts="$(date +%Y%m%d-%H%M%S)"
  backup="${HOME}/.dotfiles-backup-${ts}"
  mkdir -p "${backup}" "${HOME}/.config"

  local f
  for f in "${HOME_DOTFILES[@]}"; do
    if [ -f "${FILES_DIR}/${f}" ]; then
      [ -f "${HOME}/${f}" ] && cp -p "${HOME}/${f}" "${backup}/" 2>/dev/null || true
      cp -p "${FILES_DIR}/${f}" "${HOME}/${f}"
      success "Installed ~/${f}"
    fi
  done

  # Subdirectories in FILES_DIR -> ~/.config/<name>.
  # Skip files that are really home-dotfiles, docs, or nested junk.
  local src name
  for src in "${FILES_DIR}"/*/; do
    [ -d "${src}" ] || continue
    name="$(basename "${src}")"
    case "${name}" in files|.git) continue ;; esac
    if [ -d "${HOME}/.config/${name}" ]; then
      mkdir -p "${backup}/.config"
      cp -R "${HOME}/.config/${name}" "${backup}/.config/${name}.bak" 2>/dev/null || true
    fi
    mkdir -p "${HOME}/.config/${name}"
    if have_cmd rsync; then
      rsync -avh "${src}" "${HOME}/.config/${name}/" | tail -n 3
    else
      cp -R "${src}." "${HOME}/.config/${name}/"
    fi
    success "Synced ~/.config/${name}"
  done

  for f in "${HOME_SYNC_DIRS[@]}"; do
    if [ -d "${FILES_DIR}/${f}" ]; then
      mkdir -p "${HOME}/${f}"
      if have_cmd rsync; then rsync -avh "${FILES_DIR}/${f}/" "${HOME}/${f}/" | tail -n 3
      else cp -R "${FILES_DIR}/${f}/." "${HOME}/${f}/"; fi
      success "Synced ~/${f}"
    elif [ -d "${FILES_DIR}/.mpd" ] && [ "${f}" = ".mpd" ]; then
      : # covered by generic loop if stored as dotdir
    fi
  done
  # Legacy layout kept a .mpd copy + mpd.conf at top level.
  [ -f "${FILES_DIR}/mpd.conf" ] && mkdir -p "${HOME}/.mpd" && cp -p "${FILES_DIR}/mpd.conf" "${HOME}/.mpd/mpd.conf" || true

  # sketchybarrc at top level is a legacy flat file -> ~/.config/sketchybar/sketchybarrc
  if [ -f "${FILES_DIR}/sketchybarrc" ]; then
    mkdir -p "${HOME}/.config/sketchybar"
    cp -p "${FILES_DIR}/sketchybarrc" "${HOME}/.config/sketchybar/sketchybarrc"
  fi

  date > "${SENTINEL}"
  success "Backups (if any) saved to ${backup}"
  success "Dotfiles installed."
}

# -------------------------------------------------------- macOS defaults ---

# Shared "instant animation" core used by the tiling profile.
_instant_animation_core() {
  defaults write com.apple.universalaccess reduceMotion -bool true
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
  defaults write NSGlobalDomain NSWindowResizeTime -float 0.001
  defaults write NSGlobalDomain NSScrollAnimationEnabled -bool false
  defaults write -g QLPanelAnimationDuration -float 0
  defaults write com.apple.finder DisableAllAnimations -bool true
  defaults write com.apple.dock springboard-show-duration -float 0.1
  defaults write com.apple.dock springboard-hide-duration -float 0.1
  defaults write com.apple.dock autohide-time-modifier -float 0
  defaults write com.apple.dock autohide-delay -float 0
  defaults write NSGlobalDomain NSTextShowsControlCharacters -bool true
}

_restore_animation_core() {
  defaults write com.apple.universalaccess reduceMotion -bool false
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool true
  defaults write NSGlobalDomain NSWindowResizeTime -float 1
  defaults write NSGlobalDomain NSScrollAnimationEnabled -bool true
  defaults write -g QLPanelAnimationDuration -float 1
  defaults write com.apple.finder DisableAllAnimations -bool false
  defaults write com.apple.dock springboard-show-duration -float 1
  defaults write com.apple.dock springboard-hide-duration -float 1
  defaults write com.apple.dock autohide-time-modifier -float 1
  defaults write com.apple.dock autohide-delay -float 1
  defaults write NSGlobalDomain NSTextShowsControlCharacters -bool false
}

# Always-visible (+ roomier-feeling) menubar. macOS exposes no public
# "menubar size" default, so we do the supported parts: disable
# auto-hide, show date + seconds + battery %, keep Control Center icons.
menubar_always_visible() {
  header "Menubar: always visible"
  defaults write NSGlobalDomain _HIHideMenuBar -bool false
  defaults write com.apple.menuextra.clock ShowDate -int 1 2>/dev/null || true
  defaults write com.apple.menuextra.clock ShowSeconds -int 1 2>/dev/null || true
  defaults write com.apple.menuextra.battery ShowPercent -string "YES" 2>/dev/null || true
  defaults write com.apple.systemuiserver "NSStatusItem Visible com.apple.menuextra.clock" -bool true 2>/dev/null || true
  killall SystemUIServer 2>/dev/null || true
  success "Menubar set to always-visible (size itself follows System Settings > Displays resolution/scaling)."
}

apply_tiling_defaults() {
  header "Applying TILING defaults (instant animations, hidden dock)"
  pkill AltTab 2>/dev/null || true
  _instant_animation_core
  defaults write com.apple.dock autohide -bool true
  defaults write -g NSWindowShouldDragOnGesture -bool true
  # Empty the Dock (persistent-apps) like the original script did.
  defaults write com.apple.dock persistent-apps -array
  menubar_always_visible
  killall Dock 2>/dev/null || true
  success "Tiling defaults applied."
}

apply_normie_defaults() {
  header "Applying NORMIE defaults (normal animations, visible dock)"
  pkill AeroSpace 2>/dev/null || true
  pkill borders 2>/dev/null || true
  if have_cmd yabai; then yabai --stop-service 2>/dev/null || true; fi
  if have_cmd skhd; then skhd --stop-service 2>/dev/null || true; fi
  _restore_animation_core
  defaults write com.apple.dock autohide -bool false
  [ -x "/Applications/AltTab.app/Contents/MacOS/AltTab" ] && open /Applications/AltTab.app/ 2>/dev/null || true
  menubar_always_visible
  killall Dock 2>/dev/null || true
  success "Normie defaults applied."
}

defaults_menu() {
  header "macOS defaults"
  local c
  if [ "${YES_TO_ALL}" -eq 1 ]; then c="1";
  else
    c=$(vim_menu "macOS defaults" \
      "Tiling — instant animations, hidden dock, always-visible menubar" \
      "Normie — normal animations, visible dock, AltTab" \
      "Menubar only (always-visible tweaks)" \
      "Back") || c="4"
  fi
  case "${c}" in
    1) apply_tiling_defaults ;;
    2) apply_normie_defaults ;;
    3) menubar_always_visible ;;
    *) info "No defaults changed." ;;
  esac
}

# ----------------------------------------------------------- launch apps ---

launch_tiling_stack() {
  header "Launching tiling stack"
  if have_cmd borders; then (borders & disown 2>/dev/null || borders &); success "borders started."; else warn "borders not found (brew install borders)."; fi
  if [ -d "/Applications/AeroSpace.app" ]; then open /Applications/AeroSpace.app/ && success "AeroSpace opened."; else warn "AeroSpace.app not found."; fi
  if have_cmd sketchybar; then (sketchybar & disown 2>/dev/null || sketchybar &); success "sketchybar started."; elif [ -x "${HOME}/.config/sketchybar/sketchybarrc" ]; then warn "sketchybar config present but binary missing."; fi
  if [ -d "/Applications/MonitorControl.app" ]; then open /Applications/MonitorControl.app/ && success "MonitorControl opened."; fi
  # yabai/skhd are optional alternates to AeroSpace; start only if user wants.
  if [ "${YES_TO_ALL}" -eq 0 ] && ask_yes_no "Also start yabai + skhd services? (alternative to AeroSpace)" N; then
    have_cmd yabai && yabai --start-service 2>/dev/null || true
    have_cmd skhd && skhd --start-service 2>/dev/null || true
  elif [ "${YES_TO_ALL}" -eq 1 ]; then
    info "YES-TO-ALL: leaving yabai/skhd stopped (AeroSpace is the default)."
  fi
}

launch_normie_stack() {
  header "Launching normie stack"
  pkill AeroSpace 2>/dev/null || true
  pkill borders 2>/dev/null || true
  [ -d "/Applications/AltTab.app" ] && open /Applications/AltTab.app/ && success "AltTab opened."
}

launch_menu() {
  header "Launch programs"
  local c
  c=$(vim_menu "Launch programs" \
    "Tiling stack (AeroSpace + borders + sketchybar + MonitorControl)" \
    "Normie stack (AltTab, stop tiling daemons)" \
    "Back") || c="3"
  case "${c}" in
    1) launch_tiling_stack ;;
    2) launch_normie_stack ;;
    *) info "Nothing launched." ;;
  esac
}

# ------------------------------------------------------------ update repo ---

update_repo() {
  header "Updating repo from this Mac"
  [ -d "${FILES_DIR}" ] || mkdir -p "${FILES_DIR}"
  command -v git >/dev/null || { err "git not found."; return 1; }

  local changed=() f
  # 1) home dotfiles -> FILES_DIR
  for f in "${HOME_DOTFILES[@]}"; do
    if [ -f "${HOME}/${f}" ]; then
      if ! cmp -s "${HOME}/${f}" "${FILES_DIR}/${f}" 2>/dev/null; then
        cp -p "${HOME}/${f}" "${FILES_DIR}/${f}"
        changed+=("~/${f}")
        success "Synced ~/${f}"
      fi
    fi
  done
  for f in "${HOME_SYNC_DIRS[@]}"; do
    if [ -d "${HOME}/${f}" ]; then
      mkdir -p "${FILES_DIR}/${f}"
      if have_cmd rsync; then rsync -avh --delete --exclude='.DS_Store' "${HOME}/${f}/" "${FILES_DIR}/${f}/" | tail -n 2
      else cp -R "${HOME}/${f}/." "${FILES_DIR}/${f}/"; fi
      changed+=("~/${f}/")
    fi
  done
  [ -f "${HOME}/.mpd/mpd.conf" ] && cp -p "${HOME}/.mpd/mpd.conf" "${FILES_DIR}/mpd.conf" && changed+=("mpd.conf")

  # 2) ~/.config -> FILES_DIR (denylist applied)
  if [ -d "${HOME}/.config" ]; then
    local rsync_args=( -avh --delete --exclude='.git/' --exclude='.DS_Store' )
    local x
    for x in "${CONFIG_EXCLUDES[@]}"; do rsync_args+=( --exclude="${x}/" --exclude="${x}" ); done
    info "Syncing ~/.config -> ${FILES_DIR} (excluding: ${CONFIG_EXCLUDES[*]})"
    if have_cmd rsync; then
      # shellcheck disable=SC2086
      rsync "${rsync_args[@]}" "${HOME}/.config/" "${FILES_DIR}/" | tail -n 5
    else
      warn "rsync missing, falling back to cp (no deletions)."
      cp -R "${HOME}/.config/." "${FILES_DIR}/"
    fi
    changed+=("~/.config/")
  fi

  # 3) brew formulae + casks + Brewfile
  local n_form=0 n_cask=0
  if have_cmd brew; then
    brew list --formula > "${FORMULAE_TXT}"
    n_form=$(wc -l < "${FORMULAE_TXT}" | tr -d ' ')
    brew list --cask > "${CASKS_TXT}" 2>/dev/null || true
    n_cask=$(wc -l < "${CASKS_TXT}" 2>/dev/null | tr -d ' ' || echo 0)
    brew bundle dump --force --file="${BREWFILE}" >/dev/null 2>&1 || warn "brew bundle dump failed."
    success "Saved ${n_form} formulae + ${n_cask} casks -> ${FILES_DIR}/ (Brewfile, formulae.txt, casks.txt)"
    changed+=("brew: ${n_form} formulae, ${n_cask} casks")
  else
    warn "brew not found — skipping package sync."
  fi

  # 4) git add / commit / push with changelog
  cd "${REPO_ROOT}"
  git add -A
  if git diff --cached --quiet; then
    success "Nothing changed — repo already up to date."
    return 0
  fi
  echo ""
  info "Changed files:"
  git diff --cached --name-only | sed 's/^/  - /'
  local date_s summary body
  date_s="$(date +%d/%m/%Y)"
  summary="updated files ${date_s}"
  body=$(git diff --cached --name-only | sed 's/^/- /')
  body="${body}"$'\n'"- brew: ${n_form} formulae, ${n_cask} casks"

  echo ""
  echo "Commit message: ${summary}"
  if [ "${YES_TO_ALL}" -eq 0 ] && ! ask_yes_no "Commit + push these changes?" Y; then
    warn "Changes staged but NOT committed (run git commit manually)."
    return 0
  fi
  git commit -m "${summary}" -m "${body}" || { err "git commit failed."; return 1; }
  git push || { err "git push failed."; return 1; }
  success "Pushed: ${summary}"
}

# ------------------------------------------------------ installed menu ---

installed_menu() {
  success "Dotfiles are already installed — installer skipped."
  local first=1
  while true; do
    if [ "${first}" -eq 1 ]; then first=0; else pause; clear_screen; fi
    header "What next? (dotfiles installed)"
    local c
    c=$(vim_menu "What next? (dotfiles installed)" \
      "Apply macOS defaults / animations (tiling vs normie)" \
      "Launch programs (AeroSpace/borders/sketchybar…)" \
      "Update repo (sync ~/.config + dotfiles + brew, then git push)" \
      "Force full reinstall" \
      "Quit") || c="5"
    case "${c}" in
      1) defaults_menu ;;
      2) launch_menu ;;
      3) update_repo ;;
      4) run_fresh_installer ;;
      5|q|Q|"") info "Bye."; break ;;
      *) warn "Unknown choice." ;;
    esac
  done
}

# ------------------------------------------------------ fresh installer ---

run_fresh_installer() {
  header "DEFAULT MACOS SETUP — fresh installer"
  echo "This installs Homebrew packages, dotfiles, macOS defaults,"
  echo "and launches the tiling stack."
  echo ""
  if [ "${YES_TO_ALL}" -eq 0 ]; then
    if ask_yes_no "YES-TO-ALL? (instant animations, hidden dock, always-visible menubar, AeroSpace+borders, all apps)" N; then
      YES_TO_ALL=1
      info "YES-TO-ALL enabled."
    else
      info "Step-by-step mode: you will be asked at each stage."
    fi
  fi

  # 0) Xcode CLT (brew needs it)
  if ! xcode-select -p >/dev/null 2>&1; then
    warn "Xcode Command Line Tools missing."
    if [ "${YES_TO_ALL}" -eq 1 ] || ask_yes_no "Install Xcode CLT now? (opens installer)" Y; then
      xcode-select --install || true
      if [ "${YES_TO_ALL}" -eq 0 ]; then pause; fi
    fi
  fi

  ensure_brew || warn "Continuing without brew (package step will mostly fail)."
  install_packages_step
  install_ohmyzsh_step
  install_dotfiles
  defaults_menu
  if [ "${YES_TO_ALL}" -eq 1 ] || ask_yes_no "Launch programs now? (AeroSpace + borders + sketchybar…)" Y; then
    launch_tiling_stack
  fi

  header "Install complete"
  success "Dotfiles installed. Restart your shell or run: source ~/.zshrc"
  warn "yabai needs SIP partially disabled — AeroSpace (default) does not."
}

# ------------------------------------------------------------------ main ---

for arg in "$@"; do
  case "${arg}" in
    -y|--yes) YES_TO_ALL=1 ;;
    --install) FORCE_MODE="install" ;;
    --update) FORCE_MODE="update" ;;
    --defaults) FORCE_MODE="defaults" ;;
    --launch) FORCE_MODE="launch" ;;
    --check) FORCE_MODE="check" ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown flag: ${arg}"; usage; exit 1 ;;
  esac
done

case "${FORCE_MODE}" in
  check) print_detection; exit 0 ;;
  install) run_fresh_installer; exit 0 ;;
  update) update_repo; exit 0 ;;
  defaults) defaults_menu; exit 0 ;;
  launch) launch_menu; exit 0 ;;
esac

header "dotfiles setup — $(basename "${REPO_ROOT}")"
if dotfiles_installed; then
  installed_menu
else
  info "No existing installation detected — starting fresh installer."
  run_fresh_installer
fi
