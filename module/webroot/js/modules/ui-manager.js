/**
 * UI管理器模块
 * 负责用户界面的渲染、更新和交互处理
 */

export class UIManager {
    constructor() {
        this.currentSection = 'basic';
        this.searchTerm = '';
        this.configData = null;
        
        // 绑定事件处理器
        this.bindEvents();
    }

    /**
     * 初始化UI
     */
    initializeUI() {
        this.setupNavigation();
        this.setupSearch();
        this.hideLoading();
    }

    /**
     * 设置导航功能
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
    }

    /**
     * 设置搜索功能
     */
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterConfigItems();
            });
        }
    }

    /**
     * 切换配置节
     * @param {string} section - 配置节名称
     */
    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = section;
        this.renderCurrentSection();
    }

    /**
     * 渲染当前配置节
     */
    renderCurrentSection() {
        if (!this.configData) {
            return;
        }

        const container = document.getElementById('config-container');
        if (!container) {
            return;
        }

        // 根据当前节渲染内容
        switch (this.currentSection) {
            case 'basic':
                this.renderBasicConfig(container);
                break;
            case 'screen':
                this.renderScreenConfig(container);
                break;
            case 'freeze':
                this.renderFreezeConfig(container);
                break;
            case 'proxy':
                this.renderProxyConfig(container);
                break;
            case 'memory':
                this.renderMemoryConfig(container);
                break;
            case 'cpu':
                this.renderCpuConfig(container);
                break;
            case 'special':
                this.renderSpecialConfig(container);
                break;
            case 'whitelist':
                this.renderWhitelistConfig(container);
                break;
            case 'blacklist':
                this.renderBlacklistConfig(container);
                break;
            default:
                container.innerHTML = '<p>未知的配置节</p>';
        }

        container.classList.remove('hidden');
    }

    /**
     * 渲染基础配置
     * @param {Element} container - 容器元素
     */
    renderBasicConfig(container) {
        const enableConfig = this.findConfigElement('enableConfig');
        if (!enableConfig) {
            container.innerHTML = '<p>未找到基础配置数据</p>';
            return;
        }

        const html = `
            <div class="config-section">
                <h2 class="config-section-title">基础开关配置</h2>
                <div class="config-items">
                    ${this.renderConfigItem('enableConfig', 'hansEnable', '启用全局墓碑机制', '控制整个墓碑系统的总开关', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'gmsEnable', 'GMS应用优化', '对Google移动服务(GMS)应用启用优化', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'releaseStatistic', '释放统计信息', '收集并释放统计信息', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'skipToast', '跳过Toast通知', '冻结时跳过Toast通知避免唤醒', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'heatGameCloseNet', '高温游戏断网', '高温时是否关闭游戏网络', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'dozeRestrictSwitch', 'Doze模式限制', '在Doze模式下启用限制开关', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'audioByHook', '音频钩子拦截', '通过钩子拦截音频事件减少唤醒', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'navigationByHook', '导航钩子拦截', '通过钩子拦截导航事件减少唤醒', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'audioCheckEnable', '音频状态检查', '启用音频状态检查', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'proxyWakeLockEnable', 'WakeLock代理', '启用WakeLock代理机制', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'cgp_v2', 'CGP v2', '使用第二代CGP功耗策略', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'hansWatchDogEnable', '墓碑看门狗', '启用墓碑看门狗监控', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'cpnCheckByHook', '组件钩子检查', '通过钩子检查组件状态', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'restoreAlarm', '恢复闹钟', '解冻时恢复闹钟功能', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'uidGoneRemoveAlarm', '卸载移除闹钟', '应用卸载时移除关联闹钟', 'boolean')}
                    ${this.renderConfigItem('enableConfig', 'MStateTrimMemConfig', 'M状态内存压缩', '对M状态应用启用内存压缩', 'boolean')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * 渲染屏幕配置
     * @param {Element} container - 容器元素
     */
    renderScreenConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">屏幕状态策略</h2>
                
                <h3 class="config-subsection-title">熄屏配置</h3>
                <div class="config-items">
                    ${this.renderConfigItem('lcdOffConfig', 'ffTotal', '每次冻结数量', '每次冻结的最大应用数', 'number', '个')}
                    ${this.renderConfigItem('lcdOffConfig', 'ffInterval', '冻结间隔', '冻结尝试间隔时间', 'number', '毫秒')}
                    ${this.renderConfigItem('lcdOffConfig', 'interval', '检查间隔', '常规检查间隔时间', 'number', '毫秒')}
                    ${this.renderConfigItem('lcdOffConfig', 'deepSleepFreezeWhite', '深度睡眠冻结白名单', '深度睡眠时冻结白名单应用', 'boolean')}
                    ${this.renderConfigItem('lcdOffConfig', 'gameCloseNet', '游戏断网', '熄屏时是否关闭游戏网络', 'boolean')}
                    ${this.renderConfigItem('lcdOffConfig', 'idleEnable', '空闲检测', '启用空闲状态检测', 'boolean')}
                </div>
                
                <h3 class="config-subsection-title">亮屏配置</h3>
                <div class="config-items">
                    ${this.renderConfigItem('lcdOnConfig', 'RToM', 'Recent→M延迟', 'Recent状态到M状态的冻结延迟', 'number', '毫秒')}
                    ${this.renderConfigItem('lcdOnConfig', 'MToF', 'M→Frozen延迟', 'M状态到Frozen状态的冻结延迟', 'number', '毫秒')}
                    ${this.renderConfigItem('lcdOnConfig', 'checkImportance', '重要性检查间隔', '应用重要性检查间隔', 'number', '毫秒')}
                    ${this.renderConfigItem('lcdOnConfig', 'gameCloseNet', '游戏断网', '亮屏时是否关闭游戏网络', 'boolean')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * 渲染冻结配置
     * @param {Element} container - 容器元素
     */
    renderFreezeConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">进程冻结规则</h2>
                
                <h3 class="config-subsection-title">快速冻结配置</h3>
                <div class="config-items">
                    ${this.renderConfigItem('ffConfig', 'enable', '启用快速冻结', '是否启用快速冻结功能', 'boolean')}
                    ${this.renderConfigItem('ffConfig', 'enterTimeout', '进入超时', '进入冻结状态的超时时间', 'number', '毫秒')}
                    ${this.renderConfigItem('ffConfig', 'interval', '冻结周期', '快速冻结的执行周期', 'number', '毫秒')}
                    ${this.renderConfigItem('ffConfig', 'maxFzNum', '最大冻结数', '单批次最大冻结应用数量', 'number', '个')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * 渲染其他配置节的占位符
     */
    renderProxyConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">功耗代理机制</h2>
                <div class="config-items">
                    ${this.renderConfigItem('proxyConfig', 'alarm', '代理Alarm广播', '是否代理 AlarmManager 广播', 'boolean')}
                    ${this.renderConfigItem('proxyConfig', 'service', '代理Service广播', '是否代理 Service 广播', 'boolean')}
                    ${this.renderConfigItem('proxyConfig', 'job', '代理JobScheduler事件', '是否代理 JobScheduler 事件', 'boolean')}
                    ${this.renderConfigItem('proxyConfig', 'broadcast', '代理常规广播', '是否代理普通广播', 'boolean')}
                    ${this.renderConfigItem('proxyConfig', 'proxyBCmax', '最大代理广播数', '允许代理的最大广播数', 'number', '条')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    renderMemoryConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">内存优化</h2>
                <div class="config-items">
                    ${this.renderConfigItem('superFreezeConfig', 'enable', '启用Super Freeze', '是否启用 Super Freeze 机制', 'boolean')}
                </div>
                <p class="config-item-description">⚠️ 复杂子项(如 trimMemUFZConfig) 暂未支持图形化编辑，可在 XML 模式下手动修改。</p>
            </div>
        `;
        container.innerHTML = html;
    }

    renderCpuConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">CPU管控</h2>
                <div class="config-items">
                    ${this.renderConfigItem('cpuCtlRus', 'shortCommCpuRateCtl', '短期通信CPU阈值', '短期通信CPU使用率阈值(%)', 'number', '%')}
                    ${this.renderConfigItem('cpuCtlRus', 'longCommCpuRateCtl', '长期通信CPU阈值', '长期通信CPU使用率阈值(%)', 'number', '%')}
                    ${this.renderConfigItem('cpuCtlRus', 'shortSysCpuRateCtl', '短期系统CPU阈值', '短期系统CPU使用率阈值(% * 核心数)', 'number', '%')}
                    ${this.renderConfigItem('cpuCtlRus', 'collectCpuInfoCycle', 'CPU信息收集周期', 'CPU信息收集周期(毫秒)', 'number', '毫秒')}
                    ${this.renderConfigItem('cpuCtlRus', 'cpuCollectEnable', '启用CPU信息收集', '是否启用CPU信息收集', 'boolean')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    renderSpecialConfig(container) {
        const html = `
            <div class="config-section">
                <h2 class="config-section-title">特殊场景规则</h2>

                <h3 class="config-subsection-title">游戏网络限制</h3>
                <div class="config-items">
                    ${this.renderConfigItem('restrictNet', 'appTypeValue', '应用类型值', '4 表示游戏应用', 'number')}
                    ${this.renderConfigItem('restrictNet', 'delayTime', '限制延迟', '延迟执行限制的时间', 'number', '毫秒')}
                </div>

                <h3 class="config-subsection-title">高温模式</h3>
                <div class="config-items">
                    ${this.renderConfigItem('thermalMode', 'enable', '启用高温模式', '是否启用高温模式策略', 'boolean')}
                    ${this.renderConfigItem('thermalMode', 'enterLevel', '进入温度等级', '达到该温度等级时进入高温模式', 'number')}
                    ${this.renderConfigItem('thermalMode', 'exitLevel', '退出温度等级', '降至该温度等级时退出高温模式', 'number')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    renderWhitelistConfig(container) {
        container.innerHTML = '<div class="config-section"><h2>白名单管理</h2><p>此功能正在开发中...</p></div>';
    }

    renderBlacklistConfig(container) {
        container.innerHTML = '<div class="config-section"><h2>黑名单管理</h2><p>此功能正在开发中...</p></div>';
    }

    /**
     * 渲染单个配置项
     * @param {string} section - 配置节
     * @param {string} key - 配置键
     * @param {string} title - 标题
     * @param {string} description - 描述
     * @param {string} type - 类型
     * @param {string} unit - 单位
     * @returns {string} HTML字符串
     */
    renderConfigItem(section, key, title, description, type, unit = '') {
        const value = this.getConfigValue(section, key);
        const path = `${section}.${key}`;
        
        let controlHtml = '';
        
        switch (type) {
            case 'boolean':
                controlHtml = `
                    <div class="switch-container">
                        <div class="switch">
                            <input type="checkbox" id="${path}" ${value === 'true' ? 'checked' : ''} 
                                   onchange="handleConfigChange('${path}', this.checked ? 'true' : 'false')">
                            <span class="switch-slider"></span>
                        </div>
                    </div>
                `;
                break;
                
            case 'number':
                controlHtml = `
                    <div class="number-input-container">
                        <input type="number" class="form-input number-input" id="${path}" 
                               value="${value || ''}" 
                               onchange="handleConfigChange('${path}', this.value)">
                        ${unit ? `<span class="number-unit">${unit}</span>` : ''}
                    </div>
                `;
                break;
                
            case 'string':
                controlHtml = `
                    <input type="text" class="form-input" id="${path}" 
                           value="${value || ''}" 
                           onchange="handleConfigChange('${path}', this.value)">
                `;
                break;
        }
        
        return `
            <div class="config-item" data-search="${title.toLowerCase()} ${description.toLowerCase()}">
                <div class="config-item-info">
                    <div class="config-item-title">${title}</div>
                    <div class="config-item-description">${description}</div>
                </div>
                <div class="config-item-control">
                    ${controlHtml}
                </div>
            </div>
        `;
    }

    /**
     * 获取配置值
     * @param {string} section - 配置节
     * @param {string} key - 配置键
     * @returns {string} 配置值
     */
    getConfigValue(section, key) {
        if (!this.configData) {
            return '';
        }

        const sectionElement = this.findConfigElement(section);
        if (sectionElement && sectionElement.attributes) {
            return sectionElement.attributes[key] || '';
        }
        
        return '';
    }

    /**
     * 查找配置元素
     * @param {string} tagName - 标签名
     * @returns {Object|null} 配置元素
     */
    findConfigElement(tagName) {
        if (!this.configData || !this.configData.children) {
            return null;
        }

        return this.configData.children.find(child => child.tagName === tagName) || null;
    }

    /**
     * 过滤配置项
     */
    filterConfigItems() {
        const items = document.querySelectorAll('.config-item');
        items.forEach(item => {
            const searchData = item.dataset.search || '';
            const isVisible = searchData.includes(this.searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }

    /**
     * 设置配置数据
     * @param {Object} configData - 配置数据
     */
    setConfigData(configData) {
        this.configData = configData;
        this.renderCurrentSection();
    }

    /**
     * 与旧代码兼容的包装函数
     * @param {Object} configData - 配置数据
     */
    renderConfigSections(configData) {
        // 直接复用现有逻辑
        this.setConfigData(configData);
    }

    /**
     * 显示加载状态
     * @param {string} message - 加载消息
     */
    showLoading(message = '正在加载...') {
        const loading = document.getElementById('loading');
        const loadingText = loading.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loading.classList.remove('hidden');
        
        document.getElementById('config-container').classList.add('hidden');
        document.getElementById('error-message').classList.add('hidden');
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    /**
     * 显示错误信息
     * @param {string} title - 错误标题
     * @param {string} message - 错误消息
     */
    showError(title, message) {
        const errorElement = document.getElementById('error-message');
        const titleElement = errorElement.querySelector('h3');
        const detailsElement = document.getElementById('error-details');
        
        if (titleElement) titleElement.textContent = title;
        if (detailsElement) detailsElement.textContent = message;
        
        errorElement.classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('config-container').classList.add('hidden');
    }

    /**
     * 更新未保存更改指示器
     * @param {boolean} hasChanges - 是否有未保存的更改
     */
    updateUnsavedIndicator(hasChanges) {
        const indicator = document.getElementById('unsaved-changes');
        if (indicator) {
            if (hasChanges) {
                indicator.classList.remove('hidden');
            } else {
                indicator.classList.add('hidden');
            }
        }
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        // 全局配置变更处理函数
        window.handleConfigChange = (path, value) => {
            const event = new CustomEvent('configChange', {
                detail: { path, value }
            });
            document.dispatchEvent(event);
        };
    }
}
