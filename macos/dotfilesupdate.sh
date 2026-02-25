cp -r $HOME/.config/ /Users/$USER/script/macos/files/

cp $HOME/.aerospace.toml /Users/$USER/script/macos/files/
cp $HOME/.zshrc /Users/$USER/script/macos/files
cp -r $HOME/.mpd/ /Users/$USER/script/macos/files/
cd $HOME/script/
git add .
git commit -m "updated files $(date +%d/%m/%Y)"
git push

