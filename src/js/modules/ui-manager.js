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
}
