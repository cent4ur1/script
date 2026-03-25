# 1. Define the custom installation directory
$scoopDir = "$HOME\scoop"
$env:SCOOP = $scoopDir

# 2. Download and Run the Scoop installer with the custom directory argument
# This ensures Scoop and all its metadata live in ~/scoop
Write-Host "Installing Scoop to $scoopDir..." -ForegroundColor Cyan
Invoke-RestMethod -Uri get.scoop.sh | Invoke-Expression -Command { $args[0] } -ArgumentList "-ScoopDir $scoopDir"

# 3. Add the 'extras' bucket (needed for GlazeWM)
Write-Host "Adding extras bucket..." -ForegroundColor Cyan
scoop bucket add extras

# 4. Install Git, GlazeWM, Python, and Neovim
Write-Host "Installing packages..." -ForegroundColor Cyan
scoop install git glazewm python neovim

# 5. Start GlazeWM
# We use Start-Process so it doesn't 'hang' the script
Write-Host "Launching GlazeWM..." -ForegroundColor Green
Start-Process "$scoopDir\apps\glazewm\current\glazewm.exe"

# 6. Exit the terminal
exit
