# KernelSUģ�鹹���ű�
param(
    [string]$ModuleDir = "module",
    [string]$OutputDir = "dist"
)

Write-Host "[INFO] ��ʼ����KernelSUģ��..." -ForegroundColor Cyan

# ִ��npm����
Write-Host "[INFO] ִ�� npm run build..." -ForegroundColor Cyan
npm run build

# ��ȡģ����Ϣ
$moduleProp = Get-Content "$ModuleDir/module.prop"
$moduleId = ($moduleProp | Where-Object { $_ -match '^id=' }).Split('=')[1]
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputFileName = "${moduleId}_${timestamp}.zip"

# �������Ŀ¼
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}
$outputPath = Join-Path $OutputDir $outputFileName

Write-Host "[INFO] ����ZIP�ļ�: $outputPath" -ForegroundColor Cyan

# ɾ�����ļ�
if (Test-Path $outputPath) { Remove-Item $outputPath }

# ����ģ��Ŀ¼������ZIP�����Ŀ¼���ݶ�����Ŀ¼����
Push-Location $ModuleDir

# ����ZIP�ļ���ʹ�� * �����Ŀ¼�ڵ��������ݣ�������Ŀ¼����
Compress-Archive -Path "*" -DestinationPath "..\$outputPath" -CompressionLevel Optimal

Pop-Location

# ����ʹ��Python�ű��޸�ZIP�ļ��е�·���ָ���
$pythonScript = @"
import zipfile
import os
import tempfile
import shutil

def fix_zip_paths(zip_path):
    # ������ʱĿ¼
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_zip = os.path.join(temp_dir, 'temp.zip')

        # ��ȡԭZIP�ļ��������µ�ZIP�ļ�
        with zipfile.ZipFile(zip_path, 'r') as old_zip:
            with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as new_zip:
                for item in old_zip.infolist():
                    # ����б���滻Ϊ��б��
                    new_name = item.filename.replace('\\', '/')

                    # ��ȡ�ļ�����
                    data = old_zip.read(item.filename)

                    # д����ZIP�ļ���ʹ��������·��
                    new_zip.writestr(new_name, data)

        # �滻ԭ�ļ�
        shutil.move(temp_zip, zip_path)
        print(f"���޸�ZIP�ļ�·���ָ���: {zip_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        fix_zip_paths(sys.argv[1])
"@

# ��Python�ű�д����ʱ�ļ�
$tempPyScript = Join-Path $env:TEMP "fix_zip_paths.py"
$pythonScript | Out-File -FilePath $tempPyScript -Encoding UTF8

# ����Python�ű��޸�·��
Write-Host "[INFO] �޸�ZIP�ļ�·���ָ���..." -ForegroundColor Cyan
python $tempPyScript $outputPath

# ������ʱ�ļ�
Remove-Item $tempPyScript -Force

Write-Host "[INFO] ������: $outputPath" -ForegroundColor Green
$fileSize = (Get-Item $outputPath).Length
Write-Host "[INFO] �ļ���С: $([math]::Round($fileSize/1KB, 2)) KB" -ForegroundColor Green

# ��֤ZIP����
Write-Host "[INFO] ZIP�ļ�����:" -ForegroundColor Cyan
$tempExtract = "temp_verify"
Expand-Archive -Path $outputPath -DestinationPath $tempExtract -Force
Get-ChildItem -Path $tempExtract -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace("$PWD\$tempExtract\", "").Replace('\', '/')
    Write-Host "  $relativePath" -ForegroundColor Gray
}
Remove-Item $tempExtract -Recurse -Force

Write-Host "[SUCCESS] Module build completed!" -ForegroundColor Green
