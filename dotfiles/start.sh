echo "installing dependencies"
sudo pacman -S hyprland swaync rofi thunar kitty waybar
echo "done"
mkdir -p ~/.config/
cp -R ~/dotfiles/hypr/ ~/.config/
cp -R ~/dotfiles/kitty/ ~/.config/
cp -R ~/dotfiles/rofi/ ~/.config/
cp -R ~/dotfiles/Thunar/ ~/.config/
echo ".config files "
cp -R  ~/dotfiles/ /etc/xdg/
cp -R  ~/dotfiles/ /etc/xdg/
echo "swaync and waybar"
echo "reboot to apply"
