cp -r $HOME/.config/ /Users/$USER/script/files/
cp $HOME/.aerospace.toml /Users/$USER/script/files/
cp $HOME/.zshrc /Users/$USER/script/files/
cp $HOME/dotfilesupdate.sh /Users/$USER/script/files/
cp $HOME/.mpd/ $HOME/script/files/
cd $HOME/script/
git add .
git commit -m "updated files $(date +%d/%m/%Y)"
git push

