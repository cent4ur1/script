#Chocolatey
#Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
#choco install firefox vlc glazewm zebar nerdfont-hack powershell-core git gh fastfetch yazi yt-dlp -y


# Scoop 
#Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
#scoop install git
#scoop bucket add extras
#scoop install glazewm zebar


$choice = Read-Host "Enter 1 for Chocolatey, 2 for Scoop"
 
if ($choice -eq '1') {
	Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
	Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
	choco install firefox vlc glazewm zebar nerdfont-hack powershell-core git gh fastfetch yazi yt-dlp -y

}
elseif ($choice -eq '2') {
	Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
	scoop install git
	scoop bucket add extras
	scoop install glazewm zebar
}
else {
    Write-Host "Invalid choice. Please enter 1 or 2."
}
 
cp $HOME\script\windows\files\.glzr\ $HOME
cp $HOME\script\windows\files\PowerShell\ $HOME\Documents\
