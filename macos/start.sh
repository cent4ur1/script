mv ./dotfilesupdate.sh $HOME/
clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
yes | brew install autoconf automake boost borders btop ca-certificates cairo cmake fastfetch fftw fontconfig freetype gcc gettext gh giflib git glib gmp graphite2 harfbuzz hwloc icu4c@77 iproute2mac isl jpeg-turbo libevent libmpc libmpdclient libpng libtiff libtool libunistring libuv libx11 libxau libxcb libxdmcp libxext libxrender little-cms2 lpeg luajit luv lz4 lzo m4 molten-vk mpdecimal mpfr nasm ncmpcpp ncurses neovim ninja open-mpi openjdk openssl@3 p7zip pcre2 pixman pmix python@3.13 readline sevenzip sketchybar sqlite taglib tree-sitter unibilium utf8cpp utf8proc xorgproto xz yazi yyjson zstd aerospace alacritty balenaetcher discord firefox font-hack-nerd-font gimp heroic kdenlive localsend luanti monitorcontrol mullvad-vpn obs obsidian prismlauncher ungoogled-chromium 
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
