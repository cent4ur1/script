mv ./dotfilesupdate.sh $HOME/
clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
yes | brew install abseil adwaita-icon-theme aom appstream autoconf automake boost borders brotli btop ca-certificates cairo cmake fastfetch fftw fileicon fontconfig freetype fribidi gdk-pixbuf gettext gh giflib git glib gobject-introspection graphene graphite2 gtk4 harfbuzz hicolor-icon-theme highway icu4c@78 imagemagick imath iproute2mac jpeg-turbo jpeg-xl libadwaita libdatrie libde265 libdeflate libepoxy libevent libfyaml libheif libiconv libmpdclient libomp libpng librsvg libsass libthai libtiff libtool libunistring libuv libvmaf libx11 libxau libxcb libxdmcp libxext libxmlb libxrender little-cms2 lpeg luajit luv lz4 lzo m4 miniupnpc molten-vk mpdecimal mysql nasm ncmpcpp ncurses neovim nicotine-plus ninja openexr openjdk openjph openssl@3 p7zip pango pcre2 pixman pkgconf protobuf py3cairo pygobject3 python@3.13 python@3.14 readline sevenzip shared-mime-info sketchybar sqlite taglib transmission-cli tree-sitter@0.25 umlet unibilium utf8cpp utf8proc webp x265 xorgproto xz yazi yyjson zlib-ng-compat zstd 
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
