cp -R ./files/ ~/.config/
rm -rf $HOME/.config/audacious/
rm -rf $HOME/.config/sketchybar/
rm -rf $HOME/.config/borders/
cp ./files/.zshrc $HOME

yes | sudo pacman -S alacritty qbittorrent zsh thunar yazi mpv obs-studio ffpmeg fprobe

