cp -R $HOME/.config/hypr/ $HOME/script/archfiles/
cp -R $HOME/.config/waybar/ $HOME/script/archfiles/
cp -R $HOME/.config/alacritty/ $HOME/script/archfiles/
cp -R $HOME/.config/alacritty/ $HOME/script/archfiles/
cp -R $HOME/.config/btop/ $HOME/script/archfiles/
cp -R $HOME/.zshrc $HOME/script/archfiles/

cd $HOME/script/
git add .
git commit -m "updated files $(date +%d/%m/%Y)"
git push

