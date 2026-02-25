echo "tiling(1) or normie?(2)"
read x






if [ "$x" == "1" ]; then
  nohup borders &
  open /Applications/AeroSpace.app/
  nohup sketchybar &
  defaults write com.apple.universalaccess reduceMotion -bool true
  defaults write com.apple.dock autohide -bool true
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
  defaults write NSGlobalDomain NSWindowResizeTime -float 0.001
  defaults write -g NSWindowShouldDragOnGesture -bool true
  defaults write NSGlobalDomain NSScrollAnimationEnabled -bool false
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
  defaults write -g QLPanelAnimationDuration -float 0
  defaults write com.apple.finder DisableAllAnimations -bool true
  rm $HOME/nohup.out
  defaults write com.apple.dock springboard-show-duration -float 0.1
  defaults write com.apple.dock persistent-apps -array # Remove all apps from dock
  defaults write com.apple.dock springboard-hide-duration -float 0.1
  defaults write com.apple.dock autohide-time-modifier -float 0
  defaults write com.apple.dock autohide-delay -float 0
  defaults write NSGlobalDomain NSTextShowsControlCharacters -bool true
  defaults write NSGlobalDomain _HIHideMenuBar -bool true

  killall SystemUIServer
  killall Dock
fi

if [ "$x" == "2" ]; then
  pkill AeroSpace
  pkill borders
  pkill sketchybar

  defaults write com.apple.universalaccess reduceMotion -bool false
  defaults write com.apple.dock autohide -bool false 
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool true 
  defaults write NSGlobalDomain NSWindowResizeTime -float 1
  defaults write NSGlobalDomain NSScrollAnimationEnabled -bool true 
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool true
  defaults write -g QLPanelAnimationDuration -float 1
  defaults write com.apple.finder DisableAllAnimations -bool false 
  defaults write com.apple.dock springboard-show-duration -float 1
  defaults write com.apple.dock springboard-hide-duration -float 1
  defaults write com.apple.dock autohide-time-modifier -float 1
  defaults write com.apple.dock autohide-delay -float 1
  defaults write NSGlobalDomain NSTextShowsControlCharacters -bool false
  defaults write NSGlobalDomain _HIHideMenuBar -bool true 
  killall Dock
fi

if [ "$x" == "2" ]; then
  pkill AeroSpace
  pkill borders
  pkill sketchybar

  defaults write com.apple.universalaccess reduceMotion -bool false
  defaults write com.apple.dock autohide -bool false 
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool true 
  defaults write NSGlobalDomain NSWindowResizeTime -float 1
  defaults write NSGlobalDomain NSScrollAnimationEnabled -bool true 
  defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool true
  defaults write -g QLPanelAnimationDuration -float 1
  defaults write com.apple.finder DisableAllAnimations -bool false 
  defaults write com.apple.dock springboard-show-duration -float 1
  defaults write com.apple.dock springboard-hide-duration -float 1
  defaults write com.apple.dock autohide-time-modifier -float 1
  defaults write com.apple.dock autohide-delay -float 1
  defaults write NSGlobalDomain NSTextShowsControlCharacters -bool false
  defaults write NSGlobalDomain _HIHideMenuBar -bool false
  killall Dock
fi
