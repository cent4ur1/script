mv ./dotfilesupdate.sh $HOME/
clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
yes | brew install abseil aom autoconf automake boost borders brotli btop ca-certificates cairo cmake fastfetch fftw fileicon fontconfig freetype gettext gh giflib git glib graphite2 harfbuzz highway icu4c@78 imagemagick imath iproute2mac jpeg-turbo jpeg-xl libde265 libdeflate libevent libheif libiconv libmpdclient libomp libpng libtiff libtool libunistring libuv libvmaf libx11 libxau libxcb libxdmcp libxext libxrender little-cms2 lpeg luajit luv lz4 lzo m4 miniupnpc molten-vk mpdecimal mysql nasm ncmpcpp ncurses neovim ninja openexr openjdk openjph openssl@3 p7zip pcre2 pixman protobuf python@3.13 python@3.14 readline sevenzip shared-mime-info sketchybar sqlite taglib transmission-cli tree-sitter@0.25 umlet unibilium utf8cpp utf8proc webp x265 xorgproto xz yazi yyjson zlib-ng-compat zstd 
clear
echo "[3] Install Games/Proprietary software? 1[yes] 2[no]\nsteam ungoogled-chromium balenaetcher heroic luanti mullvad-vpn obs obsidian discord prismlauncher dolphin ares-emulator"
read a
if [ "$a" == "1" ]; then
  yes | brew install --cask steam ungoogled-chromium balenaetcher heroic luanti mullvad-vpn obs obsidian discord prismlauncher dolphin ares-emulator
else
  clear
  echo "[4] Setting defaults"
  mv ./files/.aerospace.toml $HOME/
  mv ./files/.zshrc $HOME/
  mkdir $HOME/.config
  mv ./files/* $HOME/.config/
  ./macosdefaults.sh
  clear
  echo "Install Completed!"
  open /Applications/AeroSpace.app/
  open /Applications/MonitorControl.app/
  sleep 2
  clear
  cd /Users/$USER/
  #sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
fi
