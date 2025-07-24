/**
 * 模态对话框管理器
 * 负责显示各种类型的模态对话框
 */

export class ModalManager {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.isOpen = false;
        this.currentResolve = null;
        
        this.initializeModal();
        this.bindEvents();
    }

    /**
     * 初始化模态对话框
     */
    initializeModal() {
        this.overlay = document.getElementById('modal-overlay');
        this.modal = this.overlay?.querySelector('.modal');
        
        if (!this.overlay || !this.modal) {
            console.warn('模态对话框元素未找到');
        }
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        if (!this.overlay) return;

        // 点击遮罩层关闭
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close(false);
            }
        });

        // 关闭按钮
        const closeButton = document.getElementById('modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close(false);
            });
        }

        // 取消按钮
        const cancelButton = document.getElementById('modal-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.close(false);
            });
        }

        // 确认按钮
        const confirmButton = document.getElementById('modal-confirm');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                this.close(true);
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close(false);
            }
        });
    }

    /**
     * 显示确认对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {string} confirmText - 确认按钮文本
     * @param {string} type - 对话框类型（info, warning, danger）
     * @returns {Promise<boolean>} 用户选择结果
     */
    showConfirm(title, message, confirmText = '确认', type = 'info') {
        return new Promise((resolve) => {
            if (this.isOpen) {
                resolve(false);
                return;
            }

            this.currentResolve = resolve;
            this.updateContent(title, message, confirmText, type);
            this.open();
        });
    }

    /**
     * 显示信息对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {string} buttonText - 按钮文本
     * @returns {Promise<boolean>} 用户确认结果
     */
    showInfo(title, message, buttonText = '确定') {
        return this.showConfirm(title, message, buttonText, 'info');
    }

    /**
     * 显示警告对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {string} confirmText - 确认按钮文本
     * @returns {Promise<boolean>} 用户选择结果
     */
    showWarning(title, message, confirmText = '继续') {
        return this.showConfirm(title, message, confirmText, 'warning');
    }

    /**
     * 显示危险操作确认对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {string} confirmText - 确认按钮文本
     * @returns {Promise<boolean>} 用户选择结果
     */
    showDanger(title, message, confirmText = '删除') {
        return this.showConfirm(title, message, confirmText, 'danger');
    }

    /**
     * 显示自定义对话框
     * @param {Object} options - 对话框选项
     * @returns {Promise<boolean>} 用户选择结果
     */
    showCustom(options) {
        const {
            title = '确认',
            message = '',
            confirmText = '确认',
            cancelText = '取消',
            type = 'info',
            showCancel = true,
            html = null
        } = options;

        return new Promise((resolve) => {
            if (this.isOpen) {
                resolve(false);
                return;
            }

            this.currentResolve = resolve;
            this.updateContent(title, html || message, confirmText, type, cancelText, showCancel);
            this.open();
        });
    }

    /**
     * 更新对话框内容
     * @param {string} title - 标题
     * @param {string} content - 内容
     * @param {string} confirmText - 确认按钮文本
     * @param {string} type - 类型
     * @param {string} cancelText - 取消按钮文本
     * @param {boolean} showCancel - 是否显示取消按钮
     */
    updateContent(title, content, confirmText, type, cancelText = '取消', showCancel = true) {
        if (!this.modal) return;

        // 更新标题
        const titleElement = document.getElementById('modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }

        // 更新内容
        const messageElement = document.getElementById('modal-message');
        if (messageElement) {
            if (content.includes('<')) {
                messageElement.innerHTML = content;
            } else {
                messageElement.textContent = content;
            }
        }

        // 更新按钮
        const confirmButton = document.getElementById('modal-confirm');
        const cancelButton = document.getElementById('modal-cancel');

        if (confirmButton) {
            confirmButton.textContent = confirmText;
            
            // 根据类型设置按钮样式
            confirmButton.className = 'btn';
            switch (type) {
                case 'warning':
                    confirmButton.classList.add('btn-warning');
                    break;
                case 'danger':
                    confirmButton.classList.add('btn-danger');
                    break;
                default:
                    confirmButton.classList.add('btn-primary');
            }
        }

        if (cancelButton) {
            cancelButton.textContent = cancelText;
            cancelButton.style.display = showCancel ? 'inline-flex' : 'none';
        }

        // 更新模态框样式
        this.modal.className = `modal modal-${type}`;
    }

    /**
     * 打开对话框
     */
    open() {
        if (!this.overlay || this.isOpen) return;

        this.isOpen = true;
        this.overlay.classList.remove('hidden');
        
        // 禁用页面滚动
        document.body.style.overflow = 'hidden';
        
        // 聚焦到确认按钮
        setTimeout(() => {
            const confirmButton = document.getElementById('modal-confirm');
            if (confirmButton) {
                confirmButton.focus();
            }
        }, 100);

        console.log('模态对话框已打开');
    }

    /**
     * 关闭对话框
     * @param {boolean} result - 用户选择结果
     */
    close(result = false) {
        if (!this.overlay || !this.isOpen) return;

        this.isOpen = false;
        this.overlay.classList.add('hidden');
        
        // 恢复页面滚动
        document.body.style.overflow = '';

        // 解析Promise
        if (this.currentResolve) {
            this.currentResolve(result);
            this.currentResolve = null;
        }

        console.log(`模态对话框已关闭，结果: ${result}`);
    }

    /**
     * 显示输入对话框
     * @param {string} title - 标题
     * @param {string} message - 消息
     * @param {string} defaultValue - 默认值
     * @param {string} placeholder - 占位符
     * @returns {Promise<string|null>} 用户输入的值或null
     */
    showInput(title, message, defaultValue = '', placeholder = '') {
        return new Promise((resolve) => {
            if (this.isOpen) {
                resolve(null);
                return;
            }

            const inputHtml = `
                <p>${this.escapeHtml(message)}</p>
                <div class="form-group">
                    <input type="text" id="modal-input" class="form-input" 
                           value="${this.escapeHtml(defaultValue)}" 
                           placeholder="${this.escapeHtml(placeholder)}">
                </div>
            `;

            this.currentResolve = (confirmed) => {
                if (confirmed) {
                    const input = document.getElementById('modal-input');
                    resolve(input ? input.value : null);
                } else {
                    resolve(null);
                }
            };

            this.updateContent(title, inputHtml, '确定', 'info');
            this.open();

            // 聚焦到输入框
            setTimeout(() => {
                const input = document.getElementById('modal-input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
        });
    }

    /**
     * 显示选择对话框
     * @param {string} title - 标题
     * @param {string} message - 消息
     * @param {Array} options - 选项数组
     * @returns {Promise<string|null>} 用户选择的值或null
     */
    showSelect(title, message, options) {
        return new Promise((resolve) => {
            if (this.isOpen) {
                resolve(null);
                return;
            }

            const optionsHtml = options.map((option, index) => {
                const value = typeof option === 'object' ? option.value : option;
                const label = typeof option === 'object' ? option.label : option;
                return `<option value="${this.escapeHtml(value)}">${this.escapeHtml(label)}</option>`;
            }).join('');

            const selectHtml = `
                <p>${this.escapeHtml(message)}</p>
                <div class="form-group">
                    <select id="modal-select" class="form-input form-select">
                        ${optionsHtml}
                    </select>
                </div>
            `;

            this.currentResolve = (confirmed) => {
                if (confirmed) {
                    const select = document.getElementById('modal-select');
                    resolve(select ? select.value : null);
                } else {
                    resolve(null);
                }
            };

            this.updateContent(title, selectHtml, '确定', 'info');
            this.open();

            // 聚焦到选择框
            setTimeout(() => {
                const select = document.getElementById('modal-select');
                if (select) {
                    select.focus();
                }
            }, 100);
        });
    }

    /**
     * 检查对话框是否打开
     * @returns {boolean} 是否打开
     */
    isModalOpen() {
        return this.isOpen;
    }

    /**
     * 强制关闭对话框
     */
    forceClose() {
        this.close(false);
    }

    /**
     * 转义HTML字符
     * @param {string} text - 原始文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
