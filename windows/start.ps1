# ============================================================
# DEV ENVIRONMENT SETUP - Portable & Self-Contained
# Everything lives under $HOME\Desktop\DevEnv
# Delete that folder = clean slate, no traces
# ============================================================

# 1. Define base directory on Desktop
$devRoot   = "$HOME\Desktop\DevEnv"
$scoopDir  = "$devRoot\scoop"
$configDir = "$devRoot\configs"

# Set environment variables for this session
$env:SCOOP  = $scoopDir
$env:HOME   = $HOME

# Create config folder
New-Item -ItemType Directory -Force -Path $configDir | Out-Null

# ============================================================
# 2. Install Scoop into Desktop\DevEnv\scoop (FIXED)
# ============================================================
Write-Host "Installing Scoop to $scoopDir..." -ForegroundColor Cyan
iex "& { $(irm get.scoop.sh) } -ScoopDir '$scoopDir'"

# ============================================================
# 3. Add extras bucket & install packages
# ============================================================
Write-Host "Adding extras bucket..." -ForegroundColor Cyan
& "$scoopDir\shims\scoop.ps1" bucket add extras

Write-Host "Installing packages..." -ForegroundColor Cyan
& "$scoopDir\shims\scoop.ps1" install git glazewm python neovim

# ============================================================
# 4. Generate GlazeWM config into Desktop\DevEnv\configs
# ============================================================
Write-Host "Setting up GlazeWM config..." -ForegroundColor Cyan

$glazeConfig = "$configDir\glazewm-config.yaml"

@"
general:
  show_floating_on_top: true

gaps:
  inner_gap: 1
  outer_gap: 1

focus_borders:
  active:
    enabled: true
    color: "#FFFFFF"
  inactive:
    enabled: false

bar:
  enabled: true
  height: 30
  position: top
  components_left:
    - type: workspaces
  components_right:
    - type: clock
      time_formatting: "hh:mm tt"

keybindings:
  # --- Close / kill focused window ---
  - command: close
    bindings: ["Alt+Q"]

  # --- Fullscreen ---
  - command: toggle fullscreen
    bindings: ["Alt+F"]

  # --- Toggle floating ---
  - command: toggle floating
    bindings: ["Alt+V"]

  # --- Focus movement ---
  - command: focus left
    bindings: ["Alt+H"]
  - command: focus right
    bindings: ["Alt+L"]
  - command: focus up
    bindings: ["Alt+K"]
  - command: focus down
    bindings: ["Alt+J"]

  # --- Move windows ---
  - command: move left
    bindings: ["Alt+Shift+H"]
  - command: move right
    bindings: ["Alt+Shift+L"]
  - command: move up
    bindings: ["Alt+Shift+K"]
  - command: move down
    bindings: ["Alt+Shift+J"]

  # --- Exit WM ---
  - command: exit wm
    bindings: ["Alt+Shift+E"]

  # --- Workspaces 1-4 ---
  - command: focus workspace 1
    bindings: ["Alt+1"]
  - command: focus workspace 2
    bindings: ["Alt+2"]
  - command: focus workspace 3
    bindings: ["Alt+3"]
  - command: focus workspace 4
    bindings: ["Alt+4"]

  # --- Workspaces 5, 6, 7 on Alt+M / Alt+, / Alt+. ---
  - command: focus workspace 5
    bindings: ["Alt+M"]
  - command: focus workspace 6
    bindings: ["Alt+OEM_COMMA"]
  - command: focus workspace 7
    bindings: ["Alt+OEM_PERIOD"]

  # --- Move window to workspaces ---
  - command: move to workspace 1
    bindings: ["Alt+Shift+1"]
  - command: move to workspace 2
    bindings: ["Alt+Shift+2"]
  - command: move to workspace 3
    bindings: ["Alt+Shift+3"]
  - command: move to workspace 4
    bindings: ["Alt+Shift+4"]
  - command: move to workspace 5
    bindings: ["Alt+Shift+M"]
  - command: move to workspace 6
    bindings: ["Alt+Shift+OEM_COMMA"]
  - command: move to workspace 7
    bindings: ["Alt+Shift+OEM_PERIOD"]

  # --- Suppress Win+Space and Alt+Shift (language switcher) ---
  - command: shell-exec echo noop
    bindings: ["LWin+Space"]
  - command: shell-exec echo noop
    bindings: ["Alt+Shift"]

workspaces:
  - name: "1"
  - name: "2"
  - name: "3"
  - name: "4"
  - name: "5"
  - name: "6"
  - name: "7"
"@ | Set-Content -Path $glazeConfig -Encoding UTF8

# ============================================================
# 5. Generate Neovim config into Desktop\DevEnv\configs
# ============================================================
Write-Host "Setting up Neovim config..." -ForegroundColor Cyan

$nvimConfigDir = "$configDir\nvim"
New-Item -ItemType Directory -Force -Path $nvimConfigDir | Out-Null

@"
-- Neovim config (lives in Desktop\DevEnv\configs\nvim\init.lua)
vim.opt.number         = true
vim.opt.relativenumber = true
vim.opt.tabstop        = 4
vim.opt.shiftwidth     = 4
vim.opt.expandtab      = true
vim.opt.wrap           = false
vim.opt.termguicolors  = true
"@ | Set-Content -Path "$nvimConfigDir\init.lua" -Encoding UTF8

# Point Neovim's XDG config at our custom dir for this session
$env:XDG_CONFIG_HOME = $configDir

# ============================================================
# 6. Launch GlazeWM with the custom config path
# ============================================================
Write-Host "Launching GlazeWM..." -ForegroundColor Green

$glazeExe = "$scoopDir\apps\glazewm\current\glazewm.exe"
Start-Process $glazeExe -ArgumentList "--config `"$glazeConfig`""

# ============================================================
# 7. Done
# ============================================================
Write-Host ""
Write-Host "Done! Your dev environment is at:" -ForegroundColor Green
Write-Host "  $devRoot" -ForegroundColor Yellow
Write-Host ""
Write-Host "To REMOVE everything, just delete that folder:" -ForegroundColor Green
Write-Host "  Remove-Item -Recurse -Force '$devRoot'" -ForegroundColor Red
Write-Host ""

exit
