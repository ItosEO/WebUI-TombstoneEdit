/**
 * ColorOS墓碑配置编辑器 - 主入口文件
 * 负责应用初始化、模块加载和全局事件处理
 */

// 导入核心模块
import { ConfigManager } from './modules/config-manager.js';
import { FileManager } from './modules/file-manager.js';
import { UIManager } from './modules/ui-manager.js';
import { XMLParser } from './modules/xml-parser.js';
import { ValidationManager } from './modules/validation-manager.js';
import { ToastManager } from './modules/toast-manager.js';
import { ModalManager } from './modules/modal-manager.js';
import { WhitelistManager } from './modules/whitelist-manager.js';
import { logger, log } from './modules/logger.js';

/**
 * 应用主类
 * 负责协调各个模块的工作
 */
class TombstoneEditor {
    constructor() {
        // 应用状态
        this.isInitialized = false;
        this.hasUnsavedChanges = false;
        this.currentConfig = null;

        // 模块实例
        this.configManager = null;
        this.fileManager = null;
        this.uiManager = null;
        this.xmlParser = null;
        this.validationManager = null;
        this.toastManager = null;
        this.modalManager = null;
        this.whitelistManager = null;
    }

    /**
     * 初始化所有模块
     */
    async initializeModules() {
        try {
            await log.info('开始初始化模块...');

            // 按顺序初始化模块，确保依赖关系正确
            this.toastManager = new ToastManager();
            this.modalManager = new ModalManager();
            this.configManager = new ConfigManager();
            this.fileManager = new FileManager();
            this.uiManager = new UIManager();
            this.xmlParser = new XMLParser();
            this.validationManager = new ValidationManager();
            this.whitelistManager = new WhitelistManager(
                this.configManager,
                this.xmlParser,
                this.toastManager,
                this.modalManager
            );

            // 等待一个事件循环，确保DOM完全准备好
            await new Promise(resolve => setTimeout(resolve, 100));

            await log.info('模块初始化完成');

        } catch (error) {
            await log.error('模块初始化失败:', error);
            throw new Error(`模块初始化失败: ${error.message}`);
        }
    }

    /**
     * 初始化应用
     */
    async initialize() {
        try {
            await log.info('开始初始化 ColorOS 墓碑配置编辑器...');

            // 首先初始化所有模块
            await this.initializeModules();

            // 绑定全局事件
            await this.bindGlobalEvents();

            // 检查运行环境
            await this.checkEnvironment();

            // 初始化UI
            this.uiManager.initializeUI();

            // 设置UI管理器的依赖
            this.uiManager.setDependencies({
                whitelistManager: this.whitelistManager,
                configManager: this.configManager,
                toastManager: this.toastManager,
                modalManager: this.modalManager
            });

            // 加载配置文件
            await this.loadConfiguration();

            // 标记为已初始化
            this.isInitialized = true;

            await log.info('应用初始化完成');
            await log.operation('应用启动', { version: '1.0.0', timestamp: new Date().toISOString() });
            this.toastManager.show('应用初始化完成', 'success');

        } catch (error) {
            await log.error('应用初始化失败:', error);

            // 安全地显示错误
            this.showInitializationError('初始化失败', error.message);
        }
    }

    /**
     * 安全地显示初始化错误
     */
    showInitializationError(title, message) {
        try {
            // 尝试使用UIManager显示错误
            if (this.uiManager && typeof this.uiManager.showError === 'function') {
                this.uiManager.showError(title, message);
                return;
            }
        } catch (e) {
            log.warn('UIManager不可用，使用备用错误显示');
        }

        // 备用方案：直接操作DOM
        try {
            const errorElement = document.getElementById('error-message');
            const titleElement = errorElement?.querySelector('h3');
            const detailsElement = document.getElementById('error-details');

            if (titleElement) titleElement.textContent = title;
            if (detailsElement) detailsElement.textContent = message;
            if (errorElement) errorElement.classList.remove('hidden');

            // 隐藏加载状态
            const loadingElement = document.getElementById('loading');
            if (loadingElement) loadingElement.classList.add('hidden');

        } catch (e) {
            log.error('无法显示错误信息:', e);
            alert(`${title}: ${message}`);
        }
    }

    /**
     * 检查运行环境
     */
    async checkEnvironment() {
        // 检查KernelSU API是否可用
        const apiAvailable = await this.fileManager.checkAPIAvailable();
        if (!apiAvailable) {
            await log.error('KernelSU API不可用');
            throw new Error('KernelSU API不可用，请确保在KernelSU环境中运行');
        }

        await log.info('运行环境检查通过');
    }

    /**
     * 加载配置文件
     */
    async loadConfiguration() {
        try {
            // 显示加载状态
            this.uiManager.showLoading();

            // 读取配置文件
            const xmlContent = await this.fileManager.readConfigFile();

            // 解析XML
            this.currentConfig = this.xmlParser.parse(xmlContent);

            // 设置到ConfigManager中
            this.configManager.setCurrentConfig(this.currentConfig);

            // 验证配置结构
            const validation = this.xmlParser.validateStructure(this.currentConfig);
            if (!validation.isValid) {
                await log.warn('配置文件结构验证失败:', validation.errors);
                this.toastManager.show('配置文件结构有问题，但仍可编辑', 'warning');
            }

            // 更新UI
            this.uiManager.setConfigData(this.currentConfig);
            this.uiManager.renderCurrentSection();

            // 更新文件状态
            const fileInfo = await this.fileManager.getFileInfo();
            this.updateFileStatus(fileInfo);

            // 隐藏加载状态
            this.uiManager.hideLoading();

            await log.info('配置文件加载完成');
            await log.operation('配置文件加载', { fileSize: fileInfo?.size || 0 });

        } catch (error) {
            await log.error('加载配置文件失败:', error);
            this.uiManager.hideLoading();
            throw error;
        }
    }

    /**
     * 保存配置文件
     */
    async saveConfiguration() {
        let loadingToastId = null;
        try {
            if (!this.currentConfig) {
                throw new Error('没有可保存的配置数据');
            }

            // 显示保存状态
            loadingToastId = this.toastManager.show('正在保存配置...', 'loading');

            // 创建备份
            await this.fileManager.createBackup();

            // 序列化配置
            const xmlContent = this.xmlParser.serialize(this.currentConfig);

            // 写入文件
            await this.fileManager.writeConfigFile(xmlContent);

            // 更新状态
            this.hasUnsavedChanges = false;
            this.uiManager.updateUnsavedIndicator(false);

            // 更新文件状态
            const fileInfo = await this.fileManager.getFileInfo();
            this.updateFileStatus(fileInfo);

            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            this.toastManager.show('配置保存成功', 'success');
            await log.info('配置文件保存完成');
            await log.operation('配置保存', { hasChanges: this.hasUnsavedChanges });

        } catch (error) {
            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            await log.error('保存配置文件失败:', error);
            this.toastManager.show(`保存失败: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * 备份配置文件
     */
    async backupConfiguration() {
        let loadingToastId = null;
        try {
            // 显示加载状态
            loadingToastId = this.toastManager.show('正在创建备份...', 'loading');

            const backupPath = await this.fileManager.createBackup();

            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            this.toastManager.show(`备份创建成功: ${backupPath}`, 'success');
            await log.info('配置备份完成:', backupPath);
            await log.operation('创建备份', { backupPath });

        } catch (error) {
            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            await log.error('创建备份失败:', error);
            this.toastManager.show(`备份失败: ${error.message}`, 'error');
        }
    }

    /**
     * 恢复配置文件
     */
    async restoreConfiguration() {
        let loadingToastId = null;
        try {
            // 确认操作
            const confirmed = await this.modalManager.confirm(
                '恢复备份',
                '确定要恢复备份配置吗？当前的修改将会丢失。'
            );

            if (!confirmed) {
                return;
            }

            // 显示加载状态
            loadingToastId = this.toastManager.show('正在恢复备份...', 'loading');

            // 恢复备份
            await this.fileManager.restoreBackup();

            // 重新加载配置
            await this.loadConfiguration();

            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            this.toastManager.show('备份恢复成功', 'success');
            await log.info('配置恢复完成');
            await log.operation('恢复备份');

        } catch (error) {
            // 移除加载状态
            if (loadingToastId) {
                this.toastManager.removeToast(loadingToastId);
            }

            await log.error('恢复备份失败:', error);
            this.toastManager.show(`恢复失败: ${error.message}`, 'error');
        }
    }

    /**
     * 处理配置变更
     */
    async handleConfigChange(path, value) {
        try {
            if (!this.currentConfig) {
                await log.warn('配置数据未加载，忽略变更');
                return;
            }

            // 验证配置值
            const pathParts = path.split('.');
            if (pathParts.length >= 2) {
                const section = pathParts[0];
                const key = pathParts[1];
                const validation = this.configManager.validateValue(section, key, value);

                if (!validation.isValid) {
                    await log.warn('配置验证失败:', validation.error);
                    this.toastManager.show(`配置验证失败: ${validation.error}`, 'error');
                    return;
                }
            }

            // 更新配置
            this.xmlParser.setValueByPath(this.currentConfig, path, value);

            // 标记为有未保存的更改
            this.hasUnsavedChanges = true;
            this.uiManager.updateUnsavedIndicator(true);

            await log.info(`配置已更新: ${path} = ${value}`);
            await log.operation('配置变更', { path, value });

        } catch (error) {
            await log.error('处理配置变更失败:', error);
            this.toastManager.show(`配置更新失败: ${error.message}`, 'error');
        }
    }

    /**
     * 更新文件状态显示
     */
    updateFileStatus(fileInfo) {
        const fileStatusElement = document.getElementById('file-status');
        const lastModifiedElement = document.getElementById('last-modified');

        if (fileStatusElement && fileInfo) {
            fileStatusElement.textContent = `配置文件: 已加载 (${(fileInfo.size / 1024).toFixed(1)} KB)`;
        }

        if (lastModifiedElement && fileInfo) {
            lastModifiedElement.textContent = `最后修改: ${fileInfo.lastModified}`;
        }
    }

    /**
     * 绑定全局事件
     */
    async bindGlobalEvents() {
        // 配置变更事件
        document.addEventListener('configChange', async (event) => {
            const { path, value } = event.detail;
            await this.handleConfigChange(path, value);
        });

        // 保存按钮
        document.getElementById('save-btn')?.addEventListener('click', () => {
            this.saveConfiguration();
        });

        // 备份按钮
        document.getElementById('backup-btn')?.addEventListener('click', () => {
            this.backupConfiguration();
        });

        // 恢复按钮
        document.getElementById('restore-btn')?.addEventListener('click', () => {
            this.restoreConfiguration();
        });

        // 重试按钮
        document.getElementById('retry-btn')?.addEventListener('click', async () => {
            try {
                // 隐藏错误信息
                const errorElement = document.getElementById('error-message');
                if (errorElement) errorElement.classList.add('hidden');

                // 显示加载状态
                const loadingElement = document.getElementById('loading');
                if (loadingElement) loadingElement.classList.remove('hidden');

                // 重新初始化应用
                await this.initialize();

            } catch (error) {
                await log.error('重试失败:', error);
                this.showInitializationError('重试失败', error.message);
            }
        });

        // 页面卸载前检查未保存的更改
        window.addEventListener('beforeunload', (event) => {
            if (this.hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '有未保存的更改，确定要离开吗？';
            }
        });

        await log.info('全局事件绑定完成');
    }
}

// 应用启动
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 创建应用实例
        window.tombstoneEditor = new TombstoneEditor();
        
        // 初始化应用
        await window.tombstoneEditor.initialize();
        
    } catch (error) {
        log.error('应用启动失败:', error);

        // 显示错误信息
        const errorElement = document.getElementById('error-message');
        const errorDetails = document.getElementById('error-details');

        if (errorElement && errorDetails) {
            errorDetails.textContent = error.message;
            errorElement.classList.remove('hidden');
        }

        // 隐藏加载状态
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }
});

// 导出应用类供调试使用
export { TombstoneEditor };
