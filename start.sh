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
mv ./files $HOME/.config/
defaults write com.apple.universalaccess reduceMotion -bool true
defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
defaults write NSGlobalDomain NSWindowResizeTime -float 0.001
defaults write NSGlobalDomain NSScrollAnimationEnabled -bool false
defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
defaults write -g QLPanelAnimationDuration -float 0
defaults write com.apple.finder DisableAllAnimations -bool true
defaults write com.apple.dock springboard-show-duration -float 0.1
defaults write com.apple.dock springboard-hide-duration -float 0.1
defaults write com.apple.dock autohide-time-modifier -float 0
defaults write com.apple.dock autohide-delay -float 0
defaults write NSGlobalDomain NSTextShowsControlCharacters -bool true
killall Dock
echo "Done"
open /Applications/AeroSpace.app/
open /Applications/MonitorControl.app/
open /Applications/Mac Mouse Fix.app/
sleep 2 
clear
cd /Users/$USER/
rm -rf /Users/$USER/script/

#sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
