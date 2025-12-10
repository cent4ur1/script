cp -R ./files/config/* ~/.config/
rm -rf $HOME/.config/audacious/
rm -rf $HOME/.config/sketchybar/
rm -rf $HOME/.config/borders/
cp ./files/.zshrc $HOME


yes | sudo pacman -S alacritty qbittorrent zsh thunar yazi mpv obs-studio ffmpeg wl-clipboard yt-dlp flatpak mpd ncmpcpp btop ttf-hack-nerd github-cli
