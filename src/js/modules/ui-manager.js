/**
 * UI管理器模块
 * 负责用户界面的渲染、更新和交互处理
 */

import { log } from './logger.js';

export class UIManager {
    constructor() {
        this.currentSection = 'basic';
        this.searchTerm = '';
        this.configData = null;

        // 依赖注入
        this.whitelistManager = null;
        this.configManager = null;
        this.toastManager = null;
        this.modalManager = null;

        // 绑定事件处理器
        this.bindEvents();
    }

    /**
     * 设置依赖项
     * @param {Object} dependencies - 依赖对象
     */
    setDependencies(dependencies) {
        this.whitelistManager = dependencies.whitelistManager;
        this.configManager = dependencies.configManager;
        this.toastManager = dependencies.toastManager;
        this.modalManager = dependencies.modalManager;
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

                <!-- 广播代理配置 -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">广播代理配置</h3>
                    <div class="config-items">
                        ${this.renderConfigItem('proxyConfig', 'alarm', '代理Alarm广播', '是否代理 AlarmManager 广播', 'boolean')}
                        ${this.renderConfigItem('proxyConfig', 'service', '代理Service广播', '是否代理 Service 广播', 'boolean')}
                        ${this.renderConfigItem('proxyConfig', 'job', '代理JobScheduler事件', '是否代理 JobScheduler 事件', 'boolean')}
                        ${this.renderConfigItem('proxyConfig', 'broadcast', '代理常规广播', '是否代理普通广播', 'boolean')}
                        ${this.renderConfigItem('proxyConfig', 'proxyBCmax', '最大代理广播数', '允许代理的最大广播数', 'number', '条')}
                    </div>
                </div>

                <!-- WakeLock代理配置 -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">WakeLock代理配置</h3>
                    <div class="config-items">
                        <div class="config-item">
                            <div class="config-item-info">
                                <div class="config-item-title">WakeLock代理规则</div>
                                <div class="config-item-description">配置WakeLock的代理规则，支持按标签和包名过滤</div>
                            </div>
                            <div class="config-item-control">
                                <button class="btn btn-secondary" onclick="uiManager.showWakeLockEditor()">
                                    <span class="icon">⚙️</span>
                                    配置规则
                                </button>
                            </div>
                        </div>
                        ${this.renderWakeLockRules()}
                    </div>
                </div>

                <!-- GPS代理配置 -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">GPS代理配置</h3>
                    <div class="config-items">
                        <div class="config-item">
                            <div class="config-item-info">
                                <div class="config-item-title">GPS代理规则</div>
                                <div class="config-item-description">配置GPS位置服务的代理规则，支持应用类型和使用时间过滤</div>
                            </div>
                            <div class="config-item-control">
                                <button class="btn btn-secondary" onclick="uiManager.showGpsEditor()">
                                    <span class="icon">📍</span>
                                    配置规则
                                </button>
                            </div>
                        </div>
                        ${this.renderGpsRules()}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * 渲染WakeLock代理规则
     * @returns {string} HTML字符串
     */
    renderWakeLockRules() {
        const proxyWL = this.findConfigElement('proxyWL');
        if (!proxyWL || !proxyWL.children) {
            return '<div class="config-item-description">暂无WakeLock代理规则</div>';
        }

        let rulesHtml = '';
        proxyWL.children.forEach((rule, index) => {
            if (rule.tagName === 'wakelock') {
                const type = rule.attributes.type || '';
                const tag = rule.attributes.tag || '';
                const pkg = rule.attributes.pkg || '';
                const proxy = rule.attributes.proxy || '';
                const enable = rule.attributes.enable || 'true';

                rulesHtml += `
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">规则 ${index + 1}: ${type}</div>
                            <div class="rule-details">
                                <span class="rule-tag">标签: ${tag}</span>
                                <span class="rule-pkg">包名: ${pkg}</span>
                                <span class="rule-proxy">代理级别: ${proxy}</span>
                                <span class="rule-status ${enable === 'true' ? 'enabled' : 'disabled'}">
                                    ${enable === 'true' ? '启用' : '禁用'}
                                </span>
                            </div>
                        </div>
                        <div class="rule-actions">
                            <button class="btn btn-sm btn-secondary" onclick="uiManager.editWakeLockRule(${index})">编辑</button>
                            <button class="btn btn-sm btn-danger" onclick="uiManager.deleteWakeLockRule(${index})">删除</button>
                        </div>
                    </div>
                `;
            }
        });

        return rulesHtml || '<div class="config-item-description">暂无WakeLock代理规则</div>';
    }

    /**
     * 渲染GPS代理规则
     * @returns {string} HTML字符串
     */
    renderGpsRules() {
        const proxyGps = this.findConfigElement('proxyGps');
        if (!proxyGps || !proxyGps.children) {
            return '<div class="config-item-description">暂无GPS代理规则</div>';
        }

        let rulesHtml = '';
        proxyGps.children.forEach((rule, index) => {
            if (rule.tagName === 'item') {
                const type = rule.attributes.type || '';
                const appType = rule.attributes.appType || '';
                const recentUse = rule.attributes.recentUse || '';
                const stillInterval = rule.attributes.stillInterval || '';

                rulesHtml += `
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">规则 ${index + 1}: ${type}</div>
                            <div class="rule-details">
                                <span class="rule-tag">应用类型: ${appType}</span>
                                <span class="rule-pkg">最近使用: ${recentUse}分钟</span>
                                <span class="rule-proxy">静止间隔: ${stillInterval}分钟</span>
                            </div>
                        </div>
                        <div class="rule-actions">
                            <button class="btn btn-sm btn-secondary" onclick="uiManager.editGpsRule(${index})">编辑</button>
                            <button class="btn btn-sm btn-danger" onclick="uiManager.deleteGpsRule(${index})">删除</button>
                        </div>
                    </div>
                `;
            }
        });

        return rulesHtml || '<div class="config-item-description">暂无GPS代理规则</div>';
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
        if (!this.whitelistManager) {
            container.innerHTML = '<div class="config-section"><h2>白名单管理</h2><p>白名单管理器未初始化</p></div>';
            return;
        }

        const html = `
            <div class="config-section">
                <div class="section-header">
                    <h2>白名单管理</h2>
                    <p>管理各种类型的白名单配置，控制应用的特殊权限和行为</p>
                </div>

                <!-- 列表类型选择 -->
                <div class="whitelist-controls">
                    <div class="control-group">
                        <label for="whitelist-type">列表类型:</label>
                        <select id="whitelist-type" class="form-control">
                            <option value="">请选择列表类型</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <button id="add-whitelist-item" class="btn btn-primary" disabled>
                            <i class="icon-plus"></i> 添加项目
                        </button>
                    </div>
                </div>

                <!-- 列表内容 -->
                <div id="whitelist-content" class="whitelist-content">
                    <div class="empty-state">
                        <p>请选择一个列表类型来查看和管理项目</p>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.initializeWhitelistControls();
    }

    renderBlacklistConfig(container) {
        if (!this.whitelistManager) {
            container.innerHTML = '<div class="config-section"><h2>黑名单管理</h2><p>白名单管理器未初始化</p></div>';
            return;
        }

        const html = `
            <div class="config-section">
                <div class="section-header">
                    <h2>黑名单管理</h2>
                    <p>管理各种类型的黑名单配置，控制应用的限制和禁用行为</p>
                </div>

                <!-- 列表类型选择 -->
                <div class="blacklist-controls">
                    <div class="control-group">
                        <label for="blacklist-type">列表类型:</label>
                        <select id="blacklist-type" class="form-control">
                            <option value="">请选择列表类型</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <button id="add-blacklist-item" class="btn btn-primary" disabled>
                            <i class="icon-plus"></i> 添加项目
                        </button>
                    </div>
                </div>

                <!-- 列表内容 -->
                <div id="blacklist-content" class="blacklist-content">
                    <div class="empty-state">
                        <p>请选择一个列表类型来查看和管理项目</p>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.initializeBlacklistControls();
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

    /**
     * 显示WakeLock规则编辑器
     */
    showWakeLockEditor() {
        const modalHtml = `
            <div class="modal-overlay" id="wakelock-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>WakeLock代理规则编辑</h3>
                        <button class="modal-close" onclick="uiManager.closeModal('wakelock-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="wakelock-form">
                            <div class="form-group">
                                <label for="wl-type">规则类型</label>
                                <select id="wl-type" class="form-input">
                                    <option value="proxy">代理</option>
                                    <option value="block">阻止</option>
                                    <option value="allow">允许</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="wl-tag">WakeLock标签</label>
                                <input type="text" id="wl-tag" class="form-input" placeholder="如: *job.deadline*" />
                                <small class="form-help">支持通配符 * 匹配</small>
                            </div>
                            <div class="form-group">
                                <label for="wl-pkg">包名</label>
                                <input type="text" id="wl-pkg" class="form-input" placeholder="如: com.example.app 或 * 表示所有" />
                                <small class="form-help">支持通配符 * 匹配所有应用</small>
                            </div>
                            <div class="form-group">
                                <label for="wl-proxy">代理级别</label>
                                <select id="wl-proxy" class="form-input">
                                    <option value="1">1 - 轻度代理</option>
                                    <option value="2">2 - 中度代理</option>
                                    <option value="3">3 - 重度代理</option>
                                    <option value="4">4 - 限制性代理</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="wl-enable" checked />
                                    <span class="checkbox-text">启用此规则</span>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="uiManager.closeModal('wakelock-modal')">取消</button>
                        <button class="btn btn-primary" onclick="uiManager.saveWakeLockRule()">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    /**
     * 显示GPS规则编辑器
     */
    showGpsEditor() {
        const modalHtml = `
            <div class="modal-overlay" id="gps-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>GPS代理规则编辑</h3>
                        <button class="modal-close" onclick="uiManager.closeModal('gps-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="gps-form">
                            <div class="form-group">
                                <label for="gps-type">规则类型</label>
                                <select id="gps-type" class="form-input">
                                    <option value="white">白名单</option>
                                    <option value="black">黑名单</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="gps-apptype">应用类型</label>
                                <select id="gps-apptype" class="form-input">
                                    <option value="4">4 - 游戏应用</option>
                                    <option value="7">7 - 即时通讯应用</option>
                                    <option value="11">11 - 导航应用</option>
                                    <option value="0">0 - 其他应用</option>
                                </select>
                                <small class="form-help">选择要应用此规则的应用类型</small>
                            </div>
                            <div class="form-group">
                                <label for="gps-recent">最近使用时间</label>
                                <input type="number" id="gps-recent" class="form-input" placeholder="5" min="0" />
                                <small class="form-help">最近使用多少分钟内不代理GPS</small>
                            </div>
                            <div class="form-group">
                                <label for="gps-interval">静止状态间隔</label>
                                <input type="number" id="gps-interval" class="form-input" placeholder="10" min="0" />
                                <small class="form-help">设备静止状态下GPS代理间隔(分钟)</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="uiManager.closeModal('gps-modal')">取消</button>
                        <button class="btn btn-primary" onclick="uiManager.saveGpsRule()">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    /**
     * 保存WakeLock规则
     */
    saveWakeLockRule() {
        const type = document.getElementById('wl-type').value;
        const tag = document.getElementById('wl-tag').value;
        const pkg = document.getElementById('wl-pkg').value;
        const proxy = document.getElementById('wl-proxy').value;
        const enable = document.getElementById('wl-enable').checked;

        if (!tag || !pkg) {
            alert('请填写完整的规则信息');
            return;
        }

        // 创建新的WakeLock规则
        const newRule = {
            tagName: 'wakelock',
            attributes: {
                type: type,
                tag: tag,
                pkg: pkg,
                proxy: proxy,
                enable: enable.toString()
            },
            children: [],
            textContent: ''
        };

        // 添加到配置中
        let proxyWL = this.findConfigElement('proxyWL');
        if (!proxyWL) {
            // 创建proxyWL节点
            proxyWL = {
                tagName: 'proxyWL',
                attributes: {},
                children: [],
                textContent: ''
            };
            this.configData.children.push(proxyWL);
        }

        proxyWL.children.push(newRule);

        // 触发配置变更事件
        const event = new CustomEvent('configChange', {
            detail: { path: 'proxyWL', value: 'updated' }
        });
        document.dispatchEvent(event);

        // 关闭模态框并刷新显示
        this.closeModal('wakelock-modal');
        this.renderCurrentSection();
    }

    /**
     * 保存GPS规则
     */
    saveGpsRule() {
        const type = document.getElementById('gps-type').value;
        const appType = document.getElementById('gps-apptype').value;
        const recentUse = document.getElementById('gps-recent').value;
        const stillInterval = document.getElementById('gps-interval').value;

        if (!appType || !recentUse || !stillInterval) {
            alert('请填写完整的规则信息');
            return;
        }

        // 创建新的GPS规则
        const newRule = {
            tagName: 'item',
            attributes: {
                type: type,
                appType: appType,
                recentUse: recentUse,
                stillInterval: stillInterval
            },
            children: [],
            textContent: ''
        };

        // 添加到配置中
        let proxyGps = this.findConfigElement('proxyGps');
        if (!proxyGps) {
            // 创建proxyGps节点
            proxyGps = {
                tagName: 'proxyGps',
                attributes: {},
                children: [],
                textContent: ''
            };
            this.configData.children.push(proxyGps);
        }

        proxyGps.children.push(newRule);

        // 触发配置变更事件
        const event = new CustomEvent('configChange', {
            detail: { path: 'proxyGps', value: 'updated' }
        });
        document.dispatchEvent(event);

        // 关闭模态框并刷新显示
        this.closeModal('gps-modal');
        this.renderCurrentSection();
    }

    /**
     * 编辑WakeLock规则
     * @param {number} index - 规则索引
     */
    editWakeLockRule(index) {
        const proxyWL = this.findConfigElement('proxyWL');
        if (!proxyWL || !proxyWL.children[index]) {
            return;
        }

        const rule = proxyWL.children[index];
        this.showWakeLockEditor();

        // 填充表单数据
        setTimeout(() => {
            document.getElementById('wl-type').value = rule.attributes.type || 'proxy';
            document.getElementById('wl-tag').value = rule.attributes.tag || '';
            document.getElementById('wl-pkg').value = rule.attributes.pkg || '';
            document.getElementById('wl-proxy').value = rule.attributes.proxy || '4';
            document.getElementById('wl-enable').checked = rule.attributes.enable !== 'false';
        }, 100);

        // 修改保存按钮行为
        setTimeout(() => {
            const saveBtn = document.querySelector('#wakelock-modal .btn-primary');
            if (saveBtn) {
                saveBtn.onclick = () => this.updateWakeLockRule(index);
            }
        }, 100);
    }

    /**
     * 更新WakeLock规则
     * @param {number} index - 规则索引
     */
    updateWakeLockRule(index) {
        const proxyWL = this.findConfigElement('proxyWL');
        if (!proxyWL || !proxyWL.children[index]) {
            return;
        }

        const type = document.getElementById('wl-type').value;
        const tag = document.getElementById('wl-tag').value;
        const pkg = document.getElementById('wl-pkg').value;
        const proxy = document.getElementById('wl-proxy').value;
        const enable = document.getElementById('wl-enable').checked;

        if (!tag || !pkg) {
            alert('请填写完整的规则信息');
            return;
        }

        // 更新规则
        proxyWL.children[index].attributes = {
            type: type,
            tag: tag,
            pkg: pkg,
            proxy: proxy,
            enable: enable.toString()
        };

        // 触发配置变更事件
        const event = new CustomEvent('configChange', {
            detail: { path: 'proxyWL', value: 'updated' }
        });
        document.dispatchEvent(event);

        // 关闭模态框并刷新显示
        this.closeModal('wakelock-modal');
        this.renderCurrentSection();
    }

    /**
     * 删除WakeLock规则
     * @param {number} index - 规则索引
     */
    deleteWakeLockRule(index) {
        if (!confirm('确定要删除这个WakeLock规则吗？')) {
            return;
        }

        const proxyWL = this.findConfigElement('proxyWL');
        if (proxyWL && proxyWL.children[index]) {
            proxyWL.children.splice(index, 1);

            // 触发配置变更事件
            const event = new CustomEvent('configChange', {
                detail: { path: 'proxyWL', value: 'updated' }
            });
            document.dispatchEvent(event);

            // 刷新显示
            this.renderCurrentSection();
        }
    }

    /**
     * 编辑GPS规则
     * @param {number} index - 规则索引
     */
    editGpsRule(index) {
        const proxyGps = this.findConfigElement('proxyGps');
        if (!proxyGps || !proxyGps.children[index]) {
            return;
        }

        const rule = proxyGps.children[index];
        this.showGpsEditor();

        // 填充表单数据
        setTimeout(() => {
            document.getElementById('gps-type').value = rule.attributes.type || 'white';
            document.getElementById('gps-apptype').value = rule.attributes.appType || '11';
            document.getElementById('gps-recent').value = rule.attributes.recentUse || '';
            document.getElementById('gps-interval').value = rule.attributes.stillInterval || '';
        }, 100);

        // 修改保存按钮行为
        setTimeout(() => {
            const saveBtn = document.querySelector('#gps-modal .btn-primary');
            if (saveBtn) {
                saveBtn.onclick = () => this.updateGpsRule(index);
            }
        }, 100);
    }

    /**
     * 更新GPS规则
     * @param {number} index - 规则索引
     */
    updateGpsRule(index) {
        const proxyGps = this.findConfigElement('proxyGps');
        if (!proxyGps || !proxyGps.children[index]) {
            return;
        }

        const type = document.getElementById('gps-type').value;
        const appType = document.getElementById('gps-apptype').value;
        const recentUse = document.getElementById('gps-recent').value;
        const stillInterval = document.getElementById('gps-interval').value;

        if (!appType || !recentUse || !stillInterval) {
            alert('请填写完整的规则信息');
            return;
        }

        // 更新规则
        proxyGps.children[index].attributes = {
            type: type,
            appType: appType,
            recentUse: recentUse,
            stillInterval: stillInterval
        };

        // 触发配置变更事件
        const event = new CustomEvent('configChange', {
            detail: { path: 'proxyGps', value: 'updated' }
        });
        document.dispatchEvent(event);

        // 关闭模态框并刷新显示
        this.closeModal('gps-modal');
        this.renderCurrentSection();
    }

    /**
     * 删除GPS规则
     * @param {number} index - 规则索引
     */
    deleteGpsRule(index) {
        if (!confirm('确定要删除这个GPS规则吗？')) {
            return;
        }

        const proxyGps = this.findConfigElement('proxyGps');
        if (proxyGps && proxyGps.children[index]) {
            proxyGps.children.splice(index, 1);

            // 触发配置变更事件
            const event = new CustomEvent('configChange', {
                detail: { path: 'proxyGps', value: 'updated' }
            });
            document.dispatchEvent(event);

            // 刷新显示
            this.renderCurrentSection();
        }
    }

    /**
     * 关闭模态框
     * @param {string} modalId - 模态框ID
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    /**
     * 初始化白名单控件
     */
    initializeWhitelistControls() {
        this.populateListTypeSelect('whitelist-type', ['whitePkg', 'ffPkg', 'alarm', 'cpnBroadcast', 'cpnService', 'proxyBroadcast', 'proxyWL', 'proxyGps']);
        this.bindWhitelistEvents();
    }

    /**
     * 初始化黑名单控件
     */
    initializeBlacklistControls() {
        this.populateListTypeSelect('blacklist-type', ['SysBlack', 'ffPkg', 'alarm', 'cpnBroadcast', 'cpnService', 'proxyBroadcast', 'proxyWL']);
        this.bindBlacklistEvents();
    }

    /**
     * 填充列表类型选择框
     * @param {string} selectId - 选择框ID
     * @param {Array} types - 支持的类型数组
     */
    populateListTypeSelect(selectId, types) {
        const select = document.getElementById(selectId);
        if (!select || !this.whitelistManager) return;

        // 清空现有选项
        select.innerHTML = '<option value="">请选择列表类型</option>';

        // 添加支持的类型
        types.forEach(type => {
            const config = this.whitelistManager.getListTypeConfig(type);
            if (config) {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = `${config.name} (${type})`;
                option.title = config.description;
                select.appendChild(option);
            }
        });
    }

    /**
     * 绑定白名单事件
     */
    bindWhitelistEvents() {
        const typeSelect = document.getElementById('whitelist-type');
        const addBtn = document.getElementById('add-whitelist-item');

        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                const selectedType = e.target.value;
                this.loadWhitelistItems(selectedType);

                // 启用/禁用按钮
                const hasSelection = selectedType !== '';
                addBtn.disabled = !hasSelection;
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const selectedType = typeSelect.value;
                if (selectedType) {
                    this.showAddItemDialog(selectedType, 'whitelist');
                }
            });
        }
    }

    /**
     * 绑定黑名单事件
     */
    bindBlacklistEvents() {
        const typeSelect = document.getElementById('blacklist-type');
        const addBtn = document.getElementById('add-blacklist-item');

        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                const selectedType = e.target.value;
                this.loadBlacklistItems(selectedType);

                // 启用/禁用按钮
                const hasSelection = selectedType !== '';
                addBtn.disabled = !hasSelection;
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const selectedType = typeSelect.value;
                if (selectedType) {
                    this.showAddItemDialog(selectedType, 'blacklist');
                }
            });
        }
    }

    /**
     * 加载白名单项目
     * @param {string} listType - 列表类型
     */
    loadWhitelistItems(listType) {
        if (!listType || !this.whitelistManager) {
            document.getElementById('whitelist-content').innerHTML = '<div class="empty-state"><p>请选择一个列表类型</p></div>';
            return;
        }

        try {
            const items = this.whitelistManager.getListItems(listType);
            const config = this.whitelistManager.getListTypeConfig(listType);
            this.renderListItems('whitelist-content', items, config, listType, 'whitelist');
        } catch (error) {
            document.getElementById('whitelist-content').innerHTML = `<div class="error-state"><p>加载失败: ${error.message}</p></div>`;
        }
    }

    /**
     * 加载黑名单项目
     * @param {string} listType - 列表类型
     */
    loadBlacklistItems(listType) {
        if (!listType || !this.whitelistManager) {
            document.getElementById('blacklist-content').innerHTML = '<div class="empty-state"><p>请选择一个列表类型</p></div>';
            return;
        }

        try {
            const items = this.whitelistManager.getListItems(listType);
            const config = this.whitelistManager.getListTypeConfig(listType);
            this.renderListItems('blacklist-content', items, config, listType, 'blacklist');
        } catch (error) {
            document.getElementById('blacklist-content').innerHTML = `<div class="error-state"><p>加载失败: ${error.message}</p></div>`;
        }
    }

    /**
     * 渲染列表项目
     * @param {string} containerId - 容器ID
     * @param {Array} items - 项目数组
     * @param {Object} config - 列表配置
     * @param {string} listType - 列表类型
     * @param {string} context - 上下文(whitelist/blacklist)
     */
    renderListItems(containerId, items, config, listType, context) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>暂无${config.name}项目</p>
                    <p class="text-muted">${config.description}</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="list-header">
                <h3>${config.name}</h3>
                <p class="text-muted">${config.description}</p>
                <div class="list-stats">
                    <span class="badge">${items.length} 个项目</span>
                </div>
            </div>
            <div class="list-table-container">
                <table class="list-table">
                    <thead>
                        <tr>
        `;

        // 动态生成表头
        config.attributes.forEach(attr => {
            html += `<th>${this.getAttributeDisplayName(attr)}</th>`;
        });
        html += `<th>操作</th></tr></thead><tbody>`;

        // 生成表格行
        items.forEach(item => {
            html += '<tr>';
            config.attributes.forEach(attr => {
                const value = item[attr] || '';
                const displayValue = this.formatAttributeValue(attr, value, config);
                html += `<td title="${value}">${displayValue}</td>`;
            });

            html += `
                <td class="actions">
                    <button class="btn btn-sm btn-secondary list-edit-btn"
                            data-list-type="${listType}"
                            data-item-id="${item.id}"
                            data-context="${context}"
                            title="编辑">
                        编辑
                    </button>
                    <button class="btn btn-sm btn-danger list-delete-btn"
                            data-list-type="${listType}"
                            data-item-id="${item.id}"
                            data-context="${context}"
                            title="删除">
                        删除
                    </button>
                </td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        // 绑定操作按钮事件
        this.bindListActionEvents(containerId);
    }

    /**
     * 获取属性显示名称
     * @param {string} attr - 属性名
     * @returns {string} 显示名称
     */
    getAttributeDisplayName(attr) {
        const displayNames = {
            'name': '应用包名',
            'pkg': '包名',
            'type': '类型',
            'category': '分类',
            'action': '动作',
            'cpn': '组件',
            'calling': '调用方向',
            'scene': '场景',
            'tag': '标签',
            'proxy': '代理级别',
            'enable': '启用状态',
            'appType': '应用类型',
            'recentUse': '最近使用',
            'stillInterval': '静止间隔',
            'version': '版本',
            'mask': '掩码'
        };
        return displayNames[attr] || attr;
    }

    /**
     * 格式化属性值显示
     * @param {string} attr - 属性名
     * @param {string} value - 属性值
     * @param {Object} config - 列表配置
     * @returns {string} 格式化后的值
     */
    formatAttributeValue(attr, value, config) {
        if (!value) return '-';

        // 处理类型字段
        if (attr === 'type' && config.types && config.types[value]) {
            return `<span class="type-badge type-${value}">${config.types[value]}</span>`;
        }

        // 处理分类字段
        if (attr === 'category' && config.categories && config.categories[value]) {
            return `<span class="category-badge">${config.categories[value]}</span>`;
        }

        // 处理布尔值
        if (value === 'true' || value === 'false') {
            return `<span class="bool-badge bool-${value}">${value === 'true' ? '是' : '否'}</span>`;
        }

        // 处理长文本
        if (value.length > 30) {
            return `<span title="${value}">${value.substring(0, 30)}...</span>`;
        }

        return value;
    }

    /**
     * 显示添加项目浮动表单
     * @param {string} listType - 列表类型
     * @param {string} context - 上下文
     */
    showAddItemDialog(listType, context) {
        if (!this.whitelistManager) {
            console.error('WhitelistManager未初始化');
            return;
        }

        const config = this.whitelistManager.getListTypeConfig(listType);
        if (!config) {
            console.error(`未找到列表类型配置: ${listType}`);
            return;
        }

        log.info('显示添加项目的浮动表单', { listType, context, configName: config.name });

        // 移除已存在的浮动表单
        this.removeFloatingForm();

        const floatingFormHtml = `
            <div id="floating-add-form" class="floating-form collapsed">
                <div class="floating-form-header" id="floating-form-header">
                    <div class="floating-form-title">
                        <i class="icon-plus"></i>
                        <span>添加${config.name}项目</span>
                    </div>
                    <div class="floating-form-toggle">
                        <i class="icon-chevron-up"></i>
                    </div>
                </div>
                <div class="floating-form-content">
                    <form id="floating-add-item-form">
                        ${this.generateFormFields(config)}
                    </form>
                    <div class="floating-form-actions">
                        <button type="button" class="btn btn-secondary" id="floating-cancel-btn">取消</button>
                        <button type="button" class="btn btn-primary" id="floating-save-btn" data-list-type="${listType}" data-context="${context}">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', floatingFormHtml);

        // 绑定事件监听器
        this.bindFloatingFormEvents();

        // 自动展开表单
        setTimeout(() => {
            this.toggleFloatingForm();
        }, 100);

        log.info('浮动表单已创建并显示', { listType, context });
    }

    /**
     * 生成表单字段
     * @param {Object} config - 列表配置
     * @returns {string} 表单HTML
     */
    generateFormFields(config) {
        let html = '';

        config.attributes.forEach(attr => {
            const displayName = this.getAttributeDisplayName(attr);
            const isRequired = ['name', 'pkg', 'type'].includes(attr);

            html += `
                <div class="form-group">
                    <label for="field-${attr}">${displayName}${isRequired ? ' *' : ''}:</label>
            `;

            // 根据属性类型生成不同的输入控件
            if (attr === 'type' && config.types) {
                html += `<select id="field-${attr}" class="form-control" ${isRequired ? 'required' : ''}>`;
                html += '<option value="">请选择类型</option>';
                Object.entries(config.types).forEach(([key, value]) => {
                    html += `<option value="${key}">${value}</option>`;
                });
                html += '</select>';
            } else if (attr === 'category' && config.categories) {
                html += `<select id="field-${attr}" class="form-control" ${isRequired ? 'required' : ''}>`;
                html += '<option value="">请选择分类</option>';
                Object.entries(config.categories).forEach(([key, value]) => {
                    html += `<option value="${key}">${value}</option>`;
                });
                html += '</select>';
            } else if (attr === 'enable' || attr === 'calling') {
                html += `
                    <select id="field-${attr}" class="form-control">
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                `;
            } else {
                html += `<input type="text" id="field-${attr}" class="form-control" ${isRequired ? 'required' : ''} placeholder="请输入${displayName}">`;
            }

            html += '</div>';
        });

        return html;
    }

    /**
     * 切换浮动表单的展开/收起状态
     */
    toggleFloatingForm() {
        const form = document.getElementById('floating-add-form');
        if (!form) {
            console.warn('浮动表单不存在');
            return;
        }

        const isCollapsed = form.classList.contains('collapsed');
        console.log(`切换浮动表单状态: ${isCollapsed ? '展开' : '收起'}`);

        if (isCollapsed) {
            form.classList.remove('collapsed');
            form.classList.add('expanded');
        } else {
            form.classList.remove('expanded');
            form.classList.add('collapsed');
        }
    }

    /**
     * 移除浮动表单
     */
    removeFloatingForm() {
        const existingForm = document.getElementById('floating-add-form');
        if (existingForm) {
            console.log('移除现有浮动表单');
            // 移除事件监听器会在DOM元素删除时自动清理
            existingForm.remove();
        }
    }

    /**
     * 绑定浮动表单事件监听器
     */
    bindFloatingFormEvents() {
        console.log('绑定浮动表单事件监听器');

        // 绑定头部点击事件
        const header = document.getElementById('floating-form-header');
        if (header) {
            header.addEventListener('click', () => {
                console.log('点击浮动表单头部');
                this.toggleFloatingForm();
            });
        }

        // 绑定取消按钮事件
        const cancelBtn = document.getElementById('floating-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('点击取消按钮');
                this.removeFloatingForm();
            });
        }

        // 绑定保存按钮事件
        const saveBtn = document.getElementById('floating-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                console.log('点击保存按钮');
                const listType = saveBtn.getAttribute('data-list-type');
                const context = saveBtn.getAttribute('data-context');
                const itemId = saveBtn.getAttribute('data-item-id');

                console.log('保存按钮数据:', { listType, context, itemId });

                if (itemId) {
                    // 编辑模式
                    this.saveEditedItemFromFloating(listType, itemId, context);
                } else {
                    // 添加模式
                    this.saveNewItemFromFloating(listType, context);
                }
            });
        }

        console.log('浮动表单事件监听器绑定完成');
    }

    /**
     * 绑定列表操作按钮事件
     * @param {string} containerId - 容器ID
     */
    bindListActionEvents(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            log.warn('容器不存在', { containerId });
            return;
        }

        log.debug('绑定列表操作事件', { containerId });

        // 移除之前的事件监听器（如果存在）
        if (container._listActionHandler) {
            container.removeEventListener('click', container._listActionHandler);
        }

        // 使用事件委托绑定点击事件
        const self = this; // 保存this引用
        const handleListActionClick = (event) => {
            log.debug('列表操作事件触发', { target: event.target.tagName, className: event.target.className });

            const target = event.target.closest('button');
            if (!target) {
                log.debug('未找到按钮元素');
                return;
            }

            // 阻止事件冒泡和默认行为
            event.preventDefault();
            event.stopPropagation();

            log.debug('找到按钮元素', { tagName: target.tagName, className: target.className });

            const listType = target.getAttribute('data-list-type');
            const itemId = target.getAttribute('data-item-id');
            const context = target.getAttribute('data-context');

            log.debug('按钮数据属性', { listType, itemId, context });

            if (!listType || !itemId || !context) {
                log.warn('按钮缺少必要的数据属性', { listType, itemId, context });
                return;
            }

            if (target.classList.contains('list-edit-btn')) {
                log.info('点击编辑按钮', { listType, itemId, context });
                self.editListItem(listType, itemId, context);
            } else if (target.classList.contains('list-delete-btn')) {
                log.info('点击删除按钮', { listType, itemId, context });
                self.deleteListItem(listType, itemId, context);
            } else {
                log.warn('未识别的按钮类型', { className: target.className });
            }
        };

        // 保存事件处理器引用以便后续移除
        container._listActionHandler = handleListActionClick;
        container.addEventListener('click', handleListActionClick, true); // 使用捕获阶段

        // 同时绑定到冒泡阶段作为备用
        container.addEventListener('click', handleListActionClick, false);

        log.info('列表操作事件绑定完成', { containerId });

        // 验证事件绑定是否成功
        setTimeout(() => {
            const buttons = container.querySelectorAll('.list-delete-btn, .list-edit-btn');
            log.debug('验证按钮绑定', {
                containerId,
                buttonCount: buttons.length,
                hasHandler: !!container._listActionHandler
            });
        }, 100);
    }

    /**
     * 从浮动表单保存新项目
     * @param {string} listType - 列表类型
     * @param {string} context - 上下文
     */
    async saveNewItemFromFloating(listType, context) {
        if (!this.whitelistManager) {
            console.error('WhitelistManager未初始化');
            return;
        }

        const config = this.whitelistManager.getListTypeConfig(listType);
        if (!config) {
            console.error(`未找到列表类型配置: ${listType}`);
            return;
        }

        console.log(`开始保存${config.name}项目`, { listType, context });

        try {
            // 收集表单数据
            const itemData = {};
            config.attributes.forEach(attr => {
                const field = document.getElementById(`field-${attr}`);
                if (field) {
                    itemData[attr] = field.value.trim();
                }
            });

            console.log('收集到的表单数据:', itemData);

            // 验证必需字段
            const requiredFields = ['name', 'pkg', 'type'].filter(field =>
                config.attributes.includes(field));

            const missingFields = requiredFields.filter(field => !itemData[field]);
            if (missingFields.length > 0) {
                const errorMsg = `请填写必需字段: ${missingFields.join(', ')}`;
                console.warn('表单验证失败:', errorMsg);
                this.toastManager?.show(errorMsg, 'error');
                return;
            }

            // 添加项目
            console.log('开始添加列表项目...');
            await this.whitelistManager.addListItem(listType, itemData);
            console.log('列表项目添加成功');

            // 移除浮动表单
            this.removeFloatingForm();

            // 刷新列表
            console.log(`刷新${context}列表`);
            if (context === 'whitelist') {
                this.loadWhitelistItems(listType);
            } else {
                this.loadBlacklistItems(listType);
            }

            this.toastManager?.show('项目添加成功', 'success');
            console.log('项目添加流程完成');

        } catch (error) {
            console.error('添加项目失败:', error);
            this.toastManager?.show(`添加失败: ${error.message}`, 'error');
        }
    }

    /**
     * 保存新项目（兼容旧的模态框方式）
     * @param {string} listType - 列表类型
     * @param {string} context - 上下文
     */
    async saveNewItem(listType, context) {
        // 重定向到浮动表单方法
        return this.saveNewItemFromFloating(listType, context);
    }

    /**
     * 编辑列表项目
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @param {string} context - 上下文
     */
    editListItem(listType, itemId, context) {
        if (!this.whitelistManager) {
            console.error('WhitelistManager未初始化');
            return;
        }

        const items = this.whitelistManager.getListItems(listType);
        const item = items.find(i => i.id === itemId);
        const config = this.whitelistManager.getListTypeConfig(listType);

        if (!item || !config) {
            console.error('未找到要编辑的项目或配置', { listType, itemId, hasItem: !!item, hasConfig: !!config });
            return;
        }

        console.log(`显示编辑${config.name}项目的浮动表单`, { listType, itemId, context, item });

        // 移除已存在的浮动表单
        this.removeFloatingForm();

        const floatingFormHtml = `
            <div id="floating-add-form" class="floating-form collapsed">
                <div class="floating-form-header" id="floating-form-header">
                    <div class="floating-form-title">
                        <i class="icon-edit"></i>
                        <span>编辑${config.name}项目</span>
                    </div>
                    <div class="floating-form-toggle">
                        <i class="icon-chevron-up"></i>
                    </div>
                </div>
                <div class="floating-form-content">
                    <form id="floating-add-item-form">
                        ${this.generateFormFields(config)}
                    </form>
                    <div class="floating-form-actions">
                        <button type="button" class="btn btn-secondary" id="floating-cancel-btn">取消</button>
                        <button type="button" class="btn btn-primary" id="floating-save-btn" data-list-type="${listType}" data-item-id="${itemId}" data-context="${context}">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', floatingFormHtml);

        // 绑定事件监听器
        this.bindFloatingFormEvents();

        // 自动展开表单并填充数据
        setTimeout(() => {
            this.toggleFloatingForm();

            // 填充现有数据
            config.attributes.forEach(attr => {
                const field = document.getElementById(`field-${attr}`);
                if (field && item[attr] !== undefined) {
                    field.value = item[attr];
                    console.log(`填充字段 ${attr}: ${item[attr]}`);
                }
            });

            console.log('编辑表单数据填充完成');
        }, 100);
    }

    /**
     * 从浮动表单保存编辑的项目
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @param {string} context - 上下文
     */
    async saveEditedItemFromFloating(listType, itemId, context) {
        if (!this.whitelistManager) {
            console.error('WhitelistManager未初始化');
            return;
        }

        const config = this.whitelistManager.getListTypeConfig(listType);
        if (!config) {
            console.error(`未找到列表类型配置: ${listType}`);
            return;
        }

        console.log(`开始保存编辑的${config.name}项目`, { listType, itemId, context });

        try {
            // 收集表单数据
            const newData = {};
            config.attributes.forEach(attr => {
                const field = document.getElementById(`field-${attr}`);
                if (field) {
                    newData[attr] = field.value.trim();
                }
            });

            console.log('收集到的编辑数据:', newData);

            // 更新项目
            console.log('开始更新列表项目...');
            await this.whitelistManager.updateListItem(listType, itemId, newData);
            console.log('列表项目更新成功');

            // 移除浮动表单
            this.removeFloatingForm();

            // 刷新列表
            console.log(`刷新${context}列表`);
            if (context === 'whitelist') {
                this.loadWhitelistItems(listType);
            } else {
                this.loadBlacklistItems(listType);
            }

            this.toastManager?.show('项目更新成功', 'success');
            console.log('项目更新流程完成');

        } catch (error) {
            console.error('更新项目失败:', error);
            this.toastManager?.show(`更新失败: ${error.message}`, 'error');
        }
    }

    /**
     * 保存编辑的项目（兼容旧的模态框方式）
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @param {string} context - 上下文
     */
    async saveEditedItem(listType, itemId, context) {
        // 重定向到浮动表单方法
        return this.saveEditedItemFromFloating(listType, itemId, context);
    }

    /**
     * 删除列表项目
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @param {string} context - 上下文
     */
    async deleteListItem(listType, itemId, context) {
        if (!this.whitelistManager) {
            log.error('WhitelistManager未初始化');
            return;
        }

        log.info('开始删除项目', { listType, itemId, context });

        // 获取要删除的项目信息用于日志
        const items = this.whitelistManager.getListItems(listType);
        const item = items.find(i => i.id === itemId);

        if (!item) {
            log.warn('要删除的项目不存在', { itemId, listType });
            this.toastManager?.show('项目不存在', 'error');
            return;
        }

        log.debug('找到要删除的项目', { item: { ...item, _element: undefined } });

        let confirmed = false;
        if (!this.modalManager) {
            log.warn('ModalManager未初始化，使用浏览器原生确认对话框');
            confirmed = window.confirm('确定要删除这个项目吗？此操作无法撤销。');
        } else {
            log.debug('显示删除确认对话框');
            confirmed = await this.modalManager.showDanger(
                '确认删除',
                '确定要删除这个项目吗？此操作无法撤销。',
                '删除'
            );
        }
        log.debug('用户确认结果', { confirmed });

        if (!confirmed) {
            log.info('用户取消删除操作', { itemId, listType });
            return;
        }

        try {
            log.debug('开始执行删除操作', { listType, itemId });
            await this.whitelistManager.removeListItem(listType, itemId);
            log.debug('删除操作执行成功', { listType, itemId });

            // 刷新列表
            log.debug('刷新列表', { context, listType });
            if (context === 'whitelist') {
                this.loadWhitelistItems(listType);
            } else {
                this.loadBlacklistItems(listType);
            }

            this.toastManager?.show('项目删除成功', 'success');
            log.operation('删除列表项目', { listType, itemId, context });

        } catch (error) {
            log.error('删除项目失败', {
                error: error.message,
                itemId,
                listType,
                context,
                stack: error.stack
            });
            this.toastManager?.show(`删除失败: ${error.message}`, 'error');
        }
    }






}
