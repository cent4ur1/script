echo "updating"
yes | sudo pacman -Syu
echo "UPDATED SYSTEM"
sleep 1
clear
echo "checking old deps"
sleep 1
clear
echo "DELETING OLD DEPS: " $(pacman -Qtdq)
sleep 1
clear
yes | sudo pacman -Rns $(pacman -Qtdq)
sleep 1
clear
echo "System Updated"
sleep 1
clear
