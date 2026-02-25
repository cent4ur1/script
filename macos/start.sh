clear
echo "DEFAULT MACOS SETUP"
sleep 2
clear
echo "[1] Installing brew"
sleep 1
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo "[2] Installing packages"
yes | brew install ada-url aircrack-ng aom aribb24 boost brotli c-ares ca-certificates cairo certifi chromaprint cjson cmake cmatrix cmus curl dav1d deno expat faad2 fd ffmpeg ffmpeg@7 fftw flac fluid-synth fmt fontconfig fprobe freetype frei0r fribidi fzf game-music-emu gcc gdb gdu gettext gh giflib git glew glfw glib glm gmp gnu-sed gnupg gnutls go graphite2 harfbuzz hashcat hdrhistogram_c highway hwloc hydra icu4c@77 icu4c@78 imath isl john jpeg-turbo jpeg-xl kanata lame leptonica libao libarchive libass libassuan libb2 libbluray libcue libdatrie libdeflate libevent libgcrypt libgit2 libgpg-error libiconv libid3tag libidn2 libksba liblinear libmaxminddb libmicrohttpd libmikmod libmpc libmpdclient libnfs libnghttp2 libnghttp3 libngtcp2 libogg libomp libplacebo libpng librist libsamplerate libshout libsmi libsndfile libsodium libsoxr libssh libssh2 libtasn1 libthai libtiff libtommath libudfread libunibreak libunistring libupnp libusb libuv libvidstab libvmaf libvorbis libvpx libx11 libxau libxcb libxdmcp libxext libxrender little-cms2 llhttp llvm lpeg lua luajit luv lz4 lzo mad mariadb-connector-c mbedtls mbedtls@3 minizip molten-vk mp4v2 mpd mpdecimal mpfr mpg123 mpv mujs ncmpcpp ncurses neovim nettle nikto nmap node npth nsnake ollama open-mpi opencore-amr openexr openjpeg openjph openssl@3 opus opusfile p11-kit pango pcre pcre2 pinentry pipx pixman pkgconf pmix portaudio python-tk@3.14 python@3.14 rav1e readline ripgrep rmpc rtmpdump rubberband rust rustscan sdl2 senpai shaderc simdjson snappy speex speexdsp sq sqlite sqlmap srt svt-av1 taglib tcl-tk tesseract theora tmux tree-sitter@0.25 uchardet unar unbound unibilium utf8cpp utf8proc uvwasi vapoursynth vulkan-headers vulkan-loader wavpack webp wget wireshark x264 x265 xorgproto xvid xxhash xz yt-dlp z3 zeromq zimg zstd font-hack font-hack-nerd-font font-proggy-clean-tt-nerd-font font-terminus karabiner-elements localsend obsidian prismlauncher rar 
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
