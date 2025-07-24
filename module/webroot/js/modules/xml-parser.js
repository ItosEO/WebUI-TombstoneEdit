/**
 * XML解析器模块
 * 负责ColorOS墓碑配置文件的XML解析和序列化
 */

export class XMLParser {
    constructor() {
        this.parser = new DOMParser();
        this.serializer = new XMLSerializer();
    }

    /**
     * 解析XML字符串为配置对象
     * @param {string} xmlString - XML字符串
     * @returns {Object} 解析后的配置对象
     */
    parse(xmlString) {
        try {
            // 解析XML文档
            const xmlDoc = this.parser.parseFromString(xmlString, 'text/xml');
            
            // 检查解析错误
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error(`XML解析错误: ${parseError.textContent}`);
            }

            // 获取根节点
            const rootElement = xmlDoc.documentElement;
            if (!rootElement || rootElement.tagName !== 'filter-conf') {
                throw new Error('无效的配置文件格式，缺少filter-conf根节点');
            }

            // 解析配置数据
            const config = this.parseElement(rootElement);
            
            console.log('XML解析完成:', config);
            return config;

        } catch (error) {
            console.error('XML解析失败:', error);
            throw new Error(`XML解析失败: ${error.message}`);
        }
    }

    /**
     * 将配置对象序列化为XML字符串
     * @param {Object} config - 配置对象
     * @returns {string} XML字符串
     */
    serialize(config) {
        try {
            // 创建XML文档
            const xmlDoc = document.implementation.createDocument(null, 'filter-conf', null);
            const rootElement = xmlDoc.documentElement;

            // 构建XML结构
            this.buildElement(xmlDoc, rootElement, config);

            // 序列化为字符串
            let xmlString = this.serializer.serializeToString(xmlDoc);
            
            // 添加XML声明
            xmlString = '<?xml version="1.0" encoding="utf-8"?>\n' + xmlString;
            
            // 格式化XML
            xmlString = this.formatXML(xmlString);

            console.log('XML序列化完成');
            return xmlString;

        } catch (error) {
            console.error('XML序列化失败:', error);
            throw new Error(`XML序列化失败: ${error.message}`);
        }
    }

    /**
     * 递归解析XML元素
     * @param {Element} element - XML元素
     * @returns {Object} 解析后的对象
     */
    parseElement(element) {
        const result = {
            tagName: element.tagName,
            attributes: {},
            children: [],
            textContent: ''
        };

        // 解析属性
        for (const attr of element.attributes) {
            result.attributes[attr.name] = attr.value;
        }

        // 解析子节点
        for (const child of element.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                result.children.push(this.parseElement(child));
            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) {
                    result.textContent += text;
                }
            }
        }

        return result;
    }

    /**
     * 递归构建XML元素
     * @param {Document} xmlDoc - XML文档
     * @param {Element} parentElement - 父元素
     * @param {Object} config - 配置对象
     */
    buildElement(xmlDoc, parentElement, config) {
        // 设置属性
        if (config.attributes) {
            for (const [name, value] of Object.entries(config.attributes)) {
                parentElement.setAttribute(name, value);
            }
        }

        // 设置文本内容
        if (config.textContent) {
            parentElement.textContent = config.textContent;
        }

        // 添加子元素
        if (config.children && config.children.length > 0) {
            for (const child of config.children) {
                const childElement = xmlDoc.createElement(child.tagName);
                parentElement.appendChild(childElement);
                this.buildElement(xmlDoc, childElement, child);
            }
        }
    }

    /**
     * 格式化XML字符串
     * @param {string} xmlString - 原始XML字符串
     * @returns {string} 格式化后的XML字符串
     */
    formatXML(xmlString) {
        const formatted = [];
        const reg = /(>)(<)(\/*)/g;
        xmlString = xmlString.replace(reg, '$1\n$2$3');
        
        let pad = 0;
        xmlString.split('\n').forEach((line) => {
            let indent = 0;
            if (line.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (line.match(/^<\/\w/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            const padding = '    '.repeat(pad);
            formatted.push(padding + line);
            pad += indent;
        });

        return formatted.join('\n');
    }

    /**
     * 根据路径获取配置值
     * @param {Object} config - 配置对象
     * @param {string} path - 配置路径，如 "enableConfig.hansEnable"
     * @returns {*} 配置值
     */
    getValueByPath(config, path) {
        const parts = path.split('.');
        let current = config;

        for (const part of parts) {
            if (part.includes('[') && part.includes(']')) {
                // 处理数组索引，如 "children[0]"
                const [key, indexStr] = part.split('[');
                const index = parseInt(indexStr.replace(']', ''));
                current = current[key] && current[key][index];
            } else if (current && current.children) {
                // 在子元素中查找
                const child = current.children.find(c => c.tagName === part);
                if (child) {
                    current = child;
                } else if (current.attributes && current.attributes[part] !== undefined) {
                    // 在属性中查找
                    return current.attributes[part];
                } else {
                    return undefined;
                }
            } else if (current && current.attributes && current.attributes[part] !== undefined) {
                return current.attributes[part];
            } else {
                return undefined;
            }
        }

        return current;
    }

    /**
     * 根据路径设置配置值
     * @param {Object} config - 配置对象
     * @param {string} path - 配置路径
     * @param {*} value - 新值
     */
    setValueByPath(config, path, value) {
        const parts = path.split('.');
        let current = config;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            
            if (part.includes('[') && part.includes(']')) {
                // 处理数组索引
                const [key, indexStr] = part.split('[');
                const index = parseInt(indexStr.replace(']', ''));
                current = current[key] && current[key][index];
            } else if (current && current.children) {
                // 在子元素中查找
                let child = current.children.find(c => c.tagName === part);
                if (!child) {
                    // 创建新的子元素
                    child = {
                        tagName: part,
                        attributes: {},
                        children: [],
                        textContent: ''
                    };
                    current.children.push(child);
                }
                current = child;
            }
        }

        // 设置最终值
        const lastPart = parts[parts.length - 1];
        if (current && current.attributes !== undefined) {
            current.attributes[lastPart] = value;
        }
    }

    /**
     * 查找特定标签的所有元素
     * @param {Object} config - 配置对象
     * @param {string} tagName - 标签名
     * @returns {Array} 匹配的元素数组
     */
    findElementsByTagName(config, tagName) {
        const results = [];
        
        const search = (element) => {
            if (element.tagName === tagName) {
                results.push(element);
            }
            
            if (element.children) {
                element.children.forEach(search);
            }
        };
        
        search(config);
        return results;
    }

    /**
     * 验证XML结构
     * @param {Object} config - 配置对象
     * @returns {Object} 验证结果
     */
    validateStructure(config) {
        const errors = [];
        const warnings = [];

        // 检查根节点
        if (!config || config.tagName !== 'filter-conf') {
            errors.push('缺少有效的filter-conf根节点');
            return { isValid: false, errors, warnings };
        }

        // 检查必需的子节点
        const requiredElements = [
            'version',
            'filter-name',
            'enableConfig',
            'lcdOffConfig',
            'lcdOnConfig'
        ];

        for (const required of requiredElements) {
            const found = this.findElementsByTagName(config, required);
            if (found.length === 0) {
                warnings.push(`缺少推荐的配置节点: ${required}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}
