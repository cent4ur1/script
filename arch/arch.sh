mkdir $HOME/Documents $HOME/Documents $HOME/Music $HOME/Pictures $HOME/Downloads $HOME/Desktop $HOME/Videos
mkdir $HOME/.gh/
cp ./dotfilesupdatearch.sh $HOME/
cp ./files/.zshrc $HOME/
yes | sudo pacman -S hypland alacritty
hyprctl dispatch exec "alacritty -e $HOME/script/arch/arch2.sh" &
