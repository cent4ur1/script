echo "CONTINUING IN NEW ENVIRONMENT"
yes | sudo pacman -S wget mpd rmpc firefox hyprpaper kdenlive gimp obs-studio flatpak feh ffmpeg yazi zsh btop fastfetch github-cli thunar neovim mpv ttf-hack-nerd wl-clipboard yt-dlp wlsunset pavucontrol rofi qBittorrent
flatpak install flathub io.github.ungoogled_software.ungoogled_chromium -y
chmod +x $HOME/dotfilesupdatearch.sh
cp $HOME/script/arch/files/.zshrc $HOME/
touch $HOME/.zprofile
echo "start-hyprland" >>$HOME/.zprofile
#
#
#
#
#
#
#
#
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
