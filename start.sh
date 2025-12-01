echo "Installing"

clear
echo "1 installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo "2 installing packages"
yes | brew install neovim mpv audacious alacritty monitorcontroll obs kdenlive jankyborders sketchybar aerospace mac-mouse-fix ffmpeg yt-dlp fprobe
clear
echo "3 Install extra packages? 1[yes] 2[no]"
echo "Discord, PrismLauncher, Dolphin, Ares-emulator"
read a
if [ "$a" == "1" ]; then
  yes | brew install discord prismlauncher dolphin ares-emulator
fi
clear
echo "4 setting defaults"
mv ./files/.aerospace.toml $HOME/ 
mv ./files/.zshrc $HOME/ 
mkdir $HOME/.config
mv ./files/nvim/ $HOME/.config/ 
mv ./files/btop/ $HOME/.config/
mv ./files/sketchybar/ $HOME/.config

./macosdefaults.sh
echo "Done"
open /Applications/AeroSpace.app/
open /Applications/MonitorControl.app/
open /Applications/Mac Mouse Fix.app/
sleep 2 
clear
cd /Users/$USER/
rm -rf /Users/$USER/script/

#sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
