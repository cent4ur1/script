rmdir $HOME\script\windows\files\.glzr
rmdir $HOME\script\windows\files\PowerShell
cp -r $HOME\Documents\PowerShell $HOME\script\windows\files\
cp -r $HOME\.glzr $HOME\script\windows\files\
cd script
git add .
git commit -m "updated windows"
git push
cd $HOME
