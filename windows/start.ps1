Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install firefox vlc glazewm zebar nerdfont-hack powershell-core git gh fastfetch yazi yt-dlp


#Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

#scoop install git

#scoop bucket add extras

#scoop install glazewm
