echo "Importing files"
sudo pacman -S hyprland kitty rofi waybar swaync thunar
cp -R ./hypr/ /home/$USER/.config
cp -R ./kitty/ /home/$USER/.config
cp -R ./rofi/ /home/$USER/.config
cp -R ./Thunar/ /home/$USER/.config
sudo cp -R ./swaync /etc/xdg/
sudo cp -R ./waybar/ /etc/xdg/
echo "done"
