cp ./clean.sh $HOME/
cp ./dotfilesupdatearch.sh $HOME/
cp ./archfiles/leverup.opus $HOME/
cp ./archfiles/leverdown.opus $HOME/
cp ./archfiles/mute.sh $HOME/
sudo pacman -S alacritty firefox zsh thunar yazi mpv obs-studio ffmpeg wl-clipboard yt-dlp flatpak btop ttf-hack-nerd github-cli hyprland hyprpaper hyprlock hyprlauncher waybar waybar pavucontrol thunar wlsunset

git clone https://github.com/NvChad/starter ~/.config/nvim

flatpak install flathub com.discordapp.Discord -y
flatpak install flathub org.qbittorrent.qBittorrent -y

chsh -s /usr/bin/zsh

chmod +x $HOME/clean.sh 
chmod +x $HOME/mute.sh
chmod +x $HOME/dotfilesupdatearch.sh 

cp -R ./archfiles/alacritty/ $HOME/.config
cp -R ./archfiles/hypr/ $HOME/.config
cp -R ./archfiles/waybar/ $HOME/.config
cp ./archfiles/.zshrc $HOME/

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
