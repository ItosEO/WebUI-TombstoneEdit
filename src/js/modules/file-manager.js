/**
 * 文件管理器模块
 * 负责配置文件的读写、备份和恢复操作
 */

import { exec } from 'kernelsu';
import { log } from './logger.js';

export class FileManager {
    constructor() {
        // 配置文件路径
        this.configPath = '/data/oplus/os/bpm/sys_elsa_config_list.xml';
        this.backupPath = '/data/local/tmp/sys_elsa_config_list.xml.bak';
        this.tempDir = '/data/local/tmp/tombstone_temp';

        // 确保临时目录存在
        this.initializeDirectories();
    }

    /**
     * 初始化必要的目录
     */
    async initializeDirectories() {
        try {
            // 创建临时目录
            await exec(`mkdir -p "${this.tempDir}"`);

            // 设置目录权限
            await exec(`chmod 755 "${this.tempDir}"`);

            await log.info('目录初始化完成');
        } catch (error) {
            await log.warn('目录初始化警告:', error.message);
        }
    }

    /**
     * 检查KernelSU API是否可用
     * @returns {boolean} API是否可用
     */
    async checkAPIAvailable() {
        try {
            // 简单测试exec函数是否可用
            const result = await exec('echo "test"');
            return result.errno === 0;
        } catch (error) {
            await log.error('KernelSU API检查失败:', error);
            return false;
        }
    }

    /**
     * 检查配置文件是否存在
     * @returns {boolean} 文件是否存在
     */
    async checkConfigFileExists() {
        try {
            const result = await exec(`test -f "${this.configPath}"`);
            return result.errno === 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * 读取配置文件内容
     * @returns {string} 文件内容
     */
    async readConfigFile() {
        try {
            // 检查文件是否存在
            const exists = await this.checkConfigFileExists();
            if (!exists) {
                throw new Error(`配置文件不存在: ${this.configPath}`);
            }

            // 读取文件内容
            const result = await exec(`cat "${this.configPath}"`);

            if (result.errno !== 0) {
                throw new Error(`读取文件失败: ${result.stderr || '未知错误'}`);
            }

            if (!result.stdout || result.stdout.trim().length === 0) {
                throw new Error('配置文件为空');
            }

            await log.info('配置文件读取成功');
            return result.stdout;

        } catch (error) {
            await log.error('读取配置文件失败:', error);
            throw new Error(`读取配置文件失败: ${error.message}`);
        }
    }

    /**
     * 写入配置文件
     * @param {string} content - 文件内容
     */
    async writeConfigFile(content) {
        try {
            if (!content || content.trim().length === 0) {
                throw new Error('配置内容不能为空');
            }

            // 创建临时文件
            const tempFile = `${this.tempDir}/config_temp_${Date.now()}.xml`;

            // 写入临时文件 - 使用echo和重定向
            const escapedContent = content.replace(/'/g, "'\"'\"'");
            const writeResult = await exec(`echo '${escapedContent}' > "${tempFile}"`);
            if (writeResult.errno !== 0) {
                throw new Error(`写入临时文件失败: ${writeResult.stderr}`);
            }

            // 验证临时文件
            const verifyResult = await exec(`test -f "${tempFile}" && test -s "${tempFile}"`);
            if (verifyResult.errno !== 0) {
                throw new Error('临时文件验证失败');
            }

            // 复制临时文件到目标位置
            const copyResult = await exec(`cp "${tempFile}" "${this.configPath}"`);
            if (copyResult.errno !== 0) {
                throw new Error(`复制文件失败: ${copyResult.stderr}`);
            }

            // 设置文件权限
            await exec(`chmod 644 "${this.configPath}"`);
            await exec(`chown system:system "${this.configPath}"`);

            // 清理临时文件
            await exec(`rm -f "${tempFile}"`);

            await log.info('配置文件写入成功');

        } catch (error) {
            await log.error('写入配置文件失败:', error);
            throw new Error(`写入配置文件失败: ${error.message}`);
        }
    }

    /**
     * 创建配置文件备份
     * @returns {string} 备份文件路径
     */
    async createBackup() {
        try {
            // 检查原文件是否存在
            const exists = await this.checkConfigFileExists();
            if (!exists) {
                throw new Error('原配置文件不存在，无法创建备份');
            }

            // 复制文件到固定备份路径
            const copyResult = await exec(`cp "${this.configPath}" "${this.backupPath}"`);
            if (copyResult.errno !== 0) {
                throw new Error(`创建备份失败: ${copyResult.stderr}`);
            }

            // 设置备份文件权限
            await exec(`chmod 644 "${this.backupPath}"`);

            await log.info(`备份创建成功: ${this.backupPath}`);
            return this.backupPath;

        } catch (error) {
            await log.error('创建备份失败:', error);
            throw new Error(`创建备份失败: ${error.message}`);
        }
    }

    /**
     * 检查备份文件是否存在
     * @returns {boolean} 备份文件是否存在
     */
    async checkBackupExists() {
        try {
            const result = await exec(`test -f "${this.backupPath}"`);
            return result.errno === 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取备份文件信息
     * @returns {Object|null} 备份文件信息
     */
    async getBackupInfo() {
        try {
            const exists = await this.checkBackupExists();
            if (!exists) {
                return null;
            }

            const result = await exec(`stat "${this.backupPath}"`);
            if (result.errno !== 0) {
                return null;
            }

            // 解析stat输出
            const statOutput = result.stdout;
            const sizeMatch = statOutput.match(/Size:\s+(\d+)/);
            const modifyMatch = statOutput.match(/Modify:\s+([^\n]+)/);

            return {
                path: this.backupPath,
                filename: 'sys_elsa_config_list.xml.bak',
                size: sizeMatch ? parseInt(sizeMatch[1]) : 0,
                lastModified: modifyMatch ? modifyMatch[1].trim() : 'Unknown',
                exists: true
            };

        } catch (error) {
            await log.error('获取备份信息失败:', error);
            return null;
        }
    }

    /**
     * 恢复备份文件
     */
    async restoreBackup() {
        try {
            // 检查备份文件是否存在
            const exists = await this.checkBackupExists();
            if (!exists) {
                throw new Error('备份文件不存在');
            }

            // 验证备份文件内容
            const validateResult = await exec(`head -1 "${this.backupPath}"`);
            if (validateResult.errno !== 0 || !validateResult.stdout.includes('<?xml')) {
                throw new Error('备份文件格式无效');
            }

            // 恢复文件
            const restoreResult = await exec(`cp "${this.backupPath}" "${this.configPath}"`);
            if (restoreResult.errno !== 0) {
                throw new Error(`恢复文件失败: ${restoreResult.stderr}`);
            }

            // 设置文件权限
            await exec(`chmod 644 "${this.configPath}"`);
            await exec(`chown system:system "${this.configPath}"`);

            await log.info(`配置文件已恢复: ${this.backupPath}`);

        } catch (error) {
            await log.error('恢复备份失败:', error);
            throw new Error(`恢复备份失败: ${error.message}`);
        }
    }

    /**
     * 删除备份文件
     */
    async deleteBackup() {
        try {
            const exists = await this.checkBackupExists();
            if (!exists) {
                await log.info('备份文件不存在，无需删除');
                return;
            }

            await exec(`rm -f "${this.backupPath}"`);
            await log.info('备份文件已删除');

        } catch (error) {
            await log.warn('删除备份文件时出现警告:', error.message);
        }
    }

    /**
     * 获取文件信息
     * @returns {Object} 文件信息
     */
    async getFileInfo() {
        try {
            const exists = await this.checkConfigFileExists();
            if (!exists) {
                return null;
            }

            const result = await exec(`stat "${this.configPath}"`);
            if (result.errno !== 0) {
                throw new Error('获取文件信息失败');
            }

            // 解析stat输出
            const statOutput = result.stdout;
            const sizeMatch = statOutput.match(/Size:\s+(\d+)/);
            const modifyMatch = statOutput.match(/Modify:\s+([^\n]+)/);

            return {
                path: this.configPath,
                size: sizeMatch ? parseInt(sizeMatch[1]) : 0,
                lastModified: modifyMatch ? modifyMatch[1].trim() : 'Unknown',
                exists: true
            };

        } catch (error) {
            await log.error('获取文件信息失败:', error);
            return null;
        }
    }

    /**
     * 验证文件完整性
     * @param {string} filePath - 文件路径
     * @returns {boolean} 文件是否完整
     */
    async validateFileIntegrity(filePath = null) {
        try {
            const targetPath = filePath || this.configPath;
            
            // 检查文件是否存在且不为空
            const result = await exec(`test -f "${targetPath}" && test -s "${targetPath}"`);
            if (result.errno !== 0) {
                return false;
            }

            // 检查是否为有效的XML文件
            const xmlCheck = await exec(`head -1 "${targetPath}"`);
            if (xmlCheck.errno !== 0 || !xmlCheck.stdout.includes('<?xml')) {
                return false;
            }

            return true;

        } catch (error) {
            await log.error('文件完整性验证失败:', error);
            return false;
        }
    }
}
