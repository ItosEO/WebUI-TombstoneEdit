#requires -Version 5.0
<#######################################################################
  ColorOS Tombstone Editor – Module Build Script (Windows PowerShell)
  作用：
  1. 安装/更新 npm 依赖（如有必要）
  2. 执行 `npm run build`（使用 Parcel 将前端资源编译到 module/webroot）
  3. 将 module 目录打包成 zip（文件名自动包含版本号与时间戳）
  4. 输出结果路径，方便直接上传/安装到 KernelSU
#######################################################################>

param(
    [string]$ModuleDir = "module",            # 模块根目录
    [string]$OutputDir = "dist"               # zip 输出目录
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg)  { Write-Host "[INFO]  $msg"  -ForegroundColor Cyan }
function Write-Warn($msg)  { Write-Host "[WARN]  $msg"  -ForegroundColor Yellow }
function Write-ErrorAndExit($msg) {
    Write-Host "[ERROR] $msg" -ForegroundColor Red
    exit 1
}

# 检查目录结构
if (-not (Test-Path $ModuleDir)) {
    Write-ErrorAndExit "未找到模块目录 '$ModuleDir'，请在仓库根目录运行本脚本。"
}
if (-not (Test-Path "package.json")) {
    Write-ErrorAndExit "未找到 package.json，无法执行构建。"
}

# 安装 npm 依赖（若 node_modules 不存在或 package.json 新增依赖）
if (-not (Test-Path "node_modules")) {
    Write-Info "首次运行或缺少 node_modules，开始安装依赖…"
    npm install --no-audit --no-fund | Out-Null
} else {
    Write-Info "检测依赖更新…"
    npm install --no-audit --no-fund --prefer-offline | Out-Null
}

# 执行 Parcel 构建（将缓存目录固定在当前项目，避免跨盘 EXDEV）
Write-Info "执行 npm run build (Parcel)…"
$env:PARCEL_CACHE_DIR = (Join-Path (Get-Location) ".parcel-cache")
try {
    npm run build --silent
} catch {
    Write-ErrorAndExit "构建失败，请检查上方错误日志。"
}

# 生成输出文件名：<moduleId>_v<version>_<timestamp>.zip
$json = Get-Content package.json -Raw | ConvertFrom-Json
$version = $json.version
$moduleProp = Get-Content "$ModuleDir/module.prop" -ErrorAction SilentlyContinue
$moduleId = ($moduleProp | Select-String '^id=').ToString().Split('=')[1]
if (-not $moduleId) { $moduleId = "module" }

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputFileName = "${moduleId}_v${version}_${timestamp}.zip"

# 创建输出目录
if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir | Out-Null }
$outputPath = Join-Path $OutputDir $outputFileName

# -------------- 使用临时目录保留结构并排除源码 --------------
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "tombstone_build_$timestamp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

Write-Info "复制模块到临时目录：$tempDir"
# 创建临时模块目录并逐项复制文件
New-Item -ItemType Directory -Path "$tempDir" -Force | Out-Null

# 复制 module.prop 和 customize.sh
Copy-Item -Path "$ModuleDir\module.prop" -Destination "$tempDir\" -Force
Copy-Item -Path "$ModuleDir\customize.sh" -Destination "$tempDir\" -Force

# 复制 META-INF 目录（如果存在）
if (Test-Path "$ModuleDir\META-INF") {
    Copy-Item -Path "$ModuleDir\META-INF" -Destination "$tempDir\" -Recurse -Force
}

# 创建 webroot 目录
New-Item -ItemType Directory -Path "$tempDir\webroot" -Force | Out-Null

# 仅复制 webroot 根目录编译后的文件，不包括源码目录
Copy-Item -Path "$ModuleDir\webroot\*.html" -Destination "$tempDir\webroot\" -Force
Copy-Item -Path "$ModuleDir\webroot\*.css" -Destination "$tempDir\webroot\" -Force
Copy-Item -Path "$ModuleDir\webroot\*.js" -Destination "$tempDir\webroot\" -Force

# 复制其他资源目录（如 images、fonts 等，但排除 js 和 styles）
$assetDirs = Get-ChildItem -Path "$ModuleDir\webroot" -Directory | Where-Object { $_.Name -notin @('js','styles') }
foreach ($dir in $assetDirs) {
    Copy-Item -Path $dir.FullName -Destination "$tempDir\webroot\" -Recurse -Force
    Write-Info "复制资源目录: $($dir.Name)"
}

# -------------- 压缩 --------------
Write-Info "开始压缩 → $outputPath …"
if (Test-Path $outputPath) { Remove-Item $outputPath }
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -CompressionLevel Optimal

# 清理临时目录
Remove-Item $tempDir -Recurse -Force

Write-Info "打包完成！生成文件: $outputPath" 