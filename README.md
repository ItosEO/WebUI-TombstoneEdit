# ColorOS墓碑配置编辑器

一个基于KernelSU模块的WebUI工具，用于编辑ColorOS系统的墓碑配置文件，支持XML解析、文件读写、配置验证和备份恢复等功能。

## 功能特性

### 🎯 核心功能
- **XML解析与序列化**：完整支持ColorOS墓碑配置文件的解析和生成
- **可视化配置编辑**：直观的Web界面，支持各种配置项的可视化编辑
- **实时验证**：配置项输入时的实时验证和错误提示
- **备份与恢复**：自动备份原配置，支持一键恢复
- **搜索功能**：快速搜索和定位配置项

### 🛡️ 安全机制
- **配置验证**：严格的配置项验证，防止无效配置
- **自动备份**：每次保存前自动创建备份
- **API检查**：确保KernelSU API正常可用
- **错误处理**：完善的错误处理和用户提示

### 📱 用户体验
- **响应式设计**：支持手机和平板设备
- **现代化UI**：Material Design风格的用户界面
- **Toast通知**：操作结果的即时反馈
- **模态对话框**：重要操作的确认机制

## 系统要求

- **设备**：已Root的Android设备
- **系统**：ColorOS (基于Android)
- **框架**：KernelSU
- **权限**：Root权限

## 安装方法

### 1. 准备工作
确保你的设备已经安装并配置好KernelSU：
- 设备已获得Root权限
- 已安装KernelSU管理器
- KernelSU正常工作

### 2. 安装模块
1. 下载模块压缩包
2. 在KernelSU管理器中选择"安装模块"
3. 选择下载的压缩包进行安装
4. 重启设备使模块生效

### 3. 访问WebUI
1. 打开KernelSU管理器
2. 在模块列表中找到"ColorOS墓碑配置编辑器"
3. 点击模块名称或WebUI按钮
4. 在弹出的WebView中使用编辑器

## 使用指南

### 基础配置
编辑器将配置分为以下几个主要部分：

#### 1. 基础开关
- **全局墓碑机制**：控制整个墓碑系统的总开关
- **GMS应用优化**：针对Google服务的优化
- **音频/导航钩子**：减少应用唤醒的机制
- **WakeLock代理**：电源锁管理

#### 2. 屏幕状态策略
- **熄屏配置**：屏幕关闭时的冻结策略
- **亮屏配置**：屏幕开启时的应用状态管理
- **时间间隔设置**：各种检查和冻结的时间间隔

#### 3. 进程冻结规则
- **快速冻结**：快速冻结机制的配置
- **冻结超时**：不同应用的冻结超时设置
- **冻结数量限制**：单次冻结的应用数量控制

### 高级功能

#### 备份管理
- **自动备份**：每次保存配置时自动创建备份
- **手动备份**：可随时创建配置备份
- **备份恢复**：从备份列表中选择并恢复配置
- **备份清理**：自动清理过期的备份文件

#### 配置验证
- **实时验证**：输入时即时验证配置项
- **批量验证**：保存前的完整配置验证
- **错误提示**：详细的错误信息和修复建议

## 配置说明

### 重要配置项

#### enableConfig（基础开关）
```xml
<enableConfig 
    hansEnable="true"           <!-- 启用全局墓碑机制 -->
    gmsEnable="true"            <!-- GMS应用优化 -->
    skipToast="true"            <!-- 跳过Toast通知 -->
    audioByHook="true"          <!-- 音频钩子拦截 -->
    proxyWakeLockEnable="true"  <!-- WakeLock代理 -->
/>
```

#### lcdOffConfig（熄屏配置）
```xml
<lcdOffConfig 
    ffTotal="6"                 <!-- 每次冻结数量 -->
    ffInterval="10000"          <!-- 冻结间隔(毫秒) -->
    interval="60000"            <!-- 检查间隔(毫秒) -->
    idleEnable="true"           <!-- 空闲检测 -->
/>
```

#### ffConfig（快速冻结）
```xml
<ffConfig 
    enable="true"               <!-- 启用快速冻结 -->
    enterTimeout="100"          <!-- 进入超时(毫秒) -->
    maxFzNum="10"               <!-- 最大冻结数 -->
/>
```

## 故障排除

### 常见问题

#### 1. 无法加载配置文件
- **检查KernelSU**：确保KernelSU正常工作
- **检查文件路径**：确认配置文件存在于 `/data/oplus/os/bpm/sys_elsa_config_list.xml`
- **检查文件权限**：确保有读取权限

#### 2. 保存配置失败
- **检查磁盘空间**：确保有足够的存储空间
- **检查KernelSU API**：确保API正常工作
- **检查配置格式**：确保配置项格式正确

#### 3. 备份功能异常
- **检查备份目录**：确保 `/data/local/tmp/tombstone_backups` 目录可访问
- **检查存储空间**：确保有足够空间存储备份文件

### 日志查看
在浏览器开发者工具的控制台中可以查看详细的操作日志：
1. 在WebUI中按F12打开开发者工具
2. 切换到Console标签页
3. 查看相关的错误信息和调试日志

## 开发信息

### 技术栈
- **前端**：HTML5 + CSS3 + ES6 JavaScript
- **架构**：模块化设计，组件化开发
- **API**：KernelSU JavaScript API
- **样式**：CSS变量 + Flexbox布局

### 项目结构
```
module/
├── META-INF/           # 模块签名信息
├── module.prop         # 模块属性文件
├── customize.sh        # 安装脚本
└── webroot/           # WebUI资源
    ├── index.html     # 主页面
    ├── test.html      # 测试页面
    ├── styles/        # 样式文件
    │   ├── main.css
    │   └── components.css
    └── js/            # JavaScript模块
        ├── main.js
        └── modules/   # 功能模块
            ├── config-manager.js
            ├── file-manager.js
            ├── ui-manager.js
            ├── xml-parser.js
            ├── validation-manager.js
            ├── toast-manager.js
            ├── modal-manager.js
            ├── backup-manager.js
            └── kernelsu-api.js
```

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 免责声明

- 本工具仅供学习和研究使用
- 修改系统配置可能影响设备稳定性
- 使用前请务必备份重要数据
- 作者不承担因使用本工具造成的任何损失

## 致谢

- 感谢 KernelSU 项目提供的模块框架
- 感谢 @sky丶路人 提供的配置文件解析参考
- 感谢所有为ColorOS优化做出贡献的开发者
