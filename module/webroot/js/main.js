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

/**
 * 应用主类
 */
class TombstoneEditor {
    constructor() {
        this.isInitialized = false;
        this.configData = null;
        this.hasUnsavedChanges = false;
        
        // 初始化管理器
        this.configManager = new ConfigManager();
        this.fileManager = new FileManager();
        this.uiManager = new UIManager();
        this.xmlParser = new XMLParser();
        this.validationManager = new ValidationManager();
        this.toastManager = new ToastManager();
        this.modalManager = new ModalManager();
        
        // 绑定事件处理器
        this.bindEvents();
    }

    /**
     * 应用初始化
     */
    async init() {
        try {
            console.log('正在初始化ColorOS墓碑配置编辑器...');
            
            // 显示加载状态
            this.uiManager.showLoading('正在初始化应用...');
            
            // 检查KernelSU API可用性
            const apiAvailable = await this.fileManager.checkAPIAvailable();
            if (!apiAvailable) {
                throw new Error('KernelSU API不可用，请确保在KernelSU环境中运行');
            }
            
            // 加载配置文件
            await this.loadConfiguration();

            // 初始化UI
            this.uiManager.initializeUI();

            // 设置配置数据到UI管理器
            this.uiManager.setConfigData(this.configData);
            
            // 隐藏加载状态
            this.uiManager.hideLoading();
            
            this.isInitialized = true;
            this.toastManager.showSuccess('应用初始化成功', '配置文件已加载完成');
            
            console.log('应用初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.uiManager.showError('初始化失败', error.message);
            this.toastManager.showError('初始化失败', error.message);
        }
    }



    /**
     * 加载配置文件
     */
    async loadConfiguration() {
        try {
            this.uiManager.showLoading('正在读取配置文件...');
            
            // 读取配置文件
            const configContent = await this.fileManager.readConfigFile();
            
            // 解析XML
            this.configData = this.xmlParser.parse(configContent);
            
            // 验证配置数据
            const validationResult = this.validationManager.validateConfig(this.configData);
            if (!validationResult.isValid) {
                console.warn('配置文件验证警告:', validationResult.warnings);
                this.toastManager.showWarning('配置文件警告', '发现一些配置项可能存在问题');
            }
            
            // 更新UI状态
            this.updateFileStatus();
            
            console.log('配置文件加载成功');
            
        } catch (error) {
            throw new Error(`配置文件加载失败: ${error.message}`);
        }
    }

    /**
     * 保存配置文件
     */
    async saveConfiguration() {
        try {
            if (!this.configData) {
                throw new Error('没有可保存的配置数据');
            }

            // 显示确认对话框
            const confirmed = await this.modalManager.showConfirm(
                '保存配置',
                '确定要保存当前配置吗？这将覆盖系统中的配置文件。',
                '保存',
                'warning'
            );

            if (!confirmed) {
                return;
            }

            this.uiManager.showLoading('正在保存配置文件...');

            // 验证配置数据
            const validationResult = this.validationManager.validateConfig(this.configData);
            if (!validationResult.isValid && validationResult.errors.length > 0) {
                throw new Error(`配置验证失败: ${validationResult.errors.join(', ')}`);
            }

            // 生成XML内容
            const xmlContent = this.xmlParser.serialize(this.configData);

            // 保存文件
            await this.fileManager.writeConfigFile(xmlContent);

            // 更新状态
            this.hasUnsavedChanges = false;
            this.updateFileStatus();
            this.uiManager.updateUnsavedIndicator(false);

            this.uiManager.hideLoading();
            this.toastManager.showSuccess('保存成功', '配置文件已成功保存到系统');

            console.log('配置文件保存成功');

        } catch (error) {
            this.uiManager.hideLoading();
            console.error('保存配置失败:', error);
            this.toastManager.showError('保存失败', error.message);
        }
    }

    /**
     * 备份配置文件
     */
    async backupConfiguration() {
        try {
            this.uiManager.showLoading('正在创建备份...');
            
            const backupPath = await this.fileManager.createBackup();
            
            this.uiManager.hideLoading();
            this.toastManager.showSuccess('备份成功', `备份文件已保存到: ${backupPath}`);
            
        } catch (error) {
            this.uiManager.hideLoading();
            console.error('备份失败:', error);
            this.toastManager.showError('备份失败', error.message);
        }
    }

    /**
     * 恢复配置文件
     */
    async restoreConfiguration() {
        try {
            // 检查备份文件是否存在
            const backupInfo = await this.fileManager.getBackupInfo();
            if (!backupInfo) {
                this.toastManager.showError('恢复失败', '备份文件不存在，无法恢复配置');
                return;
            }

            // 显示确认对话框
            const confirmed = await this.modalManager.showConfirm(
                '恢复配置',
                `确定要恢复到备份的配置吗？当前的修改将会丢失。\n\n备份文件: ${backupInfo.filename}\n修改时间: ${backupInfo.lastModified}`,
                '恢复',
                'warning'
            );

            if (!confirmed) {
                return;
            }

            this.uiManager.showLoading('正在恢复配置...');

            // 恢复备份
            await this.fileManager.restoreBackup();

            // 重新加载配置
            await this.loadConfiguration();

            // 重新渲染UI
            this.uiManager.renderConfigSections(this.configData);

            this.uiManager.hideLoading();
            this.toastManager.showSuccess('恢复成功', '配置已恢复到备份状态');

        } catch (error) {
            this.uiManager.hideLoading();
            console.error('恢复失败:', error);
            this.toastManager.showError('恢复失败', error.message);
        }
    }

    /**
     * 配置项值变更处理
     */
    onConfigChange(path, value) {
        try {
            // 更新配置数据
            this.configManager.updateValue(this.configData, path, value);
            
            // 标记为有未保存的更改
            this.hasUnsavedChanges = true;
            this.uiManager.updateUnsavedIndicator(true);
            
            console.log(`配置项已更新: ${path} = ${value}`);
            
        } catch (error) {
            console.error('配置更新失败:', error);
            this.toastManager.showError('更新失败', error.message);
        }
    }

    /**
     * 更新文件状态显示
     */
    updateFileStatus() {
        const statusElement = document.getElementById('file-status');
        const lastModifiedElement = document.getElementById('last-modified');
        
        if (statusElement) {
            statusElement.textContent = '配置文件: 已加载';
        }
        
        if (lastModifiedElement) {
            lastModifiedElement.textContent = `最后修改: ${new Date().toLocaleString()}`;
        }
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });

        // 绑定按钮事件
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.id === 'save-btn' || target.closest('#save-btn')) {
                event.preventDefault();
                this.saveConfiguration();
            } else if (target.id === 'backup-btn' || target.closest('#backup-btn')) {
                event.preventDefault();
                this.backupConfiguration();
            } else if (target.id === 'restore-btn' || target.closest('#restore-btn')) {
                event.preventDefault();
                this.restoreConfiguration();
            } else if (target.id === 'retry-btn' || target.closest('#retry-btn')) {
                event.preventDefault();
                this.init();
            }
        });

        // 监听配置变更事件
        document.addEventListener('configChange', (event) => {
            this.onConfigChange(event.detail.path, event.detail.value);
        });

        // 页面卸载前提醒保存
        window.addEventListener('beforeunload', (event) => {
            if (this.hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '您有未保存的更改，确定要离开吗？';
                return event.returnValue;
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 's':
                        event.preventDefault();
                        this.saveConfiguration();
                        break;
                    case 'b':
                        event.preventDefault();
                        this.backupConfiguration();
                        break;
                }
            }
        });
    }
}

// 创建应用实例
const app = new TombstoneEditor();

// 导出应用实例供调试使用
window.tombstoneEditor = app;

console.log('ColorOS墓碑配置编辑器已加载');
