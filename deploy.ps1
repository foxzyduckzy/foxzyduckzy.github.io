# -- Loopable8 website deploy ----------------------------------------
# Publishes this folder to GitHub Pages (foxzyduckzy.github.io) and then
# VERIFIES the live site actually serves the pages -- a push that lands but
# fails to build would otherwise look like a success.
#
#   powershell -ExecutionPolicy Bypass -File deploy.ps1
#   powershell ... deploy.ps1 -DryRun            # show what would ship
#   powershell ... deploy.ps1 -Message "new pricing"
#   powershell ... deploy.ps1 -Placeholder       # put up a Coming soon page
#   powershell ... deploy.ps1 -Restore           # undo -Placeholder
#
# NOTE: keep this file ASCII-only -- PowerShell 5.1 misparses UTF-8 .ps1
# files without a BOM.
param(
  [switch]$DryRun,
  [switch]$Placeholder,
  [switch]$Restore,
  [string]$Message
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$Site  = 'https://foxzyduckzy.github.io'
$Pages = @('', '/privacy.html', '/terms.html', '/refund.html')
$Held  = '.index.real.html'   # where the real index waits during -Placeholder

function Say($t) { Write-Host $t }
function Step($t) { Write-Host ''; Write-Host "== $t" }

# -- Placeholder mode -------------------------------------------------
# Swaps index.html for a Coming soon page while the app is still in progress.
# The legal pages stay live on purpose: Paddle needs them reachable.
if ($Placeholder) {
  if (-not (Test-Path $Held)) { Copy-Item index.html $Held -Force }
  @'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Loopable8 - Coming soon</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #0b0b0c; color: #e8e8e8; text-align: center; padding: 24px;
    font: 16px/1.6 Inter, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  .wrap { max-width: 560px; }
  .mark {
    width: 60px; height: 60px; margin: 0 auto 26px; display: grid;
    place-items: center; border: 1px solid #282828; border-radius: 18px;
    background: #141414; font-size: 26px;
  }
  h1 { font-size: 40px; line-height: 1.12; letter-spacing: -1.2px; margin: 0 0 14px; }
  p { color: #858585; margin: 0 auto 28px; max-width: 440px; }
  .row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  a.btn {
    display: inline-block; padding: 10px 22px; border-radius: 999px;
    text-decoration: none; font-size: 14px; font-weight: 600;
    border: 1px solid #363636; color: #e8e8e8;
  }
  a.primary { background: #e8e8e8; color: #0b0b0c; border-color: #e8e8e8; }
  .legal { margin-top: 34px; font-size: 13px; color: #5f5f5f; }
  .legal a { color: #858585; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="mark">&#8734;</div>
    <h1>Loopable8 is almost here</h1>
    <p>An AI workspace that actually builds - it plans the work, edits the
       files and runs the commands, right on your machine.</p>
    <div class="row">
      <a class="btn primary" href="https://github.com/foxzyduckzy/loopable8-releases/releases/latest">Download the preview</a>
      <a class="btn" href="mailto:fredrickgonzales54@gmail.com">Get in touch</a>
    </div>
    <div class="legal">
      <a href="/privacy.html">Privacy</a> &middot;
      <a href="/terms.html">Terms</a> &middot;
      <a href="/refund.html">Refund</a>
    </div>
  </div>
</body>
</html>
'@ | Set-Content -LiteralPath index.html -Encoding utf8
  Say 'Placeholder index.html written (real one saved as .index.real.html).'
}

if ($Restore) {
  if (Test-Path $Held) {
    Move-Item $Held index.html -Force
    Say 'Real index.html restored.'
  } else {
    Say 'Nothing to restore -- no .index.real.html found.'
  }
}

# -- What would ship --------------------------------------------------
Step 'Changes to publish'
$dirty = git status --porcelain
if ($dirty) { $dirty } else { Say '  (working tree clean)' }

$ahead = (git rev-list --count '@{u}..HEAD' 2>$null)
if ($ahead -and $ahead -ne '0') { Say "  $ahead commit(s) not yet pushed" }

if (-not $dirty -and (-not $ahead -or $ahead -eq '0')) {
  Say ''
  Say 'Nothing to deploy -- the live site already matches this folder.'
  exit 0
}

if ($DryRun) { Say ''; Say 'DryRun: stopping before commit/push.'; exit 0 }

# -- Publish ----------------------------------------------------------
Step 'Publishing'
if ($dirty) {
  if (-not $Message) {
    $Message = if ($Placeholder) { 'Put up the coming-soon page' }
               elseif ($Restore) { 'Restore the full site' }
               else { 'Update site' }
  }
  git add -A
  git commit -m $Message | Out-Null
  Say "  committed: $Message"
}
git push origin HEAD
Say '  pushed to GitHub Pages'

# -- Verify it is really serving --------------------------------------
# Pages rebuilds asynchronously, so poll rather than declaring victory.
Step 'Verifying the live site'
$deadline = (Get-Date).AddMinutes(3)
$ok = $false
while ((Get-Date) -lt $deadline) {
  Start-Sleep -Seconds 10
  try {
    $code = (Invoke-WebRequest -Uri $Site -Method Head -TimeoutSec 15 -UseBasicParsing).StatusCode
    if ($code -eq 200) { $ok = $true; break }
  } catch { }
  Say '  waiting for Pages to rebuild...'
}

if (-not $ok) {
  Write-Warning "Pushed, but $Site did not answer 200 within 3 minutes."
  Write-Warning 'Check the Pages build: gh run list --repo foxzyduckzy/foxzyduckzy.github.io'
  exit 1
}

$bad = @()
foreach ($p in $Pages) {
  try {
    $c = (Invoke-WebRequest -Uri "$Site$p" -Method Head -TimeoutSec 15 -UseBasicParsing).StatusCode
  } catch { $c = 'ERR' }
  $label = if ($p) { $p } else { '/' }
  Say ("  {0,-16} {1}" -f $label, $c)
  if ($c -ne 200) { $bad += $label }
}

Write-Host ''
if ($bad.Count -gt 0) {
  Write-Warning ("Live, but these did not return 200: " + ($bad -join ', '))
  exit 1
}
Say "Deployed and verified -> $Site"
Say 'Legal pages are reachable, which is what Paddle checks.'
