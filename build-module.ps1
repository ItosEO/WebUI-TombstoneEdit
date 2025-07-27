# KernelSU模块构建脚本
param(
    [string]$ModuleDir = "module",
    [string]$OutputDir = "dist"
)

Write-Host "[INFO] 开始构建KernelSU模块..." -ForegroundColor Cyan

# 执行npm构建
Write-Host "[INFO] 执行 npm run build..." -ForegroundColor Cyan
npm run build

# 获取模块信息
$moduleProp = Get-Content "$ModuleDir/module.prop"
$moduleId = ($moduleProp | Where-Object { $_ -match '^id=' }).Split('=')[1]
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputFileName = "${moduleId}_${timestamp}.zip"

# 创建输出目录
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}
$outputPath = Join-Path $OutputDir $outputFileName

Write-Host "[INFO] 创建ZIP文件: $outputPath" -ForegroundColor Cyan

# 删除旧文件
if (Test-Path $outputPath) { Remove-Item $outputPath }

# 进入模块目录并创建ZIP（打包目录内容而不是目录本身）
Push-Location $ModuleDir

# 创建ZIP文件，使用 * 来打包目录内的所有内容，而不是目录本身
Compress-Archive -Path "*" -DestinationPath "..\$outputPath" -CompressionLevel Optimal

Pop-Location

# 现在使用Python脚本修复ZIP文件中的路径分隔符
$pythonScript = @"
import zipfile
import os
import tempfile
import shutil

def fix_zip_paths(zip_path):
    # 创建临时目录
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_zip = os.path.join(temp_dir, 'temp.zip')

        # 读取原ZIP文件并创建新的ZIP文件
        with zipfile.ZipFile(zip_path, 'r') as old_zip:
            with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as new_zip:
                for item in old_zip.infolist():
                    # 将反斜杠替换为正斜杠
                    new_name = item.filename.replace('\\', '/')

                    # 读取文件内容
                    data = old_zip.read(item.filename)

                    # 写入新ZIP文件，使用修正的路径
                    new_zip.writestr(new_name, data)

        # 替换原文件
        shutil.move(temp_zip, zip_path)
        print(f"已修复ZIP文件路径分隔符: {zip_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        fix_zip_paths(sys.argv[1])
"@

# 将Python脚本写入临时文件
$tempPyScript = Join-Path $env:TEMP "fix_zip_paths.py"
$pythonScript | Out-File -FilePath $tempPyScript -Encoding UTF8

# 运行Python脚本修复路径
Write-Host "[INFO] 修复ZIP文件路径分隔符..." -ForegroundColor Cyan
python $tempPyScript $outputPath

# 清理临时文件
Remove-Item $tempPyScript -Force

Write-Host "[INFO] 打包完成: $outputPath" -ForegroundColor Green
$fileSize = (Get-Item $outputPath).Length
Write-Host "[INFO] 文件大小: $([math]::Round($fileSize/1KB, 2)) KB" -ForegroundColor Green

# 验证ZIP内容
Write-Host "[INFO] ZIP文件内容:" -ForegroundColor Cyan
$tempExtract = "temp_verify"
Expand-Archive -Path $outputPath -DestinationPath $tempExtract -Force
Get-ChildItem -Path $tempExtract -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace("$PWD\$tempExtract\", "").Replace('\', '/')
    Write-Host "  $relativePath" -ForegroundColor Gray
}
Remove-Item $tempExtract -Recurse -Force

Write-Host "[SUCCESS] Module build completed!" -ForegroundColor Green
