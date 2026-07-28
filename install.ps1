# -- Loopable8 installer ----------------------------------------------
# Downloads the latest release, VERIFIES its SHA-256, installs it per-user
# and adds a Start Menu shortcut. No admin rights required.
#
#   irm https://foxzyduckzy.github.io/install.ps1 | iex
#
# Or, once downloaded:
#   powershell -ExecutionPolicy Bypass -File install.ps1
#   powershell ... install.ps1 -Uninstall
#
# NOTE: keep this file ASCII-only -- PowerShell 5.1 misparses UTF-8 .ps1
# files without a BOM.
param([switch]$Uninstall)

$ErrorActionPreference = 'Stop'

$Repo    = 'foxzyduckzy/loopable8-releases'
$AppName = 'Loopable8'
$Dest    = Join-Path $env:LOCALAPPDATA 'Programs\Loopable8'
$Menu    = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'
$Lnk     = Join-Path $Menu "$AppName.lnk"

function Say($t) { Write-Host $t }

# -- Uninstall --------------------------------------------------------
# Per-user Add/Remove Programs entry, so Windows lists it under
# Settings > Apps like any normal application.
$RegKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Loopable8'

if ($Uninstall) {
  Get-Process -Name $AppName -ErrorAction SilentlyContinue | Stop-Process -Force
  Start-Sleep -Milliseconds 500
  if (Test-Path $Lnk)    { Remove-Item $Lnk -Force }
  if (Test-Path $RegKey) { Remove-Item $RegKey -Recurse -Force }
  if (Test-Path $Dest)   { Remove-Item $Dest -Recurse -Force }
  Say "$AppName removed. Your settings in %APPDATA%\$AppName were kept."
  return
}

Say "Installing $AppName..."

# -- Find the latest release ------------------------------------------
# The feed is a public releases-only repo, so no token is needed.
$rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" `
                         -Headers @{ 'User-Agent' = 'Loopable8-Installer' }
$zipAsset = $rel.assets | Where-Object { $_.name -like '*windows-x64.zip' } | Select-Object -First 1
$shaAsset = $rel.assets | Where-Object { $_.name -like '*.sha256' }        | Select-Object -First 1
if (-not $zipAsset) { throw 'No Windows build found in the latest release.' }

Say "  version : $($rel.tag_name)"
Say "  package : $($zipAsset.name) ($([math]::Round($zipAsset.size / 1MB, 1)) MB)"

$tmp = Join-Path $env:TEMP ("lo8_" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force $tmp | Out-Null
$zip = Join-Path $tmp $zipAsset.name

# -- Download ---------------------------------------------------------
Say '  downloading...'
Invoke-WebRequest -Uri $zipAsset.browser_download_url -OutFile $zip -UseBasicParsing

# -- Verify -----------------------------------------------------------
# A truncated or tampered download must never be installed.
if ($shaAsset) {
  # .Content comes back as a byte[] for an unknown content-type, and splitting
  # that yields the first byte value instead of the hash -- decode it first.
  $raw = (Invoke-WebRequest -Uri $shaAsset.browser_download_url -UseBasicParsing).Content
  if ($raw -is [byte[]]) { $raw = [System.Text.Encoding]::UTF8.GetString($raw) }
  $expected = ([string]$raw).Trim() -split '\s+' | Select-Object -First 1
  $actual   = (Get-FileHash -Algorithm SHA256 -LiteralPath $zip).Hash
  if ($actual -ne $expected.Trim()) {
    Remove-Item $tmp -Recurse -Force
    throw "Checksum mismatch - the download was discarded.`n  expected $expected`n  got      $actual"
  }
  Say '  checksum verified'
} else {
  Write-Warning '  no .sha256 published for this release - skipping verification'
}

# -- Install ----------------------------------------------------------
Get-Process -Name $AppName -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Milliseconds 500
if (Test-Path $Dest) { Remove-Item $Dest -Recurse -Force }
New-Item -ItemType Directory -Force $Dest | Out-Null
Expand-Archive -LiteralPath $zip -DestinationPath $Dest -Force
Remove-Item $tmp -Recurse -Force

$exe = Join-Path $Dest "$AppName.exe"
if (-not (Test-Path $exe)) { throw "Install looks wrong - $AppName.exe is missing." }

# -- Start Menu shortcut ----------------------------------------------
$sh = New-Object -ComObject WScript.Shell
$s  = $sh.CreateShortcut($Lnk)
$s.TargetPath       = $exe
$s.WorkingDirectory = $Dest
$s.Description      = 'Loopable8 - the AI coding workspace'
$s.Save()

# -- Register in Settings > Apps --------------------------------------
# Without this the app installs and runs but never appears in the Windows
# apps list, so there is no obvious way to uninstall it.
$ver = ($rel.tag_name -replace '^v', '')
$size = [math]::Round(((Get-ChildItem $Dest -Recurse -File | Measure-Object Length -Sum).Sum / 1KB))
New-Item -Path $RegKey -Force | Out-Null
Set-ItemProperty $RegKey DisplayName     $AppName
Set-ItemProperty $RegKey DisplayVersion  $ver
Set-ItemProperty $RegKey Publisher       'Loopable8 Studio'
Set-ItemProperty $RegKey DisplayIcon     $exe
Set-ItemProperty $RegKey InstallLocation $Dest
Set-ItemProperty $RegKey EstimatedSize   $size -Type DWord
Set-ItemProperty $RegKey NoModify        1 -Type DWord
Set-ItemProperty $RegKey NoRepair        1 -Type DWord
Set-ItemProperty $RegKey URLInfoAbout    'https://foxzyduckzy.github.io'
Set-ItemProperty $RegKey UninstallString `
  ("powershell -NoProfile -ExecutionPolicy Bypass -Command " +
   "`"irm https://foxzyduckzy.github.io/install.ps1 | iex`" -Uninstall")

Write-Host ''
Say "Installed to $Dest"
Say 'Find it in the Start Menu, or run:'
Say "  & '$exe'"
Say ''
Say "To remove:  irm https://foxzyduckzy.github.io/install.ps1 | iex -Uninstall"
