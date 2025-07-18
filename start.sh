echo "Importing files"
sudo mkdir -p /etc/xdg/waybar/
sudo mkdir -p /etc/xdg/swaync/
sudo pacman -S hyprland hyprpaper dolphin kitty pavucontrol rofi waybar swaync 
cp -R ./hypr/ /home/$USER/.config
cp -R ./kitty/ /home/$USER/.config
cp -R ./rofi/ /home/$USER/.config
cp -R ./waybarconfig /home/$USER/.config/waybar
cp -R ./Thunar/ /home/$USER/.config
sudo cp -R ./swaync /etc/xdg/
sudo cp -R ./waybar/ /etc/xdg/
echo "done"
