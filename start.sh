clear
# Add repos
sudo sed -i -e 's/^#$$extra$$/$$extra$$/; s/^#$$multilib$$/$$multilib$$/; s/^#Include = /Include = /' /etc/pacman.conf
sudo pacman -Sy


echo "Creating Directories"
sudo mkdir -p /etc/xdg/waybar/
sudo mkdir -p /etc/xdg/swaync/
clear
echo "Installing dependencies"
sleep 1 
sudo pacman -S hyprland hyprpaper ark neovim obs-studio qbittorrent dolphin kitty pavucontrol rofi waybar swaync flatpak github-cli zsh kdenlive blender mpv feh qemu-full
flatpak install flathub io.gitlab.librewolf-community lutris steam dolphin-emu
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.prismlauncher.PrismLauncher
flatpak install flathub net.kuribo64.melonDS
flatpak install flathub info.cemu.Cemu

clear
echo "Installing NvChad"

# Install NvChad
git clone https://github.com/NvChad/starter ~/.config/nvim
clear
echo "install custom config y/n"
read x
if [ "$x" == "y" ]; then
  git clone https://github.com/lucaspapadam/centauri.git
  cd /home/$USER/centauri/stuff/
  cp -R ./hypr/ /home/$USER/.config
  cp -R ./kitty/ /home/$USER/.config
  cp -R ./rofi/ /home/$USER/.config
  cp -R ./waybarconfig /home/$USER/.config/waybar
  sudo cp -R ./swaync /etc/xdg/
  sudo cp -R ./waybar/ /etc/xdg/
  rm -rf /home/$USER/centauri/
fi

echo "Script will close after zsh install"
sleep 3
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
