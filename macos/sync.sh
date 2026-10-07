#!/usr/bin/env bash
#
# sync.sh — sync this Mac into ./macos/files/ and push.
#
# What it does:
#   1. Syncs ~/.config/*        -> ./macos/files/  (excludes .git, .DS_Store)
#   2. Syncs ~/.aerospace.toml  -> ./macos/files/.aerospace.toml
#      Syncs ~/.zshrc           -> ./macos/files/.zshrc
#   3. Dumps brew state         -> ./macos/files/Brewfile,
#                                  ./macos/files/formulae.txt,
#                                  ./macos/files/casks.txt
#   4. Runs git add, commits with the current date/time, and pushes.
#
# Usage:
#   ./sync.sh            # from macos/, or anywhere (paths resolve via $0)
#
# Non-interactive: no prompts, safe to run from cron/CI.
# If nothing changed, it exits 0 without committing.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FILES_DIR="${SCRIPT_DIR}/files"
BREWFILE="${FILES_DIR}/Brewfile"
FORMULAE_TXT="${FILES_DIR}/formulae.txt"
CASKS_TXT="${FILES_DIR}/casks.txt"

# Home dotfiles mirrored at FILES_DIR root. Keep in sync with install.sh.
HOME_DOTFILES=( ".aerospace.toml" ".zshrc" )

# Repo files that live in FILES_DIR but never come from ~/.config.
# They are never deleted by stale-entry cleanup.
KEEP_FILES=( "Brewfile" "formulae.txt" "casks.txt" ".aerospace.toml" ".zshrc" )

log()  { printf '[sync] %s\n' "$*"; }
warn() { printf '[sync] WARNING: %s\n' "$*" >&2; }

mkdir -p "${FILES_DIR}"

# ------------------------------------------------- 1) ~/.config -> files/ ---

if [ ! -d "${HOME}/.config" ]; then
  warn "${HOME}/.config not found, skipping config sync."
else
  command -v rsync >/dev/null || { echo "[sync] ERROR: rsync not found." >&2; exit 1; }

  # Copy each entry individually so repo-only files (Brewfile, dotfiles…)
  # at FILES_DIR root are never touched by --delete.
  while IFS= read -r -d '' src; do
    name="$(basename "${src}")"
    case "${name}" in
      .git|.DS_Store) continue ;;
    esac
    if [ -d "${src}" ]; then
      mkdir -p "${FILES_DIR}/${name}"
      rsync -avh --delete --exclude='.git/' --exclude='.DS_Store' --exclude='node_modules/' \
        "${src}/" "${FILES_DIR}/${name}/" | tail -n 2
    else
      # Dotfiles directly inside ~/.config (e.g. .stylua.toml, .xash_id).
      cp -p "${src}" "${FILES_DIR}/${name}"
      log "Synced ~/.config/${name}"
    fi
  done < <(find "${HOME}/.config" -mindepth 1 -maxdepth 1 -print0)

  # Remove stale entries that no longer exist in ~/.config.
  while IFS= read -r -d '' dst; do
    name="$(basename "${dst}")"
    # Never keep Finder junk, even if the source still has it.
    if [ "${name}" = ".DS_Store" ]; then
      rm -rf "${dst}"
      continue
    fi
    keep=0
    for k in "${KEEP_FILES[@]}"; do
      [ "${name}" = "${k}" ] && keep=1 && break
    done
    [ "${keep}" -eq 1 ] && continue
    if [ ! -e "${HOME}/.config/${name}" ]; then
      log "Removing stale ${name} (gone from ~/.config)"
      rm -rf "${dst}"
    fi
  done < <(find "${FILES_DIR}" -mindepth 1 -maxdepth 1 -print0)

  # Legacy junk from an older sync layout (never a real ~/.config entry).
  if [ -e "${FILES_DIR}/files" ]; then
    log "Removing legacy files/ nesting"
    rm -rf "${FILES_DIR}/files"
  fi
fi

# ------------------------------------------------- 2) home dotfiles ----------

for f in "${HOME_DOTFILES[@]}"; do
  if [ -f "${HOME}/${f}" ]; then
    cp -p "${HOME}/${f}" "${FILES_DIR}/${f}"
    log "Synced ~/${f}"
  else
    warn "~/${f} not found, skipping."
  fi
done

# ------------------------------------------------- 3) brew --------------------

if command -v brew >/dev/null; then
  brew list --formula > "${FORMULAE_TXT}"
  brew list --cask > "${CASKS_TXT}" 2>/dev/null || true
  brew bundle dump --force --file="${BREWFILE}" >/dev/null \
    || warn "brew bundle dump failed."
  log "Saved $(wc -l < "${FORMULAE_TXT}" | tr -d ' ') formulae + $(wc -l < "${CASKS_TXT}" | tr -d ' ') casks."
else
  warn "brew not found, skipping package sync."
fi

# ------------------------------------------------- 4) git add/commit/push ---

cd "${REPO_ROOT}"
git add -A

if git diff --cached --quiet; then
  log "Nothing changed — already up to date."
  exit 0
fi

log "Changed files:"
git diff --cached --name-only | sed 's/^/  - /'

STAMP="$(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "${STAMP}"
git push
log "Pushed: ${STAMP}"
