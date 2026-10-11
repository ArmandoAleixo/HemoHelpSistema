$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$processos = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -in @("node.exe", "npm.exe", "cmd.exe") -and $_.CommandLine -like "*$projectRoot*"
}

foreach ($processo in $processos) {
  Stop-Process -Id $processo.ProcessId -Force -ErrorAction SilentlyContinue
}
