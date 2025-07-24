/**
 * 配置管理器模块
 * 负责配置数据的管理、验证和操作
 */

export class ConfigManager {
    constructor() {
        // 配置项定义
        this.configDefinitions = this.initializeConfigDefinitions();
    }

    /**
     * 初始化配置项定义
     * @returns {Object} 配置项定义
     */
    initializeConfigDefinitions() {
        return {
            // 基础开关配置
            enableConfig: {
                title: '基础开关',
                description: '控制墓碑机制的基础功能开关',
                type: 'group',
                items: {
                    hansEnable: { title: '启用全局墓碑机制', description: '控制整个墓碑系统的总开关', type: 'boolean' },
                    gmsEnable: { title: 'GMS应用优化', description: '对Google移动服务(GMS)应用启用优化', type: 'boolean' },
                    releaseStatistic: { title: '释放统计信息', description: '收集并释放统计信息', type: 'boolean' },
                    skipToast: { title: '跳过Toast通知', description: '冻结时跳过Toast通知避免唤醒', type: 'boolean' },
                    heatGameCloseNet: { title: '高温游戏断网', description: '高温时是否关闭游戏网络', type: 'boolean' },
                    dozeRestrictSwitch: { title: 'Doze模式限制', description: '在Doze模式下启用限制开关', type: 'boolean' },
                    audioByHook: { title: '音频钩子拦截', description: '通过钩子拦截音频事件减少唤醒', type: 'boolean' },
                    navigationByHook: { title: '导航钩子拦截', description: '通过钩子拦截导航事件减少唤醒', type: 'boolean' },
                    audioCheckEnable: { title: '音频状态检查', description: '启用音频状态检查', type: 'boolean' },
                    proxyWakeLockEnable: { title: 'WakeLock代理', description: '启用WakeLock代理机制', type: 'boolean' },
                    cgp_v2: { title: 'CGP v2', description: '使用第二代CGP功耗策略', type: 'boolean' },
                    hansWatchDogEnable: { title: '墓碑看门狗', description: '启用墓碑看门狗监控', type: 'boolean' },
                    cpnCheckByHook: { title: '组件钩子检查', description: '通过钩子检查组件状态', type: 'boolean' },
                    restoreAlarm: { title: '恢复闹钟', description: '解冻时恢复闹钟功能', type: 'boolean' },
                    uidGoneRemoveAlarm: { title: '卸载移除闹钟', description: '应用卸载时移除关联闹钟', type: 'boolean' },
                    MStateTrimMemConfig: { title: 'M状态内存压缩', description: '对M状态应用启用内存压缩', type: 'boolean' }
                }
            },

            // 熄屏配置
            lcdOffConfig: {
                title: '熄屏配置',
                description: '屏幕关闭时的墓碑策略',
                type: 'group',
                items: {
                    ffTotal: { title: '每次冻结数量', description: '每次冻结的最大应用数', type: 'number', unit: '个' },
                    ffInterval: { title: '冻结间隔', description: '冻结尝试间隔时间', type: 'number', unit: '毫秒' },
                    interval: { title: '检查间隔', description: '常规检查间隔时间', type: 'number', unit: '毫秒' },
                    deepSleepFreezeWhite: { title: '深度睡眠冻结白名单', description: '深度睡眠时冻结白名单应用', type: 'boolean' },
                    gameCloseNet: { title: '游戏断网', description: '熄屏时是否关闭游戏网络', type: 'boolean' },
                    idleEnable: { title: '空闲检测', description: '启用空闲状态检测', type: 'boolean' }
                }
            },

            // 亮屏配置
            lcdOnConfig: {
                title: '亮屏配置',
                description: '屏幕开启时的墓碑策略',
                type: 'group',
                items: {
                    RToM: { title: 'Recent→M延迟', description: 'Recent状态到M状态的冻结延迟', type: 'number', unit: '毫秒' },
                    MToF: { title: 'M→Frozen延迟', description: 'M状态到Frozen状态的冻结延迟', type: 'number', unit: '毫秒' },
                    checkImportance: { title: '重要性检查间隔', description: '应用重要性检查间隔', type: 'number', unit: '毫秒' },
                    gameCloseNet: { title: '游戏断网', description: '亮屏时是否关闭游戏网络', type: 'boolean' }
                }
            },

            // 快速冻结配置
            ffConfig: {
                title: '快速冻结配置',
                description: '快速冻结机制的相关设置',
                type: 'group',
                items: {
                    enable: { title: '启用快速冻结', description: '是否启用快速冻结功能', type: 'boolean' },
                    enterTimeout: { title: '进入超时', description: '进入冻结状态的超时时间', type: 'number', unit: '毫秒' },
                    interval: { title: '冻结周期', description: '快速冻结的执行周期', type: 'number', unit: '毫秒' },
                    maxFzNum: { title: '最大冻结数', description: '单批次最大冻结应用数量', type: 'number', unit: '个' }
                }
            },

            // 功耗代理配置
            proxyConfig: {
                title: '功耗代理设置',
                description: '控制 alarm/service/job/broadcast 等代理开关',
                type: 'group',
                items: {
                    alarm: { title: '代理Alarm广播', description: '是否代理 AlarmManager 广播', type: 'boolean' },
                    service: { title: '代理Service广播', description: '是否代理 Service 广播', type: 'boolean' },
                    job: { title: '代理JobScheduler事件', description: '是否代理 JobScheduler 事件', type: 'boolean' },
                    broadcast: { title: '代理常规广播', description: '是否代理常规广播', type: 'boolean' },
                    proxyBCmax: { title: '最大代理广播数', description: '允许代理的最大广播数', type: 'number', unit: '条' }
                }
            },

            // 内存优化
            superFreezeConfig: {
                title: '内存优化',
                description: 'Super Freeze 相关设置',
                type: 'group',
                items: {
                    enable: { title: '启用Super Freeze', description: '是否启用 Super Freeze 机制', type: 'boolean' }
                }
            },

            // CPU管控
            cpuCtlRus: {
                title: 'CPU管控',
                description: 'CPU 使用率阈值及采集配置',
                type: 'group',
                items: {
                    shortCommCpuRateCtl: { title: '短期通信CPU阈值', description: '短期通信CPU使用率阈值(%)', type: 'number', unit: '%' },
                    longCommCpuRateCtl: { title: '长期通信CPU阈值', description: '长期通信CPU使用率阈值(%)', type: 'number', unit: '%' },
                    shortSysCpuRateCtl: { title: '短期系统CPU阈值', description: '短期系统CPU使用率阈值(% * 核心数)', type: 'number', unit: '%' },
                    collectCpuInfoCycle: { title: 'CPU信息收集周期', description: 'CPU信息收集周期(毫秒)', type: 'number', unit: '毫秒' },
                    cpuCollectEnable: { title: '启用CPU信息收集', description: '是否启用CPU信息收集', type: 'boolean' }
                }
            },

            // 特殊场景规则
            restrictNet: {
                title: '游戏网络限制',
                description: '针对特定应用类型在场景中限制网络',
                type: 'group',
                items: {
                    appTypeValue: { title: '应用类型值', description: '如4代表游戏', type: 'number' },
                    delayTime: { title: '限制延迟', description: '延迟执行限制的时间', type: 'number', unit: '毫秒' }
                }
            },
            thermalMode: {
                title: '高温模式',
                description: '设备温度触发的性能/功耗策略',
                type: 'group',
                items: {
                    enable: { title: '启用高温模式', description: '是否启用高温模式策略', type: 'boolean' },
                    enterLevel: { title: '进入温度等级', description: '达到该温度等级时进入高温模式', type: 'number' },
                    exitLevel: { title: '退出温度等级', description: '降至该温度等级时退出高温模式', type: 'number' }
                }
            }
        };
    }

    /**
     * 根据路径更新配置值
     * @param {Object} config - 配置对象
     * @param {string} path - 配置路径
     * @param {*} value - 新值
     */
    updateValue(config, path, value) {
        try {
            const parts = path.split('.');
            let current = config;

            // 导航到目标位置
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];

                if (current.children) {
                    let child = current.children.find(c => c.tagName === part);
                    if (!child) {
                        // 创建新的配置节点
                        child = {
                            tagName: part,
                            attributes: {},
                            children: [],
                            textContent: ''
                        };
                        current.children.push(child);
                    }
                    current = child;
                } else {
                    throw new Error(`无效的配置路径: ${path}`);
                }
            }

            // 设置最终值
            const lastPart = parts[parts.length - 1];
            if (current.attributes) {
                current.attributes[lastPart] = String(value);
                console.log(`配置已更新: ${path} = ${value}`);
            } else {
                throw new Error(`无法设置配置值: ${path}`);
            }

        } catch (error) {
            console.error('更新配置值失败:', error);
            throw error;
        }
    }

    /**
     * 根据路径获取配置值
     * @param {Object} config - 配置对象
     * @param {string} path - 配置路径
     * @returns {*} 配置值
     */
    getValue(config, path) {
        try {
            const parts = path.split('.');
            let current = config;

            for (const part of parts) {
                if (current.children) {
                    const child = current.children.find(c => c.tagName === part);
                    if (child) {
                        current = child;
                    } else if (current.attributes && current.attributes[part] !== undefined) {
                        return current.attributes[part];
                    } else {
                        return undefined;
                    }
                } else if (current.attributes && current.attributes[part] !== undefined) {
                    return current.attributes[part];
                } else {
                    return undefined;
                }
            }

            return current;

        } catch (error) {
            console.error('获取配置值失败:', error);
            return undefined;
        }
    }

    /**
     * 获取配置项定义
     * @param {string} section - 配置节名称
     * @returns {Object} 配置项定义
     */
    getConfigDefinition(section) {
        return this.configDefinitions[section] || null;
    }

    /**
     * 获取所有配置节
     * @returns {Array} 配置节列表
     */
    getAllSections() {
        return Object.keys(this.configDefinitions);
    }

    /**
     * 验证配置值
     * @param {string} section - 配置节
     * @param {string} key - 配置键
     * @param {*} value - 配置值
     * @returns {Object} 验证结果
     */
    validateValue(section, key, value) {
        const definition = this.configDefinitions[section];
        if (!definition || !definition.items || !definition.items[key]) {
            return { isValid: false, error: '未知的配置项' };
        }

        const itemDef = definition.items[key];

        switch (itemDef.type) {
            case 'boolean':
                if (value !== 'true' && value !== 'false') {
                    return { isValid: false, error: '值必须是true或false' };
                }
                break;

            case 'number':
                if (isNaN(parseFloat(value))) {
                    return { isValid: false, error: '值必须是数字' };
                }
                break;

            case 'string':
                if (typeof value !== 'string') {
                    return { isValid: false, error: '值必须是字符串' };
                }
                break;
        }

        return { isValid: true };
    }
}