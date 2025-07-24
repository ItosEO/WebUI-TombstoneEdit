#requires -Version 5.0
<#######################################################################
  ColorOS Tombstone Editor �C Module Build Script (Windows PowerShell)
  ���ã�
  1. ��װ/���� npm ���������б�Ҫ��
  2. ִ�� `npm run build`��ʹ�� Parcel ��ǰ����Դ���뵽 module/webroot��
  3. �� module Ŀ¼����� zip���ļ����Զ������汾����ʱ�����
  4. ������·��������ֱ���ϴ�/��װ�� KernelSU
#######################################################################>

param(
    [string]$ModuleDir = "module",            # ģ���Ŀ¼
    [string]$OutputDir = "dist"               # zip ���Ŀ¼
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg)  { Write-Host "[INFO]  $msg"  -ForegroundColor Cyan }
function Write-Warn($msg)  { Write-Host "[WARN]  $msg"  -ForegroundColor Yellow }
function Write-ErrorAndExit($msg) {
    Write-Host "[ERROR] $msg" -ForegroundColor Red
    exit 1
}

# ���Ŀ¼�ṹ
if (-not (Test-Path $ModuleDir)) {
    Write-ErrorAndExit "δ�ҵ�ģ��Ŀ¼ '$ModuleDir'�����ڲֿ��Ŀ¼���б��ű���"
}
if (-not (Test-Path "package.json")) {
    Write-ErrorAndExit "δ�ҵ� package.json���޷�ִ�й�����"
}

# ��װ npm �������� node_modules �����ڻ� package.json ����������
if (-not (Test-Path "node_modules")) {
    Write-Info "�״����л�ȱ�� node_modules����ʼ��װ������"
    npm install --no-audit --no-fund | Out-Null
} else {
    Write-Info "����������¡�"
    npm install --no-audit --no-fund --prefer-offline | Out-Null
}

# ִ�� Parcel ������������Ŀ¼�̶��ڵ�ǰ��Ŀ��������� EXDEV��
Write-Info "ִ�� npm run build (Parcel)��"
$env:PARCEL_CACHE_DIR = (Join-Path (Get-Location) ".parcel-cache")
try {
    npm run build --silent
} catch {
    Write-ErrorAndExit "����ʧ�ܣ������Ϸ�������־��"
}

# ��������ļ�����<moduleId>_v<version>_<timestamp>.zip
$json = Get-Content package.json -Raw | ConvertFrom-Json
$version = $json.version
$moduleProp = Get-Content "$ModuleDir/module.prop" -ErrorAction SilentlyContinue
$moduleId = ($moduleProp | Select-String '^id=').ToString().Split('=')[1]
if (-not $moduleId) { $moduleId = "module" }

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputFileName = "${moduleId}_v${version}_${timestamp}.zip"

# �������Ŀ¼
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir | Out-Null }
$outputPath = Join-Path $OutputDir $outputFileName

# -------------- ʹ����ʱĿ¼�����ṹ���ų�Դ�� --------------
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "tombstone_build_$timestamp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

Write-Info "����ģ�鵽��ʱĿ¼��$tempDir"
# ������ʱģ��Ŀ¼��������ļ�
New-Item -ItemType Directory -Path "$tempDir" -Force | Out-Null

# ���� module.prop �� customize.sh
Copy-Item -Path "$ModuleDir\module.prop" -Destination "$tempDir\" -Force
Copy-Item -Path "$ModuleDir\customize.sh" -Destination "$tempDir\" -Force

# ���� META-INF Ŀ¼��������ڣ�
if (Test-Path "$ModuleDir\META-INF") {
    Copy-Item -Path "$ModuleDir\META-INF" -Destination "$tempDir\" -Recurse -Force
}

# ���� webroot Ŀ¼
New-Item -ItemType Directory -Path "$tempDir\webroot" -Force | Out-Null

# ������ webroot ��Ŀ¼�������ļ���������Դ��Ŀ¼
Copy-Item -Path "$ModuleDir\webroot\*.html" -Destination "$tempDir\webroot\" -Force
Copy-Item -Path "$ModuleDir\webroot\*.css" -Destination "$tempDir\webroot\" -Force
Copy-Item -Path "$ModuleDir\webroot\*.js" -Destination "$tempDir\webroot\" -Force

# ����������ԴĿ¼���� images��fonts �ȣ����ų� js �� styles��
$assetDirs = Get-ChildItem -Path "$ModuleDir\webroot" -Directory | Where-Object { $_.Name -notin @('js','styles') }
foreach ($dir in $assetDirs) {
    Copy-Item -Path $dir.FullName -Destination "$tempDir\webroot\" -Recurse -Force
    Write-Info "������ԴĿ¼: $($dir.Name)"
}

# -------------- ѹ�� --------------
Write-Info "��ʼѹ�� �� $outputPath ��"
if (Test-Path $outputPath) { Remove-Item $outputPath }
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -CompressionLevel Optimal

# ������ʱĿ¼
Remove-Item $tempDir -Recurse -Force

Write-Info "�����ɣ������ļ�: $outputPath" 