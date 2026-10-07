#!/usr/bin/env bash
#
# install.sh — fresh-Mac installer for ./macos/files/.
#
# What it does (no prompts, no macOS `defaults` changes):
#   1. Installs Xcode Command Line Tools (if missing).
#   2. Installs Homebrew (if missing).
#   3. Installs packages from files/Brewfile
#      (falls back to formulae.txt / casks.txt when no Brewfile exists).
#   4. Installs oh-my-zsh (if missing and the synced .zshrc needs it).
#   5. Restores ~/.aerospace.toml and ~/.zshrc from files/.
#   6. Restores ~/.config/* from files/.
#
# Existing files are backed up to ~/.dotfiles-backup-<timestamp>/ first.
#
# Usage:
#   git clone <repo>; cd script/macos/; chmod +x install.sh; ./install.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILES_DIR="${SCRIPT_DIR}/files"
BREWFILE="${FILES_DIR}/Brewfile"
FORMULAE_TXT="${FILES_DIR}/formulae.txt"
CASKS_TXT="${FILES_DIR}/casks.txt"

# Must match sync.sh.
HOME_DOTFILES=( ".aerospace.toml" ".zshrc" )

# Repo files that are NOT ~/.config content — never restore into ~/.config.
SKIP_NAMES=( "Brewfile" "formulae.txt" "casks.txt" ".aerospace.toml" ".zshrc" "files" ".git" )

log()  { printf '[install] %s\n' "$*"; }
warn() { printf '[install] WARNING: %s\n' "$*" >&2; }
die()  { printf '[install] ERROR: %s\n' "$*" >&2; exit 1; }

[ -d "${FILES_DIR}" ] || die "Missing ${FILES_DIR} — run from a repo checkout."

# ------------------------------------------------- 1) Xcode CLT --------------

if ! xcode-select -p >/dev/null 2>&1; then
  log "Installing Xcode Command Line Tools (opens installer, then re-run)…"
  xcode-select --install || true
  die "Re-run ./install.sh after the Xcode CLT install finishes."
fi

# ------------------------------------------------- 2) Homebrew ---------------

if command -v brew >/dev/null; then
  log "Homebrew already installed ($(brew --version | head -n1))."
else
  log "Installing Homebrew…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  if [ -x "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  command -v brew >/dev/null || die "Homebrew install failed."
fi

# ------------------------------------------------- 3) packages ----------------

if [ -f "${BREWFILE}" ]; then
  log "Installing from Brewfile…"
  brew bundle --file="${BREWFILE}" || warn "brew bundle reported errors (continuing)."
elif [ -f "${FORMULAE_TXT}" ] || [ -f "${CASKS_TXT}" ]; then
  # Fallback when no Brewfile was ever dumped.
  if [ -f "${FORMULAE_TXT}" ]; then
    while IFS= read -r pkg || [ -n "${pkg}" ]; do
      [ -z "${pkg}" ] && continue
      brew list --formula "${pkg}" >/dev/null 2>&1 || brew install "${pkg}" || warn "failed: ${pkg}"
    done < "${FORMULAE_TXT}"
  fi
  if [ -f "${CASKS_TXT}" ]; then
    while IFS= read -r pkg || [ -n "${pkg}" ]; do
      [ -z "${pkg}" ] && continue
      brew list --cask "${pkg}" >/dev/null 2>&1 || brew install --cask "${pkg}" || warn "failed: ${pkg}"
    done < "${CASKS_TXT}"
  fi
else
  warn "No Brewfile/formulae.txt/casks.txt found — skipping package install."
fi

# ------------------------------------------------- 4) oh-my-zsh ---------------

if [ -d "${HOME}/.oh-my-zsh" ]; then
  log "oh-my-zsh already present."
elif [ -f "${FILES_DIR}/.zshrc" ] && grep -q 'oh-my-zsh' "${FILES_DIR}/.zshrc"; then
  log "Installing oh-my-zsh (required by .zshrc)…"
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    || warn "oh-my-zsh install failed."
fi

# ------------------------------------------------- 5+6) dotfiles --------------

TS="$(date +%Y%m%d-%H%M%S)"
BACKUP="${HOME}/.dotfiles-backup-${TS}"
mkdir -p "${BACKUP}" "${HOME}/.config"

for f in "${HOME_DOTFILES[@]}"; do
  if [ -f "${FILES_DIR}/${f}" ]; then
    [ -f "${HOME}/${f}" ] && cp -p "${HOME}/${f}" "${BACKUP}/" || true
    cp -p "${FILES_DIR}/${f}" "${HOME}/${f}"
    log "Installed ~/${f}"
  fi
done

while IFS= read -r -d '' src; do
  name="$(basename "${src}")"
  skip=0
  for s in "${SKIP_NAMES[@]}"; do
    [ "${name}" = "${s}" ] && skip=1 && break
  done
  [ "${skip}" -eq 1 ] && continue
  case "${name}" in
    .DS_Store) continue ;;
  esac
  if [ -d "${src}" ]; then
    if [ -d "${HOME}/.config/${name}" ]; then
      mkdir -p "${BACKUP}/.config"
      cp -R "${HOME}/.config/${name}" "${BACKUP}/.config/${name}.bak" || true
    fi
    mkdir -p "${HOME}/.config/${name}"
    rsync -avh --exclude='.git/' --exclude='.DS_Store' --exclude='node_modules/' "${src}/" "${HOME}/.config/${name}/" | tail -n 2
    log "Restored ~/.config/${name}"
  else
    [ -f "${HOME}/.config/${name}" ] && cp -p "${HOME}/.config/${name}" "${BACKUP}/" || true
    cp -p "${src}" "${HOME}/.config/${name}"
    log "Restored ~/.config/${name}"
  fi
done < <(find "${FILES_DIR}" -mindepth 1 -maxdepth 1 -print0)

log "Done. Backups (if any) in ${BACKUP}."
log "Restart your shell or run: source ~/.zshrc"
