clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo "[2] Installing packages"
test
clear
echo "[3] Install extra packages? 1[yes] 2[no]"
echo "Discord, PrismLauncher, Dolphin, Ares-emulator"
read a
if [ "$a" == "1" ]; then
  yes | brew install discord prismlauncher dolphin ares-emulator
fi
clear
echo "[4] Setting defaults"
mv ./files/.aerospace.toml $HOME/ 
mv ./files/.zshrc $HOME/ 
mkdir $HOME/.config
mv ./files/* $HOME/.config/ 
./macosdefaults.sh

echo "Done"
open /Applications/AeroSpace.app/
open /Applications/MonitorControl.app/
sleep 2 
clear
cd /Users/$USER/
#sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
