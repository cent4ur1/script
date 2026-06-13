mv ./dotfilesupdate.sh $HOME/
clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
yes | brew install abseil adwaita-icon-theme aom appstream autoconf automake boost borders btop ca-certificates cairo certifi chromaprint cmake dav1d deno faad2 fastfetch ffmpeg fftw fileicon flac fluid-synth fmt fontconfig freetype fribidi game-music-emu gdk-pixbuf gettext gh giflib git glib gmp gnutls gobject-introspection gradle gradle-completion graphene graphite2 gtk4 harfbuzz hicolor-icon-theme icu4c@78 imagemagick iproute2mac jpeg-turbo lame libadwaita libao libdatrie libde265 libepoxy libevent libfyaml libheif libid3tag libidn2 libmicrohttpd libmikmod libmpdclient libnfs libnghttp2 libnpupnp libogg libomp libpng librsvg libsamplerate libsass libshout libsndfile libsoxr libtasn1 libthai libtiff libtool libunistring libuv libvmaf libvorbis libvpx libx11 libxau libxcb libxdmcp libxext libxmlb libxrender little-cms2 lpeg lua luajit luv lz4 lzo m4 miniupnpc mlx mlx-c molten-vk mpd mpdecimal mpg123 mysql nasm ncmpcpp ncurses neovim nettle nicotine-plus ninja nowplaying-cli ollama openjdk openssl@3 opus p11-kit p7zip pango pcre2 pixman pkgconf portaudio protobuf py3cairo pygobject3 python@3.13 python@3.14 readline rmpc sdl2 sevenzip sketchybar skhd speex sqlite svt-av1 switchaudio-osx taglib theora transmission-cli tree-sitter ueberzugpp unbound unibilium utf8cpp utf8proc wavpack webp x264 x265 xorgproto xz yabai yazi yt-dlp yyjson zlib-ng-compat zstd 
clear
echo "[3] Install Games/Proprietary software? 1[yes] 2[no]\nsteam ungoogled-chromium balenaetcher heroic luanti mullvad-vpn obs obsidian discord prismlauncher dolphin ares-emulator"
read a
if [ "$a" == "1" ]; then
  yes | brew install --cask steam ungoogled-chromium balenaetcher heroic luanti mullvad-vpn obs obsidian discord prismlauncher dolphin ares-emulator
else
  clear
  echo "[4] Setting defaults"
#  mv ./files/.aerospace.toml $HOME/
  mv ./files/.zshrc $HOME/
  mkdir $HOME/.config
  mv ./files/* $HOME/.config/
  ./macosdefaults.sh
  clear
  echo "Install Completed!"
  yabai --start-service
  skhd --start-service
#  open /Applications/AeroSpace.app/
  open /Applications/MonitorControl.app/
  sleep 2
  clear
  cd /Users/$USER/
  #sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
fi
