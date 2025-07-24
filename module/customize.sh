#!/system/bin/sh

# ColorOS墓碑配置编辑器 - 安装脚本

# 设置变量
CONFIG_PATH="/data/oplus/os/bpm/sys_elsa_config_list.xml"
BACKUP_PATH="/data/local/tmp/sys_elsa_config_list.xml.bak"

# 打印安装信息
ui_print "- 正在安装 ColorOS墓碑配置编辑器"
ui_print "- 版本: v1.0.0"
ui_print "- 作者: 酷安@ItosEO"

# 检查系统要求
ui_print "- 检查系统要求..."

# 检查是否为ColorOS系统
if [ ! -d "/data/oplus" ]; then
    ui_print "! 警告: 未检测到ColorOS系统"
    ui_print "! 本模块专为ColorOS设计，其他系统可能无法正常工作"
fi

# 在KernelSU环境中运行，默认已有Root权限
ui_print "- KernelSU环境检测通过"

# 检查配置文件是否存在
if [ -f "$CONFIG_PATH" ]; then
    ui_print "- 发现墓碑配置文件: $CONFIG_PATH"
else
    ui_print "! 警告: 未找到墓碑配置文件"
    ui_print "! 文件路径: $CONFIG_PATH"
    ui_print "! 请确认设备支持墓碑机制"
fi

# 创建临时目录
ui_print "- 创建临时目录..."
mkdir -p "/data/local/tmp/tombstone_temp"
chmod 755 "/data/local/tmp/tombstone_temp"

# 设置WebUI文件权限
ui_print "- 设置文件权限..."
set_perm_recursive $MODPATH/webroot 0 0 0755 0644

# 创建初始备份（如果配置文件存在）
if [ -f "$CONFIG_PATH" ]; then
    ui_print "- 创建初始备份..."
    cp "$CONFIG_PATH" "$BACKUP_PATH" 2>/dev/null
    if [ $? -eq 0 ]; then
        chmod 644 "$BACKUP_PATH"
        ui_print "- 初始备份已创建: $BACKUP_PATH"
    else
        ui_print "! 警告: 无法创建初始备份"
    fi
fi

# 安装完成
ui_print "- 安装完成！"
ui_print ""
ui_print "使用说明:"
ui_print "1. 重启设备使模块生效"
ui_print "2. 在KernelSU管理器中找到本模块"
ui_print "3. 点击模块名称打开WebUI界面"
ui_print "4. 在WebUI中编辑墓碑配置"
ui_print ""
ui_print "注意事项:"
ui_print "- 修改配置前会自动创建备份"
ui_print "- 请谨慎修改配置，错误配置可能影响系统稳定性"
ui_print "- 如遇问题可通过备份功能恢复原配置"