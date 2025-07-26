#!/system/bin/sh

# 测试日志功能的脚本
# 用于验证WebUI是否正确写入日志到 /cache/webui_tombstone.log

LOG_FILE="/cache/webui_tombstone.log"

echo "=== WebUI Tombstone Editor 日志测试 ==="
echo "日志文件路径: $LOG_FILE"
echo ""

# 检查日志文件是否存在
if [ -f "$LOG_FILE" ]; then
    echo "✅ 日志文件存在"
    
    # 显示文件大小
    FILE_SIZE=$(wc -c < "$LOG_FILE" 2>/dev/null || echo "0")
    echo "📊 文件大小: ${FILE_SIZE} 字节"
    
    # 显示最后10行日志
    echo ""
    echo "📝 最近10行日志:"
    echo "----------------------------------------"
    tail -n 10 "$LOG_FILE" 2>/dev/null || echo "无法读取日志内容"
    echo "----------------------------------------"
    
    # 统计日志条目
    echo ""
    echo "📈 日志统计:"
    INFO_COUNT=$(grep -c "\[INFO\]" "$LOG_FILE" 2>/dev/null || echo "0")
    WARN_COUNT=$(grep -c "\[WARN\]" "$LOG_FILE" 2>/dev/null || echo "0")
    ERROR_COUNT=$(grep -c "\[ERROR\]" "$LOG_FILE" 2>/dev/null || echo "0")
    DEBUG_COUNT=$(grep -c "\[DEBUG\]" "$LOG_FILE" 2>/dev/null || echo "0")
    
    echo "  INFO:  $INFO_COUNT 条"
    echo "  WARN:  $WARN_COUNT 条"
    echo "  ERROR: $ERROR_COUNT 条"
    echo "  DEBUG: $DEBUG_COUNT 条"
    
else
    echo "❌ 日志文件不存在"
    echo "   可能原因:"
    echo "   1. WebUI尚未启动"
    echo "   2. 日志系统初始化失败"
    echo "   3. 权限问题"
fi

echo ""
echo "=== 测试完成 ==="
