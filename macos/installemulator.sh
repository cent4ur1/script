#!/usr/bin/env bash
#
# installemulator.sh — DRY-RUN emulator for setup.sh
#
# Shows exactly what a user would see / be asked when running setup.sh,
# WITHOUT changing anything:
#   no brew installs, no `defaults write`, no file copies,
#   no git add/commit/push, no app launches.
# Every mutating action is printed as:  [EMULATE] would run: <command>
#
# Menus use the same vim keybinds as setup.sh (j/k + Enter, q back).
# The screen clears after every selection to keep things readable.
#
# Usage:
#   ./installemulator.sh
#
set -u

EMU_YES_ALL=0

say()  { printf "%s\n" "$*"; }
emu()  { printf "  [EMULATE] would run: %s\n" "$*"; }
hdr()  { printf "\n== %s ==\n" "$*"; }

pause() { if [ -t 0 ]; then printf "Press Enter to continue..."; read -r _ || true; fi; }

# Wipe the screen on real terminals only (never in pipes/logs).
# Always writes to stderr so $(...) captures stay clean.
# Tests fd 2 as well as fd 1 because menus run inside $(...) (where fd 1
# is a pipe) while their UI — and the user's terminal — is on stderr.
clear_screen() { if [ -t 1 ] || [ -t 2 ]; then clear >&2 2>/dev/null || printf '\033c' >&2; fi; }

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
    printf '%s (j/k + Enter, 1-%d jump, q back)\n' "${prompt}" "${count}" >&2
    for ((i = 1; i <= count; i++)); do
      if [ "${i}" -eq "${sel}" ]; then
        printf '\r\033[K> %d) %s\n' "${i}" "${options[$((i - 1))]}" >&2
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

emu_ask() {
  # emu_ask "prompt text" -> reads answer, echoes it back as emulated choice
  # Prompts go to stderr so $(...) captures ONLY the answer.
  # Single keypress (no Enter needed) when stdin is a TTY.
  local prompt="$1" ans
  printf "%s" "${prompt}" >&2
  if [ -t 0 ]; then
    IFS= read -rsn1 ans || ans=""
    printf "\n" >&2
    [ -z "${ans}" ] && ans="<Enter>"
  else
    read -r ans || ans=""
  fi
  printf "  [EMULATE] you answered: '%s'\n" "${ans}" >&2
  [ "${ans}" = "<Enter>" ] && ans=""
  printf "%s" "${ans}"
}

emulate_detection() {
  hdr "Step 0 — detection (as setup.sh does it)" >&2
  say "setup.sh checks for ~/.aerospace.toml, ~/.zshrc, ~/.skhdrc, ~/.yabairc" >&2
  say "plus ~/.config/nvim, sketchybar, borders, alacritty, btop, karabiner," >&2
  say "or the sentinel file ~/.dotfiles_installed." >&2
  say "  4+ markers present  -> INSTALLED  (skip installer, show 'what next?' menu)" >&2
  say "  otherwise           -> NOT INSTALLED (run fresh installer below)" >&2
  local c
  c=$(vim_menu "Emulate which path?" "Fresh Mac (NOT installed)" "Already-installed Mac") || c="1"
  printf "  [EMULATE] you picked: '%s'\n" "${c}" >&2
  case "${c}" in
    2) echo "installed" ;;
    *) echo "fresh" ;;
  esac
}

emulate_fresh_installer() {
  hdr "DEFAULT MACOS SETUP — fresh installer (emulated)"
  say "This installs Homebrew packages, dotfiles, macOS defaults,"
  say "and launches the tiling stack."
  say ""
  local ans
  ans=$(emu_ask "YES-TO-ALL? (instant animations, hidden dock, always-visible menubar, AeroSpace+borders, all apps) [y/N]: ")
  echo ""
  case "${ans}" in
    [Yy]*) EMU_YES_ALL=1; say "  [EMULATE] YES-TO-ALL enabled — all later prompts auto-answer YES." ;;
    *)     say "  [EMULATE] step-by-step mode — you will be asked at each stage." ;;
  esac

  hdr "Step 1 — Xcode CLT + Homebrew (emulated)"
  emu "xcode-select --install   (only if 'xcode-select -p' fails)"
  emu '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"  (only if brew missing)'

  hdr "Step 2 — Homebrew packages (emulated)"
  if [ "${EMU_YES_ALL}" -eq 1 ]; then
    say "  [EMULATE] YES-TO-ALL -> auto-picks [2] Full workstation."
    emu "brew bundle --file=./macos/files/Brewfile  (or brew install <each formula/cask>)"
  else
    ans=$(vim_menu "Packages" \
      "Tiling stack only (borders yabai skhd + casks: aerospace alt-tab monitorcontrol)" \
      "Full workstation (everything in formulae.txt/casks.txt or Brewfile)" \
      "Full + games/proprietary extras" \
      "Skip") || ans="4"
    printf "  [EMULATE] you picked: '%s'\n" "${ans}" >&2
    case "${ans}" in
      1) emu "brew install borders yabai skhd; brew install --cask aerospace alt-tab monitorcontrol" ;;
      2) emu "brew bundle --file=./macos/files/Brewfile  (fallback: brew install <formulae.txt> <casks.txt>)" ;;
      3) emu "brew bundle --file=./macos/files/Brewfile; brew install --cask steam ungoogled-chromium balenaetcher heroic luanti …" ;;
      *) say "  [EMULATE] skipping package install." ;;
    esac
  fi

  hdr "Step 3 — oh-my-zsh (emulated)"
  if [ "${EMU_YES_ALL}" -eq 1 ]; then
    emu 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended'
  else
    ans=$(emu_ask "Install oh-my-zsh? [Y/n]: ")
    echo ""
    emu "install oh-my-zsh (unattended)  — answer was '${ans}'"
  fi

  hdr "Step 4 — dotfiles install (emulated)"
  emu "backup existing files to ~/.dotfiles-backup-<timestamp>/"
  emu "cp ./macos/files/.aerospace.toml ~/.aerospace.toml"
  emu "cp ./macos/files/.zshrc ~/.zshrc"
  emu "cp ./macos/files/.skhdrc ~/.skhdrc"
  emu "cp ./macos/files/.yabairc ~/.yabairc"
  emu "rsync ./macos/files/<each-subdir>/ ~/.config/<name>/   (alacritty, borders, btop, karabiner, nvim, sketchybar, …)"
  emu "touch ~/.dotfiles_installed"

  hdr "Step 5 — macOS defaults (emulated)"
  if [ "${EMU_YES_ALL}" -eq 1 ]; then
    say "  [EMULATE] YES-TO-ALL -> auto-picks [1] Tiling."
    emu "defaults write … (reduceMotion, NSAutomaticWindowAnimationsEnabled=false, NSWindowResizeTime=0.001, dock autohide=true, …)"
    emu "defaults write NSGlobalDomain _HIHideMenuBar -bool false  (menubar always visible)"
    emu "defaults write com.apple.dock persistent-apps -array  (empty the Dock)"
    emu "killall SystemUIServer; killall Dock"
  else
    ans=$(vim_menu "macOS defaults" \
      "Tiling — instant animations, hidden dock, always-visible menubar" \
      "Normie — normal animations, visible dock, AltTab" \
      "Menubar only (always-visible tweaks)" \
      "Back (no change)") || ans="4"
    printf "  [EMULATE] you picked: '%s'\n" "${ans}" >&2
    case "${ans}" in
      1) emu "apply TILING defaults (instant animations + hidden dock + always-visible menubar); killall Dock" ;;
      2) emu "apply NORMIE defaults (restore animations + visible dock); open AltTab.app; killall Dock" ;;
      3) emu "defaults write NSGlobalDomain _HIHideMenuBar -bool false; killall SystemUIServer" ;;
      *) say "  [EMULATE] no defaults changed." ;;
    esac
  fi

  hdr "Step 6 — launch programs (emulated)"
  if [ "${EMU_YES_ALL}" -eq 1 ]; then
    say "  [EMULATE] YES-TO-ALL -> auto-launches tiling stack."
  else
    ans=$(emu_ask "Launch programs now? (AeroSpace + borders + sketchybar…) [Y/n]: ")
    echo ""
    case "${ans}" in
      ""|[Yy]*) : ;; # yes / default -> launch below
      *) say "  [EMULATE] user declined launch. Done."; return 0 ;;
    esac
  fi
  emu "borders & disown"
  emu "open /Applications/AeroSpace.app/"
  emu "sketchybar & disown"
  emu "open /Applications/MonitorControl.app/"
  say ""
  say "Install complete (emulated). Real run ends with:"
  say "  'Dotfiles installed. Restart your shell or run: source ~/.zshrc'"
}

emulate_installed_menu() {
  hdr "Dotfiles already installed (emulated)"
  say "setup.sh prints: 'Dotfiles are already installed — installer skipped.'"
  say "then loops on this menu:"
  local first=1
  while true; do
    if [ "${first}" -eq 1 ]; then first=0; else pause; clear_screen; fi
    say ""
    local ans
    ans=$(vim_menu "Installed menu" \
      "Apply macOS defaults / animations (tiling vs normie)" \
      "Launch programs (AeroSpace/borders/sketchybar…)" \
      "Update repo (sync ~/.config + dotfiles + brew, then git push)" \
      "Force full reinstall" \
      "Quit") || ans="5"
    printf "  [EMULATE] you picked: '%s'\n" "${ans}" >&2
    case "${ans}" in
      1)
        say "  -> defaults submenu: [1] Tiling  [2] Normie  [3] Menubar only  [4] Back"
        emu "defaults write … (per choice); killall Dock/SystemUIServer"
        ;;
      2)
        say "  -> launch submenu: [1] Tiling stack  [2] Normie stack  [3] Back"
        emu "open /Applications/AeroSpace.app/  |  borders &  |  sketchybar &  (per choice)"
        ;;
      3)
        say "  -> update_repo():"
        emu "cp ~/.aerospace.toml ~/.zshrc ~/.skhdrc ~/.yabairc -> ./macos/files/"
        emu "rsync ~/.config/ ./macos/files/  (excluding gh/, opencode/, sketchybar_backup/, Cache/)"
        emu "brew list --formula > ./macos/files/formulae.txt"
        emu "brew list --cask > ./macos/files/casks.txt"
        emu "brew bundle dump --force --file=./macos/files/Brewfile"
        emu 'git add -A; git commit -m "updated files <dd/mm/yyyy>"; git push'
        ;;
      4) emulate_fresh_installer; ;;
      5|q|Q|"") say "  [EMULATE] quit menu. Bye."; break ;;
      *) say "  [EMULATE] unknown choice — real script re-prompts." ;;
    esac
  done
}

hdr "installemulator.sh — setup.sh dry-run (nothing will be changed)"
say "Mirroring setup.sh prompts; all actions are only PRINTED."
path="$(emulate_detection)"
if [ "${path}" = "installed" ]; then
  emulate_installed_menu
else
  emulate_fresh_installer
fi
hdr "Emulation finished — no files, defaults, brew packages, or git state were touched."
