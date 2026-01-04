cp ./clean.sh $HOME/
cp ./dotfilesupdatearch.sh $HOME/
cp ./archfiles/leverup.opus $HOME/
cp ./archfiles/leverdown.opus $HOME/
cp ./archfiles/mute.sh $HOME/
yes | sudo pacman -S alacritty firefox qbittorrent zsh thunar yazi mpv obs-studio ffmpeg wl-clipboard yt-dlp flatpak btop ttf-hack-nerd github-cli hyprland hyprpaper hyprlock hyprlauncher

git clone https://github.com/NvChad/starter ~/.config/nvim

flatpak install flathub com.discordapp.Discord -y
flatpak install flathub org.qbittorrent.qBittorrent -y

chsh -s /usr/bin/zsh

cp -R ./archfiles/alacritty/ $HOME/
cp -R ./archfiles/hypr/ $HOME/
cp -R ./archfiles/waybar/ $HOME/
cp ./archfiles/.zshrc $HOME/

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
