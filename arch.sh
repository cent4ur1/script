cp ./clean.sh $HOME/
cp ./dotfilesupdatearch.sh $HOME/
cp ./archfiles/mpd/ $HOME/.config/
#cp ./archfiles/leverup.opus $HOME/
#cp ./archfiles/leverdown.opus $HOME/
#cp ./archfiles/mute.sh $HOME/

sudo pacman -S alacritty amd-ucode ark base base-devel bridge-utils btop dnsmasq dolphin edk2-ovmf efibootmgr feh ffmpeg firefox flatpak fzf git github-cli grub gst-plugin-pipewire hyprland hyprlauncher hyprlock hyprpaper iptables-nft kate keyd kolourpaint libpulse linux linux-firmware mpv neovim networkmanager nftables nm-connection-editor noto-fonts-cjk obs-studio openresolv pavucontrol pipewire pipewire-alsa pipewire-jack pipewire-pulse plasma-meta qemu-full sddm steam strawberry sudo ttf-hack-nerd unrar vde2 virt-manager waybar wireguard-tools wireplumber wl-clipboard wlsunset wpa_supplicant xdg-desktop-portal-gtk xdg-desktop-portal-wlr yazi yt-dlp zram-generator zsh

chmod +x packages.sh
./packages.sh

git clone https://github.com/NvChad/starter ~/.config/nvim

flatpak install flathub com.discordapp.Discord -y
flatpak install flathub org.qbittorrent.qBittorrent -y

chsh -s /usr/bin/zsh

chmod +x $HOME/clean.sh 
chmod +x $HOME/mute.sh
chmod +x $HOME/dotfilesupdatearch.sh 

cp ./archfiles/.zshrc $HOME/
cp ./archfiles/.zprofile $HOME/

# Ohmyzsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Yay package manager
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
clear
echo "Arch install complete"
