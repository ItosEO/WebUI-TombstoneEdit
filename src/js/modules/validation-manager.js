/**
 * 验证管理器模块
 * 负责配置数据的验证和错误检查
 */

export class ValidationManager {
    constructor() {
        this.validationRules = this.initializeValidationRules();
    }

    /**
     * 初始化验证规则
     * @returns {Object} 验证规则
     */
    initializeValidationRules() {
        return {
            enableConfig: {
                required: true,
                attributes: {
                    hansEnable: { type: 'boolean', required: true },
                    gmsEnable: { type: 'boolean', required: true },
                    releaseStatistic: { type: 'boolean', required: true },
                    skipToast: { type: 'boolean', required: true },
                    heatGameCloseNet: { type: 'boolean', required: true },
                    dozeRestrictSwitch: { type: 'boolean', required: true },
                    audioByHook: { type: 'boolean', required: true },
                    navigationByHook: { type: 'boolean', required: true },
                    audioCheckEnable: { type: 'boolean', required: true },
                    proxyWakeLockEnable: { type: 'boolean', required: true },
                    cgp_v2: { type: 'boolean', required: true },
                    hansWatchDogEnable: { type: 'boolean', required: true },
                    cpnCheckByHook: { type: 'boolean', required: true },
                    restoreAlarm: { type: 'boolean', required: true },
                    uidGoneRemoveAlarm: { type: 'boolean', required: true },
                    MStateTrimMemConfig: { type: 'boolean', required: true }
                }
            },
            lcdOffConfig: {
                required: true,
                attributes: {
                    ffTotal: { type: 'number', required: true },
                    ffInterval: { type: 'number', required: true },
                    interval: { type: 'number', required: true },
                    deepSleepFreezeWhite: { type: 'boolean', required: true },
                    gameCloseNet: { type: 'boolean', required: true },
                    idleEnable: { type: 'boolean', required: true }
                }
            },
            lcdOnConfig: {
                required: true,
                attributes: {
                    RToM: { type: 'number', required: true },
                    MToF: { type: 'number', required: true },
                    checkImportance: { type: 'number', required: true },
                    gameCloseNet: { type: 'boolean', required: true }
                }
            },
            ffConfig: {
                required: true,
                attributes: {
                    enable: { type: 'boolean', required: true },
                    enterTimeout: { type: 'number', required: true },
                    interval: { type: 'number', required: true },
                    maxFzNum: { type: 'number', required: true }
                }
            },
            proxyConfig: {
                required: false,
                attributes: {
                    alarm: { type: 'boolean', required: true },
                    service: { type: 'boolean', required: true },
                    job: { type: 'boolean', required: true },
                    broadcast: { type: 'boolean', required: true },
                    proxyBCmax: { type: 'number', required: true }
                }
            },
            superFreezeConfig: {
                required: false,
                attributes: {
                    enable: { type: 'boolean', required: true }
                }
            },
            cpuCtlRus: {
                required: false,
                attributes: {
                    shortCommCpuRateCtl: { type: 'number', required: true },
                    longCommCpuRateCtl: { type: 'number', required: true },
                    shortSysCpuRateCtl: { type: 'number', required: true },
                    collectCpuInfoCycle: { type: 'number', required: true },
                    cpuCollectEnable: { type: 'boolean', required: true }
                }
            },
            restrictNet: {
                required: false,
                attributes: {
                    appTypeValue: { type: 'number', required: true },
                    delayTime: { type: 'number', required: true }
                }
            },
            thermalMode: {
                required: false,
                attributes: {
                    enable: { type: 'boolean', required: true },
                    enterLevel: { type: 'number', required: true },
                    exitLevel: { type: 'number', required: true }
                }
            }
        };
    }

    /**
     * 验证完整配置
     * @param {Object} config - 配置对象
     * @returns {Object} 验证结果
     */
    validateConfig(config) {
        const errors = [];
        const warnings = [];

        try {
            // 检查根节点
            if (!config || config.tagName !== 'filter-conf') {
                errors.push('配置文件缺少有效的filter-conf根节点');
                return { isValid: false, errors, warnings };
            }

            // 验证各个配置节
            for (const [sectionName, rules] of Object.entries(this.validationRules)) {
                const sectionResult = this.validateSection(config, sectionName, rules);
                errors.push(...sectionResult.errors);
                warnings.push(...sectionResult.warnings);
            }

            // 检查版本信息
            const versionResult = this.validateVersion(config);
            warnings.push(...versionResult.warnings);

            return {
                isValid: errors.length === 0,
                errors,
                warnings
            };

        } catch (error) {
            console.error('配置验证过程中发生错误:', error);
            errors.push(`验证过程中发生错误: ${error.message}`);
            return { isValid: false, errors, warnings };
        }
    }

    /**
     * 验证配置节
     * @param {Object} config - 配置对象
     * @param {string} sectionName - 配置节名称
     * @param {Object} rules - 验证规则
     * @returns {Object} 验证结果
     */
    validateSection(config, sectionName, rules) {
        const errors = [];
        const warnings = [];

        // 查找配置节
        const section = this.findConfigElement(config, sectionName);

        if (!section) {
            if (rules.required) {
                errors.push(`缺少必需的配置节: ${sectionName}`);
            } else {
                warnings.push(`缺少可选的配置节: ${sectionName}`);
            }
            return { errors, warnings };
        }

        // 验证属性
        if (rules.attributes) {
            for (const [attrName, attrRules] of Object.entries(rules.attributes)) {
                const attrResult = this.validateAttribute(section, attrName, attrRules, sectionName);
                errors.push(...attrResult.errors);
                warnings.push(...attrResult.warnings);
            }
        }

        return { errors, warnings };
    }

    /**
     * 验证属性
     * @param {Object} section - 配置节对象
     * @param {string} attrName - 属性名
     * @param {Object} rules - 属性验证规则
     * @param {string} sectionName - 配置节名称
     * @returns {Object} 验证结果
     */
    validateAttribute(section, attrName, rules, sectionName) {
        const errors = [];
        const warnings = [];

        const value = section.attributes ? section.attributes[attrName] : undefined;

        // 检查必需属性
        if (rules.required && (value === undefined || value === '')) {
            errors.push(`${sectionName}.${attrName}: 缺少必需的属性`);
            return { errors, warnings };
        }

        // 如果值不存在且不是必需的，跳过验证
        if (value === undefined || value === '') {
            return { errors, warnings };
        }

        // 类型验证
        switch (rules.type) {
            case 'boolean':
                if (value !== 'true' && value !== 'false') {
                    errors.push(`${sectionName}.${attrName}: 值必须是'true'或'false'，当前值: ${value}`);
                }
                break;

            case 'number':
                const numValue = parseInt(value);
                if (isNaN(numValue)) {
                    errors.push(`${sectionName}.${attrName}: 值必须是数字，当前值: ${value}`);
                } else {
                    // 范围验证
                    if (rules.min !== undefined && numValue < rules.min) {
                        errors.push(`${sectionName}.${attrName}: 值不能小于${rules.min}，当前值: ${numValue}`);
                    }
                    if (rules.max !== undefined && numValue > rules.max) {
                        errors.push(`${sectionName}.${attrName}: 值不能大于${rules.max}，当前值: ${numValue}`);
                    }
                    
                    // 合理性警告
                    if (rules.recommendedMin !== undefined && numValue < rules.recommendedMin) {
                        warnings.push(`${sectionName}.${attrName}: 建议值不小于${rules.recommendedMin}，当前值: ${numValue}`);
                    }
                    if (rules.recommendedMax !== undefined && numValue > rules.recommendedMax) {
                        warnings.push(`${sectionName}.${attrName}: 建议值不大于${rules.recommendedMax}，当前值: ${numValue}`);
                    }
                }
                break;

            case 'string':
                if (typeof value !== 'string') {
                    errors.push(`${sectionName}.${attrName}: 值必须是字符串，当前类型: ${typeof value}`);
                } else {
                    // 长度验证
                    if (rules.minLength !== undefined && value.length < rules.minLength) {
                        errors.push(`${sectionName}.${attrName}: 字符串长度不能小于${rules.minLength}`);
                    }
                    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                        errors.push(`${sectionName}.${attrName}: 字符串长度不能大于${rules.maxLength}`);
                    }
                    
                    // 格式验证
                    if (rules.pattern && !rules.pattern.test(value)) {
                        errors.push(`${sectionName}.${attrName}: 值格式不正确`);
                    }
                }
                break;
        }

        return { errors, warnings };
    }

    /**
     * 验证版本信息
     * @param {Object} config - 配置对象
     * @returns {Object} 验证结果
     */
    validateVersion(config) {
        const warnings = [];

        const versionElement = this.findConfigElement(config, 'version');
        if (!versionElement) {
            warnings.push('缺少版本信息');
            return { warnings };
        }

        const version = versionElement.textContent;
        if (!version || version.trim() === '') {
            warnings.push('版本信息为空');
        } else {
            // 检查版本格式
            const versionPattern = /^\d{10}$/;
            if (!versionPattern.test(version.trim())) {
                warnings.push(`版本格式可能不正确: ${version}`);
            }
        }

        return { warnings };
    }

    /**
     * 验证单个值
     * @param {string} section - 配置节
     * @param {string} attribute - 属性名
     * @param {*} value - 值
     * @returns {Object} 验证结果
     */
    validateValue(section, attribute, value) {
        const rules = this.validationRules[section];
        if (!rules || !rules.attributes || !rules.attributes[attribute]) {
            return { isValid: false, error: '未知的配置项' };
        }

        const attrRules = rules.attributes[attribute];
        const mockSection = { attributes: { [attribute]: value } };
        const result = this.validateAttribute(mockSection, attribute, attrRules, section);

        return {
            isValid: result.errors.length === 0,
            error: result.errors[0] || null,
            warning: result.warnings[0] || null
        };
    }

    /**
     * 检查配置兼容性
     * @param {Object} config - 配置对象
     * @returns {Object} 兼容性检查结果
     */
    checkCompatibility(config) {
        const warnings = [];

        // 检查可能的冲突配置
        const enableConfig = this.findConfigElement(config, 'enableConfig');
        if (enableConfig && enableConfig.attributes) {
            const attrs = enableConfig.attributes;
            
            // 检查音频相关配置冲突
            if (attrs.audioByHook === 'false' && attrs.audioCheckEnable === 'true') {
                warnings.push('音频钩子拦截已禁用，但音频状态检查仍启用，可能导致功能冲突');
            }
            
            // 检查代理相关配置冲突
            if (attrs.proxyWakeLockEnable === 'false' && attrs.cgp_v2 === 'true') {
                warnings.push('WakeLock代理已禁用，但CGP v2仍启用，可能影响功耗优化效果');
            }
        }

        // 检查时间配置的合理性
        const lcdOffConfig = this.findConfigElement(config, 'lcdOffConfig');
        const lcdOnConfig = this.findConfigElement(config, 'lcdOnConfig');
        
        if (lcdOffConfig && lcdOnConfig) {
            const offInterval = parseInt(lcdOffConfig.attributes?.ffInterval || '0');
            const onRToM = parseInt(lcdOnConfig.attributes?.RToM || '0');
            
            if (offInterval > 0 && onRToM > 0 && offInterval > onRToM) {
                warnings.push('熄屏冻结间隔大于亮屏Recent→M延迟，可能导致策略冲突');
            }
        }

        return { warnings };
    }

    /**
     * 查找配置元素
     * @param {Object} config - 配置对象
     * @param {string} tagName - 标签名
     * @returns {Object|null} 配置元素
     */
    findConfigElement(config, tagName) {
        if (!config || !config.children) {
            return null;
        }

        return config.children.find(child => child.tagName === tagName) || null;
    }

    /**
     * 实时验证配置项
     * @param {string} section - 配置节
     * @param {string} attribute - 属性名
     * @param {*} value - 值
     * @param {Element} inputElement - 输入元素
     */
    validateRealTime(section, attribute, value, inputElement) {
        const result = this.validateValue(section, attribute, value);

        // 移除之前的验证状态
        inputElement.classList.remove('input-valid', 'input-invalid');

        // 移除之前的错误消息
        const existingError = inputElement.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }

        if (!result.isValid) {
            // 添加错误状态
            inputElement.classList.add('input-invalid');

            // 显示错误消息
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.textContent = result.error;
            inputElement.parentNode.appendChild(errorElement);

            return false;
        } else {
            // 添加有效状态
            inputElement.classList.add('input-valid');

            // 显示警告（如果有）
            if (result.warning) {
                const warningElement = document.createElement('div');
                warningElement.className = 'validation-warning';
                warningElement.textContent = result.warning;
                inputElement.parentNode.appendChild(warningElement);
            }

            return true;
        }
    }

    /**
     * 批量验证表单
     * @param {Element} formElement - 表单元素
     * @returns {Object} 验证结果
     */
    validateForm(formElement) {
        const errors = [];
        const warnings = [];
        let isValid = true;

        // 获取所有配置输入元素
        const inputs = formElement.querySelectorAll('[data-config-path]');

        inputs.forEach(input => {
            const path = input.dataset.configPath;
            const [section, attribute] = path.split('.');
            const value = input.type === 'checkbox' ? (input.checked ? 'true' : 'false') : input.value;

            const result = this.validateValue(section, attribute, value);

            if (!result.isValid) {
                errors.push(`${path}: ${result.error}`);
                isValid = false;
            }

            if (result.warning) {
                warnings.push(`${path}: ${result.warning}`);
            }
        });

        return { isValid, errors, warnings };
    }

    /**
     * 显示验证结果
     * @param {Object} validationResult - 验证结果
     * @param {Element} containerElement - 容器元素
     */
    displayValidationResult(validationResult, containerElement) {
        // 清除之前的结果
        containerElement.innerHTML = '';

        if (validationResult.isValid) {
            const successElement = document.createElement('div');
            successElement.className = 'validation-success';
            successElement.innerHTML = '<span class="icon">✅</span> 配置验证通过';
            containerElement.appendChild(successElement);
        } else {
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-errors';
            errorElement.innerHTML = `
                <div class="validation-header">
                    <span class="icon">❌</span> 发现 ${validationResult.errors.length} 个错误
                </div>
                <ul class="validation-list">
                    ${validationResult.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            `;
            containerElement.appendChild(errorElement);
        }

        if (validationResult.warnings.length > 0) {
            const warningElement = document.createElement('div');
            warningElement.className = 'validation-warnings';
            warningElement.innerHTML = `
                <div class="validation-header">
                    <span class="icon">⚠️</span> ${validationResult.warnings.length} 个警告
                </div>
                <ul class="validation-list">
                    ${validationResult.warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
            `;
            containerElement.appendChild(warningElement);
        }
    }

    /**
     * 创建验证摘要
     * @param {Object} validationResult - 验证结果
     * @returns {Object} 验证摘要
     */
    createValidationSummary(validationResult) {
        return {
            isValid: validationResult.isValid,
            errorCount: validationResult.errors.length,
            warningCount: validationResult.warnings.length,
            status: validationResult.isValid ? 'valid' : 'invalid',
            message: validationResult.isValid
                ? '配置验证通过'
                : `发现 ${validationResult.errors.length} 个错误`,
            details: {
                errors: validationResult.errors,
                warnings: validationResult.warnings
            }
        };
    }

    /**
     * 生成验证报告
     * @param {Object} validationResult - 验证结果
     * @returns {string} 验证报告
     */
    generateReport(validationResult) {
        let report = '配置验证报告\n';
        report += '================\n\n';

        if (validationResult.isValid) {
            report += '✅ 配置验证通过\n\n';
        } else {
            report += '❌ 配置验证失败\n\n';

            if (validationResult.errors.length > 0) {
                report += '错误:\n';
                validationResult.errors.forEach((error, index) => {
                    report += `${index + 1}. ${error}\n`;
                });
                report += '\n';
            }
        }

        if (validationResult.warnings.length > 0) {
            report += '警告:\n';
            validationResult.warnings.forEach((warning, index) => {
                report += `${index + 1}. ${warning}\n`;
            });
        }

        return report;
    }

    /**
     * 导出验证结果为JSON
     * @param {Object} validationResult - 验证结果
     * @returns {string} JSON字符串
     */
    exportValidationResult(validationResult) {
        const summary = this.createValidationSummary(validationResult);
        return JSON.stringify(summary, null, 2);
    }
}
