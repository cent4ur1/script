cp -R $HOME/.config/hypr/ $HOME/script/arch/files
cp -R $HOME/.config/waybar/ $HOME/script/arch/files
cp -R $HOME/.config/alacritty/ $HOME/script/arch/files
cp -R $HOME/.config/btop/ $HOME/script/arch/files
cp -R $HOME/.zshrc $HOME/script/arch/files
cp -R $HOME/dotfilesupdatearch.sh $HOME/script/arch/
cp -R $HOME/clean.sh $HOME/script/arch/
cp -R $HOME/.local/share/icons/ $HOME/script/arch/files
echo "sudo pacman -S" $(pacman -Qqe) >>$HOME/script/arch/files/arch.sh

cd $HOME/script/
git add .
git commit -m "updated files $(date +%d/%m/%Y)"
git push
