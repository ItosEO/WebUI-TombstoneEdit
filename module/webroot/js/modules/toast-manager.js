/**
 * Toast通知管理器
 * 负责显示各种类型的通知消息
 */

export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.autoCloseDelay = 5000; // 5秒自动关闭
        this.maxToasts = 5; // 最大同时显示的Toast数量
        
        this.initializeContainer();
    }

    /**
     * 初始化Toast容器
     */
    initializeContainer() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            console.warn('Toast容器未找到');
        }
    }

    /**
     * 显示成功消息
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showSuccess(title, message, duration = this.autoCloseDelay) {
        this.showToast('success', title, message, duration);
    }

    /**
     * 显示错误消息
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showError(title, message, duration = this.autoCloseDelay * 2) {
        this.showToast('error', title, message, duration);
    }

    /**
     * 显示警告消息
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showWarning(title, message, duration = this.autoCloseDelay) {
        this.showToast('warning', title, message, duration);
    }

    /**
     * 显示信息消息
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showInfo(title, message, duration = this.autoCloseDelay) {
        this.showToast('info', title, message, duration);
    }

    /**
     * 显示Toast通知
     * @param {string} type - 类型（success, error, warning, info）
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showToast(type, title, message, duration = this.autoCloseDelay) {
        if (!this.container) {
            console.warn('Toast容器未初始化');
            return;
        }

        // 检查是否超过最大数量
        if (this.toasts.size >= this.maxToasts) {
            // 移除最旧的Toast
            const oldestId = this.toasts.keys().next().value;
            this.removeToast(oldestId);
        }

        // 生成唯一ID
        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 创建Toast元素
        const toastElement = this.createToastElement(toastId, type, title, message);

        // 添加到容器
        this.container.appendChild(toastElement);

        // 记录Toast
        this.toasts.set(toastId, {
            element: toastElement,
            type,
            title,
            message,
            createdAt: Date.now()
        });

        // 触发动画
        setTimeout(() => {
            toastElement.classList.add('toast-show');
        }, 10);

        // 设置自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toastId);
            }, duration);
        }

        // 添加点击关闭事件
        const closeButton = toastElement.querySelector('.toast-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.removeToast(toastId);
            });
        }

        console.log(`Toast显示: [${type.toUpperCase()}] ${title} - ${message}`);
        return toastId;
    }

    /**
     * 创建Toast元素
     * @param {string} id - Toast ID
     * @param {string} type - 类型
     * @param {string} title - 标题
     * @param {string} message - 消息
     * @returns {HTMLElement} Toast元素
     */
    createToastElement(id, type, title, message) {
        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast toast-${type}`;

        // 选择图标
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const icon = icons[type] || icons.info;

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-body">
                    <div class="toast-title">${this.escapeHtml(title)}</div>
                    <div class="toast-message">${this.escapeHtml(message)}</div>
                </div>
                <button class="toast-close" type="button" aria-label="关闭">×</button>
            </div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;

        return toast;
    }

    /**
     * 移除Toast
     * @param {string} toastId - Toast ID
     */
    removeToast(toastId) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) {
            return;
        }

        const element = toastData.element;
        
        // 添加移除动画
        element.classList.add('toast-removing');
        
        // 动画完成后移除元素
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.toasts.delete(toastId);
        }, 300);
    }

    /**
     * 清除所有Toast
     */
    clearAll() {
        const toastIds = Array.from(this.toasts.keys());
        toastIds.forEach(id => this.removeToast(id));
    }

    /**
     * 清除指定类型的Toast
     * @param {string} type - Toast类型
     */
    clearByType(type) {
        const toastIds = Array.from(this.toasts.entries())
            .filter(([id, data]) => data.type === type)
            .map(([id, data]) => id);
        
        toastIds.forEach(id => this.removeToast(id));
    }

    /**
     * 获取当前Toast数量
     * @returns {number} Toast数量
     */
    getToastCount() {
        return this.toasts.size;
    }

    /**
     * 获取指定类型的Toast数量
     * @param {string} type - Toast类型
     * @returns {number} Toast数量
     */
    getToastCountByType(type) {
        return Array.from(this.toasts.values())
            .filter(data => data.type === type).length;
    }

    /**
     * 设置最大Toast数量
     * @param {number} max - 最大数量
     */
    setMaxToasts(max) {
        this.maxToasts = Math.max(1, max);
        
        // 如果当前数量超过新的最大值，移除多余的
        while (this.toasts.size > this.maxToasts) {
            const oldestId = this.toasts.keys().next().value;
            this.removeToast(oldestId);
        }
    }

    /**
     * 设置自动关闭延迟
     * @param {number} delay - 延迟时间（毫秒）
     */
    setAutoCloseDelay(delay) {
        this.autoCloseDelay = Math.max(1000, delay);
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

    /**
     * 显示加载Toast
     * @param {string} message - 加载消息
     * @returns {string} Toast ID
     */
    showLoading(message = '正在处理...') {
        const toastId = `loading-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'toast toast-loading';

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <div class="loading-spinner-small"></div>
                </div>
                <div class="toast-body">
                    <div class="toast-message">${this.escapeHtml(message)}</div>
                </div>
            </div>
        `;

        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        this.toasts.set(toastId, {
            element: toast,
            type: 'loading',
            title: '',
            message,
            createdAt: Date.now()
        });

        return toastId;
    }

    /**
     * 更新加载Toast消息
     * @param {string} toastId - Toast ID
     * @param {string} message - 新消息
     */
    updateLoadingMessage(toastId, message) {
        const toastData = this.toasts.get(toastId);
        if (toastData && toastData.type === 'loading') {
            const messageElement = toastData.element.querySelector('.toast-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }

    /**
     * 显示操作结果Toast
     * @param {boolean} success - 是否成功
     * @param {string} successMessage - 成功消息
     * @param {string} errorMessage - 失败消息
     * @param {string} loadingToastId - 要替换的加载Toast ID
     */
    showResult(success, successMessage, errorMessage, loadingToastId = null) {
        // 移除加载Toast
        if (loadingToastId) {
            this.removeToast(loadingToastId);
        }

        // 显示结果Toast
        if (success) {
            this.showSuccess('操作成功', successMessage);
        } else {
            this.showError('操作失败', errorMessage);
        }
    }
}
