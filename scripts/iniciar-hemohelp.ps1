$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$frontendPort = 5173
$backendPort = 3001

function Test-PortaAberta([int]$Porta) {
  $cliente = [System.Net.Sockets.TcpClient]::new()
  try {
    $cliente.Connect("127.0.0.1", $Porta)
    return $true
  } catch {
    return $false
  } finally {
    $cliente.Dispose()
  }
}

if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
  throw "Node.js nao foi encontrado. Instale-o em https://nodejs.org/ e tente novamente."
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  throw "npm nao foi encontrado. Reinstale o Node.js e tente novamente."
}

if (-not (Test-Path (Join-Path $projectRoot "node_modules"))) {
  Write-Host "Instalando as dependencias do HemoHelp pela primeira vez..."
  & npm.cmd install --prefix $projectRoot
  if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel instalar as dependencias." }
}

if (-not (Test-PortaAberta $backendPort)) {
  Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev:backend") -WorkingDirectory $projectRoot -WindowStyle Hidden | Out-Null
}

if (-not (Test-PortaAberta $frontendPort)) {
  Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev") -WorkingDirectory $projectRoot -WindowStyle Hidden | Out-Null
}

$limite = (Get-Date).AddSeconds(30)
while (-not (Test-PortaAberta $frontendPort) -and (Get-Date) -lt $limite) {
  Start-Sleep -Milliseconds 500
}

Start-Process "http://localhost:$frontendPort"
