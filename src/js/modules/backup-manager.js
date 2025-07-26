/**
 * 备份管理器模块
 * 负责备份文件的管理、展示和操作
 */

import { log } from './logger.js';

export class BackupManager {
    constructor(fileManager, modalManager, toastManager) {
        this.fileManager = fileManager;
        this.modalManager = modalManager;
        this.toastManager = toastManager;
        this.backups = [];
        this.isLoading = false;
    }

    /**
     * 加载备份列表
     */
    async loadBackupList() {
        try {
            this.isLoading = true;
            this.backups = await this.fileManager.getBackupList();
            log.info(`加载了 ${this.backups.length} 个备份文件`);
            return this.backups;
        } catch (error) {
            log.error('加载备份列表失败:', error);
            this.toastManager.showError('加载失败', '无法加载备份文件列表');
            return [];
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 创建新备份
     * @param {string} description - 备份描述
     */
    async createBackup(description = '') {
        try {
            const loadingToast = this.toastManager.showLoading('正在创建备份...');
            
            const backupPath = await this.fileManager.createBackup();
            
            // 如果有描述，保存到备份元数据
            if (description) {
                await this.saveBackupMetadata(backupPath, { description });
            }
            
            // 重新加载备份列表
            await this.loadBackupList();
            
            this.toastManager.removeToast(loadingToast);
            this.toastManager.showSuccess('备份成功', `备份文件已创建: ${backupPath}`);
            
            return backupPath;
        } catch (error) {
            log.error('创建备份失败:', error);
            this.toastManager.showError('备份失败', error.message);
            throw error;
        }
    }

    /**
     * 恢复备份
     * @param {string} backupPath - 备份文件路径
     */
    async restoreBackup(backupPath) {
        try {
            const confirmed = await this.modalManager.showWarning(
                '恢复备份',
                `确定要恢复备份文件吗？\n\n文件: ${backupPath}\n\n当前配置将被覆盖，此操作无法撤销。`,
                '恢复'
            );

            if (!confirmed) {
                return false;
            }

            const loadingToast = this.toastManager.showLoading('正在恢复备份...');
            
            await this.fileManager.restoreBackup(backupPath);
            
            this.toastManager.removeToast(loadingToast);
            this.toastManager.showSuccess('恢复成功', '配置文件已恢复到备份状态');
            
            return true;
        } catch (error) {
            log.error('恢复备份失败:', error);
            this.toastManager.showError('恢复失败', error.message);
            return false;
        }
    }

    /**
     * 删除备份
     * @param {string} backupPath - 备份文件路径
     */
    async deleteBackup(backupPath) {
        try {
            const confirmed = await this.modalManager.showDanger(
                '删除备份',
                `确定要删除此备份文件吗？\n\n文件: ${backupPath}\n\n此操作无法撤销。`,
                '删除'
            );

            if (!confirmed) {
                return false;
            }

            const loadingToast = this.toastManager.showLoading('正在删除备份...');
            
            await this.fileManager.removeFile(backupPath);
            
            // 删除元数据文件
            const metadataPath = backupPath + '.meta';
            try {
                await this.fileManager.removeFile(metadataPath);
            } catch (metaError) {
                // 忽略元数据删除错误
                log.warn('删除备份元数据失败:', metaError.message);
            }
            
            // 重新加载备份列表
            await this.loadBackupList();
            
            this.toastManager.removeToast(loadingToast);
            this.toastManager.showSuccess('删除成功', '备份文件已删除');
            
            return true;
        } catch (error) {
            log.error('删除备份失败:', error);
            this.toastManager.showError('删除失败', error.message);
            return false;
        }
    }

    /**
     * 保存备份元数据
     * @param {string} backupPath - 备份文件路径
     * @param {Object} metadata - 元数据
     */
    async saveBackupMetadata(backupPath, metadata) {
        try {
            const metadataPath = backupPath + '.meta';
            const metadataContent = JSON.stringify({
                ...metadata,
                createdAt: new Date().toISOString(),
                backupPath: backupPath
            }, null, 2);
            
            await this.fileManager.writeFile(metadataPath, metadataContent);
        } catch (error) {
            log.warn('保存备份元数据失败:', error.message);
        }
    }

    /**
     * 加载备份元数据
     * @param {string} backupPath - 备份文件路径
     * @returns {Object|null} 元数据对象
     */
    async loadBackupMetadata(backupPath) {
        try {
            const metadataPath = backupPath + '.meta';
            const exists = await this.fileManager.fileExists(metadataPath);
            
            if (!exists) {
                return null;
            }
            
            const content = await this.fileManager.readFile(metadataPath);
            return JSON.parse(content);
        } catch (error) {
            log.warn('加载备份元数据失败:', error.message);
            return null;
        }
    }

    /**
     * 获取备份文件信息
     * @param {string} backupPath - 备份文件路径
     * @returns {Object} 备份信息
     */
    async getBackupInfo(backupPath) {
        try {
            const stat = await this.fileManager.getFileInfo(backupPath);
            const metadata = await this.loadBackupMetadata(backupPath);
            
            return {
                path: backupPath,
                filename: backupPath.split('/').pop(),
                size: stat ? stat.size : 0,
                lastModified: stat ? stat.lastModified : 'Unknown',
                description: metadata ? metadata.description : '',
                createdAt: metadata ? metadata.createdAt : null,
                isValid: await this.validateBackup(backupPath)
            };
        } catch (error) {
            log.error('获取备份信息失败:', error);
            return null;
        }
    }

    /**
     * 验证备份文件
     * @param {string} backupPath - 备份文件路径
     * @returns {boolean} 是否有效
     */
    async validateBackup(backupPath) {
        try {
            const content = await this.fileManager.readFile(backupPath);
            
            // 检查是否为有效的XML文件
            if (!content.includes('<?xml') || !content.includes('<filter-conf>')) {
                return false;
            }
            
            // 检查文件大小
            if (content.length < 100) {
                return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 清理旧备份
     * @param {number} keepCount - 保留数量
     */
    async cleanOldBackups(keepCount = 10) {
        try {
            await this.loadBackupList();
            
            if (this.backups.length <= keepCount) {
                return;
            }

            const toDelete = this.backups.slice(keepCount);
            let deletedCount = 0;

            for (const backup of toDelete) {
                try {
                    await this.fileManager.removeFile(backup.path);
                    
                    // 删除元数据文件
                    const metadataPath = backup.path + '.meta';
                    try {
                        await this.fileManager.removeFile(metadataPath);
                    } catch (metaError) {
                        // 忽略元数据删除错误
                    }
                    
                    deletedCount++;
                } catch (deleteError) {
                    log.warn(`删除备份失败: ${backup.path}`, deleteError.message);
                }
            }

            if (deletedCount > 0) {
                await this.loadBackupList();
                this.toastManager.showInfo('清理完成', `已删除 ${deletedCount} 个旧备份文件`);
            }

        } catch (error) {
            log.error('清理旧备份失败:', error);
            this.toastManager.showError('清理失败', error.message);
        }
    }

    /**
     * 导出备份列表
     * @returns {string} JSON格式的备份列表
     */
    async exportBackupList() {
        try {
            await this.loadBackupList();
            
            const backupList = [];
            for (const backup of this.backups) {
                const info = await this.getBackupInfo(backup.path);
                if (info) {
                    backupList.push(info);
                }
            }
            
            return JSON.stringify(backupList, null, 2);
        } catch (error) {
            log.error('导出备份列表失败:', error);
            throw error;
        }
    }

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 格式化时间
     * @param {string} timestamp - 时间戳
     * @returns {string} 格式化后的时间
     */
    formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return timestamp;
        }
    }
}
