# 1. Set Execution Policy for the current session to allow the script to run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 2. Install Scoop
Write-Host "Installing Scoop..." -ForegroundColor Cyan
iwr -useb get.scoop.sh | iex

# 3. Add the 'extras' bucket (required for GlazeWM)
Write-Host "Adding Scoop extras bucket..." -ForegroundColor Cyan
scoop bucket add extras

# 4. Install Git and GlazeWM
Write-Host "Installing Git and GlazeWM..." -ForegroundColor Cyan
scoop install git glazewm

# 5. Run GlazeWM
Write-Host "Starting GlazeWM..." -ForegroundColor Green
start-process "glazewm.exe"

# 6. Close the terminal
Write-Host "Installation complete. Closing terminal..." -ForegroundColor Yellow
exit
