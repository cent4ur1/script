<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/66a4f04b-3431-4f5a-a72b-00e73a157952" />

# macOS dotfiles

AeroSpace + sketchybar + borders setup. Configs live in `macos/files/`.

## Fresh install (new Mac)

```shell
git clone https://github.com/cent4ur1/script.git; cd script/macos/; chmod +x install.sh; ./install.sh
```

Installs Homebrew, packages from `files/Brewfile`, oh-my-zsh, then restores `~/.aerospace.toml`, `~/.zshrc`, and `~/.config/*`. Existing files are backed up to `~/.dotfiles-backup-<timestamp>/`. It changes no macOS animation/dock/menubar defaults.

## Sync (save this Mac's state)

```shell
cd script/macos/; ./sync.sh
```

Copies `~/.config/*`, `~/.aerospace.toml`, `~/.zshrc`, and the brew state (`Brewfile`, `formulae.txt`, `casks.txt`) into `macos/files/`, then commits with the current date/time and pushes. No prompts; exits quietly when nothing changed.

## Layout

```
macos/
  install.sh   # fresh-Mac installer
  sync.sh      # sync this Mac -> files/ + push
  files/       # ~/.config/* + .aerospace.toml + .zshrc + Brewfile/lists
```
