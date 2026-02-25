cp -R $HOME/.config/hypr/ $HOME/script/archfiles/
cp -R $HOME/.config/waybar/ $HOME/script/archfiles/
cp -R $HOME/.config/alacritty/ $HOME/script/archfiles/
cp -R $HOME/.config/alacritty/ $HOME/script/archfiles/
cp -R $HOME/.config/btop/ $HOME/script/archfiles/
cp -R $HOME/.zshrc $HOME/script/archfiles/
cp -R $HOME/.zprofile $HOME/script/archfiles/
cp -R $HOME/dotfilesupdatearch.sh $HOME/script/archfiles/
cp -R $HOME/clean.sh $HOME/script/archfiles/
echo "sudo pacman -S" $(pacman -Qqe) > $HOME/script/packages.sh

cd $HOME/script/
git add .
git commit -m "updated files $(date +%d/%m/%Y)"
git push

