/**
 * 白名单/黑名单管理器模块
 * 负责管理各种类型的白名单和黑名单配置
 */

import { log } from './logger.js';

export class WhitelistManager {
    constructor(configManager, xmlParser, toastManager, modalManager) {
        this.configManager = configManager;
        this.xmlParser = xmlParser;
        this.toastManager = toastManager;
        this.modalManager = modalManager;
        
        // 白名单/黑名单类型定义
        this.listTypes = {
            // 基础白名单
            whitePkg: {
                name: '应用白名单',
                description: '加入白名单的应用将获得更宽松的冻结策略',
                tagName: 'whitePkg',
                attributes: ['name', 'category'],
                categories: {
                    '100': '强制白名单',
                    '010': 'OPPO/OnePlus白名单', 
                    '001': '第三方白名单'
                }
            },
            
            // 快速冻结白名单/黑名单
            ffPkg: {
                name: '快速冻结列表',
                description: '控制应用是否参与快速冻结机制',
                tagName: 'ffPkg',
                attributes: ['type', 'pkg'],
                types: {
                    'white': '白名单(允许快速冻结)',
                    'black': '黑名单(跳过快速冻结)',
                    'skipAppSwitch': '跳过应用切换检查'
                }
            },
            
            // 系统黑名单
            SysBlack: {
                name: '系统应用黑名单',
                description: '对系统应用进行限制的黑名单配置',
                tagName: 'SysBlack',
                attributes: ['name', 'version', 'scene', 'mask']
            },
            
            // 闹钟白名单/黑名单
            alarm: {
                name: '闹钟管理列表',
                description: '控制应用闹钟权限的白名单/黑名单',
                tagName: 'alarm',
                attributes: ['type', 'pkg', 'action'],
                types: {
                    'white': '白名单(允许闹钟)',
                    'black': '黑名单(禁止闹钟)'
                }
            },
            
            // 广播白名单/黑名单
            cpnBroadcast: {
                name: '广播组件列表',
                description: '控制应用广播接收权限',
                tagName: 'cpnBroadcast',
                attributes: ['calling', 'type', 'pkg', 'action', 'scene'],
                types: {
                    'white': '白名单(允许广播)',
                    'black': '黑名单(禁止广播)'
                }
            },
            
            // 服务白名单/黑名单
            cpnService: {
                name: '服务组件列表',
                description: '控制应用服务调用权限',
                tagName: 'cpnService',
                attributes: ['calling', 'type', 'pkg', 'cpn', 'action'],
                types: {
                    'white': '白名单(允许服务)',
                    'black': '黑名单(禁止服务)'
                }
            },
            
            // 代理广播白名单/黑名单
            proxyBroadcast: {
                name: '代理广播列表',
                description: '控制广播代理机制的白名单/黑名单',
                tagName: 'proxyBroadcast',
                attributes: ['type', 'pkg', 'action'],
                types: {
                    'white': '白名单(不代理)',
                    'black': '黑名单(强制代理)',
                    'drop': '丢弃列表(直接丢弃)'
                }
            },
            
            // WakeLock代理列表
            proxyWL: {
                name: 'WakeLock代理列表',
                description: '控制WakeLock代理机制',
                tagName: 'wakelock',
                parentTag: 'proxyWL',
                attributes: ['type', 'tag', 'pkg', 'proxy', 'enable'],
                types: {
                    'white': '白名单(不代理)',
                    'black': '黑名单(禁止)',
                    'proxy': '代理(延迟处理)'
                }
            },
            
            // GPS代理列表
            proxyGps: {
                name: 'GPS代理列表',
                description: '控制GPS定位代理机制',
                tagName: 'item',
                parentTag: 'proxyGps',
                attributes: ['type', 'pkg', 'appType', 'recentUse', 'stillInterval'],
                types: {
                    'white': '白名单(不代理)',
                    'black': '黑名单(强制代理)',
                    'gray': '灰名单(条件代理)'
                }
            }
        };
    }

    /**
     * 获取指定类型的列表数据
     * @param {string} listType - 列表类型
     * @returns {Array} 列表项数组
     */
    getListItems(listType) {
        try {
            const typeConfig = this.listTypes[listType];
            if (!typeConfig) {
                throw new Error(`未知的列表类型: ${listType}`);
            }

            const config = this.configManager.getCurrentConfig();
            if (!config) {
                log.debug(`配置数据为空，返回空列表: ${listType}`);
                return [];
            }

            log.debug(`开始获取${listType}列表，配置类型:`, {
                hasParentTag: !!typeConfig.parentTag,
                tagName: typeConfig.tagName,
                parentTag: typeConfig.parentTag
            });

            let items = [];
            
            if (typeConfig.parentTag) {
                // 嵌套结构，如 proxyWL > wakelock
                const parentElements = this.xmlParser.findElementsByTagName(config, typeConfig.parentTag);
                parentElements.forEach(parent => {
                    const childElements = parent.children?.filter(child => 
                        child.tagName === typeConfig.tagName) || [];
                    items.push(...childElements);
                });
            } else {
                // 直接结构
                items = this.xmlParser.findElementsByTagName(config, typeConfig.tagName);
            }

            log.debug(`找到${items.length}个${listType}项目`);

            return items.map(item => {
                if (!item.attributes) {
                    log.warn(`项目缺少attributes属性:`, item);
                    item.attributes = {};
                }

                return {
                    id: this.generateItemId(item),
                    ...item.attributes,
                    _element: item // 保存原始元素引用
                };
            });

        } catch (error) {
            log.error(`获取${listType}列表失败:`, {
                error: error.message || error.toString(),
                stack: error.stack,
                listType,
                configExists: !!config
            });
            return [];
        }
    }

    /**
     * 添加列表项
     * @param {string} listType - 列表类型
     * @param {Object} itemData - 项目数据
     * @returns {boolean} 是否成功
     */
    async addListItem(listType, itemData) {
        log.debug(`开始添加${listType}项目`, itemData);

        try {
            const typeConfig = this.listTypes[listType];
            if (!typeConfig) {
                throw new Error(`未知的列表类型: ${listType}`);
            }

            log.debug(`使用配置:`, {
                tagName: typeConfig.tagName,
                parentTag: typeConfig.parentTag,
                attributes: typeConfig.attributes
            });

            const config = this.configManager.getCurrentConfig();
            if (!config) {
                throw new Error('配置数据未加载');
            }

            // 验证必需属性
            const missingAttrs = typeConfig.attributes.filter(attr =>
                !itemData.hasOwnProperty(attr) || itemData[attr] === '');

            if (missingAttrs.length > 0) {
                log.warn(`缺少必需属性:`, missingAttrs);
                throw new Error(`缺少必需属性: ${missingAttrs.join(', ')}`);
            }

            // 检查是否已存在
            if (this.isItemExists(listType, itemData)) {
                log.warn(`项目已存在:`, itemData);
                throw new Error('该项目已存在');
            }

            // 创建新元素
            const newElement = {
                tagName: typeConfig.tagName,
                attributes: {},
                children: [],
                textContent: ''
            };

            // 设置属性
            typeConfig.attributes.forEach(attr => {
                if (itemData[attr] !== undefined) {
                    newElement.attributes[attr] = String(itemData[attr]);
                }
            });

            log.debug(`创建的新元素:`, newElement);

            // 添加到配置中
            if (typeConfig.parentTag) {
                // 嵌套结构
                let parentElement = this.xmlParser.findElementsByTagName(config, typeConfig.parentTag)[0];
                if (!parentElement) {
                    log.debug(`创建父元素: ${typeConfig.parentTag}`);
                    // 创建父元素
                    parentElement = {
                        tagName: typeConfig.parentTag,
                        attributes: {},
                        children: [],
                        textContent: ''
                    };
                    config.children.push(parentElement);
                }
                parentElement.children.push(newElement);
                log.debug(`添加到父元素 ${typeConfig.parentTag} 中`);
            } else {
                // 直接结构
                config.children.push(newElement);
                log.debug(`直接添加到根配置中`);
            }

            await log.operation('添加列表项', {
                listType,
                item: itemData,
                elementCreated: newElement
            });

            log.info(`${listType}项目添加成功:`, itemData);
            return true;

        } catch (error) {
            log.error(`添加${listType}项目失败:`, {
                error: error.message,
                itemData,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 删除列表项
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @returns {boolean} 是否成功
     */
    async removeListItem(listType, itemId) {
        log.debug(`开始删除${listType}项目`, { itemId });

        try {
            const items = this.getListItems(listType);
            const item = items.find(i => i.id === itemId);

            if (!item) {
                log.warn(`要删除的项目不存在: ${itemId}`);
                throw new Error('项目不存在');
            }

            const config = this.configManager.getCurrentConfig();
            const typeConfig = this.listTypes[listType];

            if (!config) {
                throw new Error('配置数据未加载');
            }

            log.debug(`找到要删除的项目:`, {
                itemId,
                item: { ...item, _element: undefined }, // 排除_element避免循环引用
                typeConfig: {
                    tagName: typeConfig.tagName,
                    parentTag: typeConfig.parentTag
                }
            });

            let removedCount = 0;

            // 从配置中移除
            if (typeConfig.parentTag) {
                // 嵌套结构
                log.debug(`从嵌套结构中删除，父标签: ${typeConfig.parentTag}`);
                const parentElements = this.xmlParser.findElementsByTagName(config, typeConfig.parentTag);
                parentElements.forEach(parent => {
                    const beforeCount = parent.children?.length || 0;
                    parent.children = parent.children?.filter(child => {
                        const shouldRemove = child.tagName === typeConfig.tagName &&
                                           this.generateItemId(child) === itemId;
                        if (shouldRemove) removedCount++;
                        return !shouldRemove;
                    }) || [];
                    const afterCount = parent.children.length;
                    log.debug(`父元素子项数量变化: ${beforeCount} -> ${afterCount}`);
                });
            } else {
                // 直接结构
                log.debug(`从直接结构中删除`);
                const beforeCount = config.children.length;
                config.children = config.children.filter(child => {
                    const shouldRemove = child.tagName === typeConfig.tagName &&
                                       this.generateItemId(child) === itemId;
                    if (shouldRemove) removedCount++;
                    return !shouldRemove;
                });
                const afterCount = config.children.length;
                log.debug(`根配置子项数量变化: ${beforeCount} -> ${afterCount}`);
            }

            if (removedCount === 0) {
                log.warn(`未找到要删除的元素: ${itemId}`);
                throw new Error('未找到要删除的项目');
            }

            await log.operation('删除列表项', {
                listType,
                itemId,
                item: { ...item, _element: undefined },
                removedCount
            });

            log.info(`${listType}项目删除成功:`, { itemId, removedCount });
            return true;

        } catch (error) {
            log.error(`删除${listType}项目失败:`, {
                error: error.message,
                itemId,
                listType,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 更新列表项
     * @param {string} listType - 列表类型
     * @param {string} itemId - 项目ID
     * @param {Object} newData - 新数据
     * @returns {boolean} 是否成功
     */
    async updateListItem(listType, itemId, newData) {
        log.debug(`开始更新${listType}项目`, { itemId, newData });

        try {
            const items = this.getListItems(listType);
            const item = items.find(i => i.id === itemId);

            if (!item) {
                log.warn(`项目不存在: ${itemId}`);
                throw new Error('项目不存在');
            }

            const typeConfig = this.listTypes[listType];
            const oldData = { ...item };
            delete oldData._element;

            log.debug(`找到要更新的项目:`, oldData);

            // 更新属性
            typeConfig.attributes.forEach(attr => {
                if (newData[attr] !== undefined) {
                    const oldValue = item._element.attributes[attr];
                    const newValue = String(newData[attr]);

                    if (oldValue !== newValue) {
                        item._element.attributes[attr] = newValue;
                        log.debug(`更新属性 ${attr}: ${oldValue} -> ${newValue}`);
                    }
                }
            });

            await log.operation('更新列表项', {
                listType,
                itemId,
                oldData,
                newData,
                updatedElement: item._element
            });

            log.info(`${listType}项目更新成功:`, { itemId, newData });
            return true;

        } catch (error) {
            log.error(`更新${listType}项目失败:`, {
                error: error.message,
                itemId,
                newData,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 检查项目是否已存在
     * @param {string} listType - 列表类型
     * @param {Object} itemData - 项目数据
     * @returns {boolean} 是否存在
     */
    isItemExists(listType, itemData) {
        const items = this.getListItems(listType);
        const typeConfig = this.listTypes[listType];
        
        // 根据主要属性判断是否重复
        const keyAttrs = this.getKeyAttributes(listType);
        
        return items.some(item => 
            keyAttrs.every(attr => item[attr] === itemData[attr])
        );
    }

    /**
     * 获取用于判断重复的关键属性
     * @param {string} listType - 列表类型
     * @returns {Array} 关键属性数组
     */
    getKeyAttributes(listType) {
        const keyMap = {
            whitePkg: ['name'],
            ffPkg: ['type', 'pkg'],
            SysBlack: ['name'],
            alarm: ['type', 'pkg', 'action'],
            cpnBroadcast: ['type', 'pkg', 'action'],
            cpnService: ['type', 'pkg', 'cpn', 'action'],
            proxyBroadcast: ['type', 'pkg', 'action'],
            proxyWL: ['type', 'tag', 'pkg'],
            proxyGps: ['type', 'pkg', 'appType']
        };
        
        return keyMap[listType] || ['pkg'];
    }

    /**
     * 生成项目唯一ID
     * @param {Object} element - XML元素
     * @returns {string} 唯一ID
     */
    generateItemId(element) {
        const attrs = Object.entries(element.attributes || {})
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        return btoa(attrs).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    /**
     * 获取列表类型配置
     * @param {string} listType - 列表类型
     * @returns {Object} 类型配置
     */
    getListTypeConfig(listType) {
        return this.listTypes[listType];
    }

    /**
     * 获取所有支持的列表类型
     * @returns {Array} 列表类型数组
     */
    getSupportedListTypes() {
        return Object.keys(this.listTypes).map(key => ({
            key,
            ...this.listTypes[key]
        }));
    }


}
