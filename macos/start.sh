mv ./dotfilesupdate.sh $HOME/
clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
yes | brew install abseil adwaita-icon-theme aom appstream autoconf automake boost borders brotli btop ca-certificates cairo cfitsio cgif chafa chromaprint cli11 cmake dav1d faad2 fastfetch ffmpeg fftw fileicon flac fluid-synth fmt fontconfig freetype fribidi game-music-emu gcc gdk-pixbuf gettext gh giflib git glib gmp gnupg gnutls gobject-introspection gpgme gpgmepp graphene graphite2 gtk4 harfbuzz hdf5 hicolor-icon-theme highway hwloc icu4c@78 imagemagick imath iproute2mac isl jpeg-turbo jpeg-xl lame libadwaita libaec libao libarchive libassuan libavif libb2 libdatrie libde265 libdeflate libdicom libepoxy libevent libexif libfyaml libgcrypt libgpg-error libheif libid3tag libidn2 libimagequant libksba libmatio libmicrohttpd libmikmod libmpc libmpdclient libnfs libnghttp2 libnpupnp libogg libomp libpng libraw librsvg libsamplerate libsass libshout libsixel libsndfile libsoxr libtasn1 libthai libtiff libtool libultrahdr libunistring libusb libuv libvmaf libvorbis libvpx libx11 libxau libxcb libxdmcp libxext libxml2 libxmlb libxrender little-cms2 lpeg lua luajit luv lz4 lzo m4 miniupnpc mlx mlx-c molten-vk mozjpeg mpd mpdecimal mpfr mpg123 mysql nasm ncmpcpp ncurses neovim nettle nicotine-plus ninja nlohmann-json nowplaying-cli npth nspr nss ollama openexr openjdk openjpeg openjph openslide openssl@3 opus p11-kit p7zip pango pcre2 pinentry pixman pkgconf poppler portaudio protobuf py3cairo pygobject3 python@3.13 python@3.14 range-v3 readline rmpc sdl2 sevenzip shared-mime-info sketchybar skhd spdlog speex sqlite svt-av1 switchaudio-osx taglib tbb theora transmission-cli tree-sitter ueberzugpp unbound unibilium utf8cpp utf8proc uthash vips wavpack webp x264 x265 xorgproto xz yabai yazi yyjson zlib-ng-compat zstd 
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
