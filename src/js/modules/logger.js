/**
 * 日志管理器模块
 * 负责将所有日志输出到 /cache/webui_tombstone.log 文件
 */

import { exec } from 'kernelsu';

export class Logger {
    constructor() {
        this.logFile = '/cache/webui_tombstone.log';
        this.maxLogSize = 1024 * 1024; // 1MB
        this.isInitialized = false;
        
        // 初始化日志文件
        this.initializeLogFile();
    }

    /**
     * 初始化日志文件
     */
    async initializeLogFile() {
        try {
            // 确保cache目录存在
            await exec('mkdir -p /cache');
            
            // 检查日志文件大小，如果太大则清理
            await this.rotateLogIfNeeded();
            
            // 写入启动标记
            await this.writeToFile('=== WebUI Tombstone Editor Started ===');
            await this.writeToFile(`启动时间: ${new Date().toISOString()}`);
            
            this.isInitialized = true;
            
        } catch (error) {
            // 如果日志初始化失败，回退到console
            console.error('日志系统初始化失败:', error);
        }
    }

    /**
     * 日志轮转 - 如果文件太大则清理
     */
    async rotateLogIfNeeded() {
        try {
            const result = await exec(`[ -f "${this.logFile}" ] && wc -c < "${this.logFile}" || echo 0`);
            const fileSize = parseInt(result.stdout?.trim() || '0');
            
            if (fileSize > this.maxLogSize) {
                // 保留最后100行
                await exec(`tail -n 100 "${this.logFile}" > "${this.logFile}.tmp" && mv "${this.logFile}.tmp" "${this.logFile}"`);
                await this.writeToFile('=== 日志文件已轮转 ===');
            }
        } catch (error) {
            // 忽略轮转错误
        }
    }

    /**
     * 写入日志到文件
     */
    async writeToFile(message) {
        try {
            const timestamp = new Date().toISOString();
            const logLine = `[${timestamp}] ${message}`;
            
            // 使用echo追加到文件，避免特殊字符问题
            const escapedMessage = logLine.replace(/'/g, "'\"'\"'");
            await exec(`echo '${escapedMessage}' >> "${this.logFile}"`);
            
        } catch (error) {
            // 如果写入失败，回退到console
            console.error('写入日志文件失败:', error);
        }
    }

    /**
     * 记录信息日志
     */
    async info(message, ...args) {
        const fullMessage = this.formatMessage('INFO', message, args);
        
        if (this.isInitialized) {
            await this.writeToFile(fullMessage);
        }
        
        // 同时输出到console（开发时可见）
        console.log(fullMessage);
    }

    /**
     * 记录警告日志
     */
    async warn(message, ...args) {
        const fullMessage = this.formatMessage('WARN', message, args);
        
        if (this.isInitialized) {
            await this.writeToFile(fullMessage);
        }
        
        console.warn(fullMessage);
    }

    /**
     * 记录错误日志
     */
    async error(message, ...args) {
        const fullMessage = this.formatMessage('ERROR', message, args);
        
        if (this.isInitialized) {
            await this.writeToFile(fullMessage);
        }
        
        console.error(fullMessage);
    }

    /**
     * 记录调试日志
     */
    async debug(message, ...args) {
        const fullMessage = this.formatMessage('DEBUG', message, args);
        
        if (this.isInitialized) {
            await this.writeToFile(fullMessage);
        }
        
        console.log(fullMessage);
    }

    /**
     * 格式化日志消息
     */
    formatMessage(level, message, args) {
        let formattedMessage = `[${level}] ${message}`;
        
        if (args && args.length > 0) {
            // 处理额外参数
            const argsStr = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');
            
            formattedMessage += ` ${argsStr}`;
        }
        
        return formattedMessage;
    }

    /**
     * 记录操作日志（用户操作追踪）
     */
    async operation(action, details = {}) {
        const message = `操作: ${action}`;
        const detailsStr = Object.keys(details).length > 0 ? 
            ` 详情: ${JSON.stringify(details)}` : '';
        
        await this.info(message + detailsStr);
    }

    /**
     * 记录性能日志
     */
    async performance(operation, duration) {
        await this.info(`性能: ${operation} 耗时 ${duration}ms`);
    }

    /**
     * 获取日志文件内容（用于调试）
     */
    async getLogContent() {
        try {
            const result = await exec(`cat "${this.logFile}"`);
            return result.errno === 0 ? result.stdout : '';
        } catch (error) {
            await this.error('读取日志文件失败:', error);
            return '';
        }
    }

    /**
     * 清空日志文件
     */
    async clearLog() {
        try {
            await exec(`> "${this.logFile}"`);
            await this.writeToFile('=== 日志已清空 ===');
            await this.info('日志文件已清空');
        } catch (error) {
            await this.error('清空日志文件失败:', error);
        }
    }
}

// 创建全局日志实例
export const logger = new Logger();

// 导出便捷方法
export const log = {
    info: (...args) => {
        logger.info(...args).catch(console.error);
    },
    warn: (...args) => {
        logger.warn(...args).catch(console.error);
    },
    error: (...args) => {
        logger.error(...args).catch(console.error);
    },
    debug: (...args) => {
        logger.debug(...args).catch(console.error);
    },
    operation: (action, details) => {
        logger.operation(action, details).catch(console.error);
    },
    performance: (operation, duration) => {
        logger.performance(operation, duration).catch(console.error);
    }
};
