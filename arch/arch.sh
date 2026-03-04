mkdir $HOME/Documents $HOME/Documents $HOME/Music $HOME/Pictures $HOME/Downloads $HOME/Desktop $HOME/Videos
mkdir $HOME/.gh/
cp ./dotfilesupdatearch.sh $HOME/
cp ./files/.zshrc $HOME/
#sudo pacman -S alacritty amd-ucode ark base base-devel  btop dnsmasq thunar edk2-ovmf efibootmgr feh ffmpeg firefox flatpak fzf git github-cli grub gst-plugin-pipewire hyprland hyprlauncher hyprlock hyprpaper iptables-nft kate keyd kolourpaint libpulse mpv neovim networkmanager nftables nm-connection-editor noto-fonts-cjk obs-studio openresolv pavucontrol pipewire pipewire-alsa pipewire-jack pipewire-pulse  qemu-full sddm  strawberry sudo ttf-hack-nerd unrar vde2 virt-manager waybar wireguard-tools wireplumber wl-clipboard wlsunset wpa_supplicant xdg-desktop-portal-gtk xdg-desktop-portal-wlr yazi yt-dlp zram-generator zsh
sudo pacman -S alacritty mpd rmpc firefox hyprland hyprpaper kdenlive gimp obs-studio flatpak feh ffmpeg yazi zsh btop fastfetch github-cli thunar neovim mpv ttf-hack-nerd wl-clipboard yt-dlp wlsunset pavucontrol rofi qBittorrent
flatpak install flathub io.github.ungoogled_software.ungoogled_chromium -y
chmod +x $HOME/dotfilesupdatearch.sh

cp ./files/.zshrc $HOME/
touch $HOME/.zprofile
echo "start-hyprland" >>$HOME/.zprofile

# Ohmyzsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Yay package manager
#sudo pacman -S --needed git base-devel
#git clone https://aur.archlinux.org/yay.git
#cd yay
#makepkg -si
#clear
#echo "Arch install complete"
export GH_CONFIG_DIR=$HOME/.gh
git clone https://github.com/NvChad/starter ~/.config/nvim
