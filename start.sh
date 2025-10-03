1
clear
echo "Creating Directories"
sudo mkdir -p /etc/xdg/waybar/
sudo mkdir -p /etc/xdg/swaync/
clear
echo "Installing dependencies"
sleep 3
echo "3"
sleep 1
echo "2"
sleep 1
echo "1"
sleep 1
sudo pacman -S hyprland hyprpaper ark neovim obs-studio qbittorrent dolphin kitty pavucontrol rofi waybar swaync flatpak
flatpak install flathub io.gitlab.librewolf-community
flatpak install flathub com.discordapp.Discord

# Game stuff proprietary and open source
clear
echo "Install Gaming Packages y/n"
read x
if [ "$x" == "y" ]; then
	clear
	echo "Installing Gaming Packages"
	sudo pacman -S lutris steam dolphin-emu
	flatpak install flathub org.prismlauncher.PrismLauncher
	flatpak install flathub net.kuribo64.melonDS
	flatpak install flathub info.cemu.Cemu
	clear
	"Sucessfully Installed the Multimedia Packages"
fi

if [ "$x" == "n" ]; then
  echo "Skipping"
fi

# Multimedia Tools & Software
clear
echo "Install Multimedia Packages y/n"
read y 
if [ "$y" == "y" ]; then
	clear
	echo "Installing Multimedia Packages"
	sudo pacman -S kdenlive blender mpv feh
	clear
	"Sucessfully Installed the Multimedia Packages"
fi

if [ "$y" == "n" ]; then
  echo "Skipping"
fi

clear
# Copy Config files
cp -R ./hypr/ /home/$USER/.config
cp -R ./kitty/ /home/$USER/.config
cp -R ./rofi/ /home/$USER/.config
cp -R ./waybarconfig /home/$USER/.config/waybar
sudo cp -R ./swaync /etc/xdg/
sudo cp -R ./waybar/ /etc/xdg/
# Install NvChad
git clone https://github.com/NvChad/starter ~/.config/nvim
echo "done"
