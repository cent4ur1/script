echo "macOS(1) or Arch?(2)"
read x
if [ "$x" == "1" ]; then
  clear
  echo "macos"
  clear
  echo "installing brew"
  sleep 1
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  clear
  brew install firefox discord neovim iina ghostty monitorcontroll obs
  yes
fi

if [ "$x" == "2" ]; then
  #sudo cp -r pacman.conf /etc/
  #yes
  yes | sudo pacman -Sy
  echo "Creating Directories"
  sudo mkdir -p /etc/xdg/waybar/
  sudo mkdir -p /etc/xdg/swaync/
  clear
  echo "Installing dependencies"
  sleep 1 
  yes | sudo pacman -S hyprland hyprpaper ark neovim obs-studio qbittorrent dolphin kitty pavucontrol rofi waybar swaync flatpak github-cli zsh kdenlive blender mpv feh qemu-full
  yes | flatpak install flathub io.gitlab.librewolf-community lutris steam dolphin-emu
  yes | flatpak install flathub com.discordapp.Discord
  yes | flatpak install flathub org.prismlauncher.PrismLauncher
  yes | flatpak install flathub net.kuribo64.melonDS
  yes | flatpak install flathub info.cemu.Cemu
  clear
  echo "Installing NvChad"
# Install NvChad
  git clone https://github.com/NvChad/starter ~/.config/nvim

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

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
