cp ./clean.sh $HOME/
cp ./dotfilesupdatearch.sh $HOME/
cp ./archfiles/leverup.opus $HOME/
cp ./archfiles/leverdown.opus $HOME/
cp ./archfiles/mute.sh $HOME/

sudo apt install flatpak alacritty firefox zsh

#sudo pacman -S alacritty amd-ucode ark base base-devel btop efibootmgr ffmpeg firefox flatpak fzf git github-cli grub gst-plugin-pipewire hyprland hyprlauncher hyprlock hyprpaper keyd libpulse linux linux-firmware mpv neovim networkmanager obs-studio pavucontrol pipewire pipewire-alsa pipewire-jack pipewire-pulse steam sudo thunar ttf-hack-nerd waybar wireplumber wl-clipboard wlsunset wpa_supplicant xdg-desktop-portal-wlr yay yay-debug yazi yt-dlp zram-generator zsh

git clone https://github.com/NvChad/starter ~/.config/nvim

flatpak install flathub com.discordapp.Discord -y
flatpak install flathub org.qbittorrent.qBittorrent -y

chmod +x $HOME/clean.sh 
chmod +x $HOME/mute.sh
chmod +x $HOME/dotfilesupdatearch.sh 

cp -R ./archfiles/alacritty/ $HOME/.config
#cp -R ./archfiles/hypr/ $HOME/.config
#cp -R ./archfiles/waybar/ $HOME/.config
cp ./archfiles/.zshrc $HOME/

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

#sudo pacman -S --needed git base-devel
#git clone https://aur.archlinux.org/yay.git
#cd yay
#makepkg -si
