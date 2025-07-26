# 日志系统使用指南

本指南介绍了如何在 **ColorOS 墓碑配置编辑器** 前端代码中调用日志系统，以及常见的日志维护操作。

## 1. 模块位置

- 源码路径：`src/js/modules/logger.js`
- 默认日志文件：`/cache/webui_tombstone.log`

日志系统依赖 KernelSU 提供的 `exec` 接口，以 **root** 权限在系统分区写入日志文件，因此请确保运行环境已正确集成 KernelSU。

## 2. 快速开始

```javascript
import { log } from './modules/logger.js';

// 输出普通信息
log.info('配置加载完成');

// 输出警告信息
log.warn('即将覆盖现有配置文件');

// 输出错误信息
try {
  await parseConfig(xml);
} catch (err) {
  log.error('解析失败', err);
}

// 输出调试信息
log.debug('当前状态', stateObject);
```

所有日志同时写入文件并打印到浏览器控制台，便于开发调试。

## 3. 高级功能

### 3.1 操作日志

用于记录用户关键操作，便于后续审计或问题定位。

```javascript
log.operation('导入配置', { 文件名: 'sys_elsa_config_list.xml', 条目数: 420 });
```

### 3.2 性能日志

用于性能分析，可记录某段代码的耗时。

```javascript
const start = performance.now();
// ... 待测代码 ...
log.performance('XML 解析', performance.now() - start);
```

### 4.2 清空日志文件

```javascript
await logger.clearLog();
```


> 如发现文档错误或遗漏，请在 `doc/` 目录提交 Pull Request 进行修正。 