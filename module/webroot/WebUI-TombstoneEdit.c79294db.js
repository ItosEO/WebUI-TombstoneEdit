var e={};const t=new class{constructor(){this.logFile="/cache/webui_tombstone.log",this.maxLogSize=1048576,this.isInitialized=!1,this.initializeLogFile()}async initializeLogFile(){try{await (0,e.exec)("mkdir -p /cache"),await this.rotateLogIfNeeded(),await this.writeToFile("=== WebUI Tombstone Editor Started ==="),await this.writeToFile(`\u{542F}\u{52A8}\u{65F6}\u{95F4}: ${new Date().toISOString()}`),this.isInitialized=!0}catch(e){console.error("日志系统初始化失败:",e)}}async rotateLogIfNeeded(){try{let t=await (0,e.exec)(`[ -f "${this.logFile}" ] && wc -c < "${this.logFile}" || echo 0`);parseInt(t.stdout?.trim()||"0")>this.maxLogSize&&(await (0,e.exec)(`tail -n 100 "${this.logFile}" > "${this.logFile}.tmp" && mv "${this.logFile}.tmp" "${this.logFile}"`),await this.writeToFile("=== 日志文件已轮转 ==="))}catch(e){}}async writeToFile(t){try{let i=new Date().toISOString(),a=`[${i}] ${t}`.replace(/'/g,"'\"'\"'");await (0,e.exec)(`echo '${a}' >> "${this.logFile}"`)}catch(e){console.error("写入日志文件失败:",e)}}async info(e,...t){let i=this.formatMessage("INFO",e,t);this.isInitialized&&await this.writeToFile(i),console.log(i)}async warn(e,...t){let i=this.formatMessage("WARN",e,t);this.isInitialized&&await this.writeToFile(i),console.warn(i)}async error(e,...t){let i=this.formatMessage("ERROR",e,t);this.isInitialized&&await this.writeToFile(i),console.error(i)}async debug(e,...t){let i=this.formatMessage("DEBUG",e,t);this.isInitialized&&await this.writeToFile(i),console.log(i)}formatMessage(e,t,i){let a=`[${e}] ${t}`;if(i&&i.length>0){let e=i.map(e=>{if("object"==typeof e)try{return JSON.stringify(e,null,2)}catch(e){}return String(e)}).join(" ");a+=` ${e}`}return a}async operation(e,t={}){let i=`\u{64CD}\u{4F5C}: ${e}`,a=Object.keys(t).length>0?` \u{8BE6}\u{60C5}: ${JSON.stringify(t)}`:"";await this.info(i+a)}async performance(e,t){await this.info(`\u{6027}\u{80FD}: ${e} \u{8017}\u{65F6} ${t}ms`)}async getLogContent(){try{let t=await (0,e.exec)(`cat "${this.logFile}"`);return 0===t.errno?t.stdout:""}catch(e){return await this.error("读取日志文件失败:",e),""}}async clearLog(){try{await (0,e.exec)(`> "${this.logFile}"`),await this.writeToFile("=== 日志已清空 ==="),await this.info("日志文件已清空")}catch(e){await this.error("清空日志文件失败:",e)}}},i=(...e)=>{t.info(...e).catch(console.error)},a=(...e)=>{t.warn(...e).catch(console.error)},n=(...e)=>{t.error(...e).catch(console.error)},s=(...e)=>{t.debug(...e).catch(console.error)},r=(e,i)=>{t.operation(e,i).catch(console.error)};class o{constructor(){this.configDefinitions=this.initializeConfigDefinitions(),this.currentConfig=null}initializeConfigDefinitions(){return{enableConfig:{title:"基础开关",description:"控制墓碑机制的基础功能开关",type:"group",items:{hansEnable:{title:"启用全局墓碑机制",description:"控制整个墓碑系统的总开关",type:"boolean"},gmsEnable:{title:"GMS应用优化",description:"对Google移动服务(GMS)应用启用优化",type:"boolean"},releaseStatistic:{title:"释放统计信息",description:"收集并释放统计信息",type:"boolean"},skipToast:{title:"跳过Toast通知",description:"冻结时跳过Toast通知避免唤醒",type:"boolean"},heatGameCloseNet:{title:"高温游戏断网",description:"高温时是否关闭游戏网络",type:"boolean"},dozeRestrictSwitch:{title:"Doze模式限制",description:"在Doze模式下启用限制开关",type:"boolean"},audioByHook:{title:"音频钩子拦截",description:"通过钩子拦截音频事件减少唤醒",type:"boolean"},navigationByHook:{title:"导航钩子拦截",description:"通过钩子拦截导航事件减少唤醒",type:"boolean"},audioCheckEnable:{title:"音频状态检查",description:"启用音频状态检查",type:"boolean"},proxyWakeLockEnable:{title:"WakeLock代理",description:"启用WakeLock代理机制",type:"boolean"},cgp_v2:{title:"CGP v2",description:"使用第二代CGP功耗策略",type:"boolean"},hansWatchDogEnable:{title:"墓碑看门狗",description:"启用墓碑看门狗监控",type:"boolean"},cpnCheckByHook:{title:"组件钩子检查",description:"通过钩子检查组件状态",type:"boolean"},restoreAlarm:{title:"恢复闹钟",description:"解冻时恢复闹钟功能",type:"boolean"},uidGoneRemoveAlarm:{title:"卸载移除闹钟",description:"应用卸载时移除关联闹钟",type:"boolean"},MStateTrimMemConfig:{title:"M状态内存压缩",description:"对M状态应用启用内存压缩",type:"boolean"}}},lcdOffConfig:{title:"熄屏配置",description:"屏幕关闭时的墓碑策略",type:"group",items:{ffTotal:{title:"每次冻结数量",description:"每次冻结的最大应用数",type:"number",unit:"个"},ffInterval:{title:"冻结间隔",description:"冻结尝试间隔时间",type:"number",unit:"毫秒"},interval:{title:"检查间隔",description:"常规检查间隔时间",type:"number",unit:"毫秒"},deepSleepFreezeWhite:{title:"深度睡眠冻结白名单",description:"深度睡眠时冻结白名单应用",type:"boolean"},gameCloseNet:{title:"游戏断网",description:"熄屏时是否关闭游戏网络",type:"boolean"},idleEnable:{title:"空闲检测",description:"启用空闲状态检测",type:"boolean"}}},lcdOnConfig:{title:"亮屏配置",description:"屏幕开启时的墓碑策略",type:"group",items:{RToM:{title:"Recent→M延迟",description:"Recent状态到M状态的冻结延迟",type:"number",unit:"毫秒"},MToF:{title:"M→Frozen延迟",description:"M状态到Frozen状态的冻结延迟",type:"number",unit:"毫秒"},checkImportance:{title:"重要性检查间隔",description:"应用重要性检查间隔",type:"number",unit:"毫秒"},gameCloseNet:{title:"游戏断网",description:"亮屏时是否关闭游戏网络",type:"boolean"}}},ffConfig:{title:"快速冻结配置",description:"快速冻结机制的相关设置",type:"group",items:{enable:{title:"启用快速冻结",description:"是否启用快速冻结功能",type:"boolean"},enterTimeout:{title:"进入超时",description:"进入冻结状态的超时时间",type:"number",unit:"毫秒"},interval:{title:"冻结周期",description:"快速冻结的执行周期",type:"number",unit:"毫秒"},maxFzNum:{title:"最大冻结数",description:"单批次最大冻结应用数量",type:"number",unit:"个"}}},proxyConfig:{title:"功耗代理设置",description:"控制 alarm/service/job/broadcast 等代理开关",type:"group",items:{alarm:{title:"代理Alarm广播",description:"是否代理 AlarmManager 广播",type:"boolean"},service:{title:"代理Service广播",description:"是否代理 Service 广播",type:"boolean"},job:{title:"代理JobScheduler事件",description:"是否代理 JobScheduler 事件",type:"boolean"},broadcast:{title:"代理常规广播",description:"是否代理常规广播",type:"boolean"},proxyBCmax:{title:"最大代理广播数",description:"允许代理的最大广播数",type:"number",unit:"条"}}},superFreezeConfig:{title:"内存优化",description:"Super Freeze 相关设置",type:"group",items:{enable:{title:"启用Super Freeze",description:"是否启用 Super Freeze 机制",type:"boolean"}}},cpuCtlRus:{title:"CPU管控",description:"CPU 使用率阈值及采集配置",type:"group",items:{shortCommCpuRateCtl:{title:"短期通信CPU阈值",description:"短期通信CPU使用率阈值(%)",type:"number",unit:"%"},longCommCpuRateCtl:{title:"长期通信CPU阈值",description:"长期通信CPU使用率阈值(%)",type:"number",unit:"%"},shortSysCpuRateCtl:{title:"短期系统CPU阈值",description:"短期系统CPU使用率阈值(% * 核心数)",type:"number",unit:"%"},collectCpuInfoCycle:{title:"CPU信息收集周期",description:"CPU信息收集周期(毫秒)",type:"number",unit:"毫秒"},cpuCollectEnable:{title:"启用CPU信息收集",description:"是否启用CPU信息收集",type:"boolean"}}},restrictNet:{title:"游戏网络限制",description:"针对特定应用类型在场景中限制网络",type:"group",items:{appTypeValue:{title:"应用类型值",description:"如4代表游戏",type:"number"},delayTime:{title:"限制延迟",description:"延迟执行限制的时间",type:"number",unit:"毫秒"}}},thermalMode:{title:"高温模式",description:"设备温度触发的性能/功耗策略",type:"group",items:{enable:{title:"启用高温模式",description:"是否启用高温模式策略",type:"boolean"},enterLevel:{title:"进入温度等级",description:"达到该温度等级时进入高温模式",type:"number"},exitLevel:{title:"退出温度等级",description:"降至该温度等级时退出高温模式",type:"number"}}}}}updateValue(e,t,i){try{let a=t.split("."),n=e;for(let e=0;e<a.length-1;e++){let i=a[e];if(n.children){let e=n.children.find(e=>e.tagName===i);e||(e={tagName:i,attributes:{},children:[],textContent:""},n.children.push(e)),n=e}else throw Error(`\u{65E0}\u{6548}\u{7684}\u{914D}\u{7F6E}\u{8DEF}\u{5F84}: ${t}`)}let r=a[a.length-1];if(n.attributes)n.attributes[r]=String(i),s(`\u{914D}\u{7F6E}\u{5DF2}\u{66F4}\u{65B0}: ${t} = ${i}`);else throw Error(`\u{65E0}\u{6CD5}\u{8BBE}\u{7F6E}\u{914D}\u{7F6E}\u{503C}: ${t}`)}catch(e){throw n("更新配置值失败:",e),e}}getValue(e,t){try{let i=t.split("."),a=e;for(let e of i)if(a.children){let t=a.children.find(t=>t.tagName===e);if(t)a=t;else if(a.attributes&&void 0!==a.attributes[e])return a.attributes[e];else return}else if(a.attributes&&void 0!==a.attributes[e])return a.attributes[e];else return;return a}catch(e){n("获取配置值失败:",e);return}}getConfigDefinition(e){return this.configDefinitions[e]||null}getAllSections(){return Object.keys(this.configDefinitions)}setCurrentConfig(e){this.currentConfig=e}getCurrentConfig(){return this.currentConfig}validateValue(e,t,i){let a=this.configDefinitions[e];if(!a||!a.items||!a.items[t])return{isValid:!1,error:"未知的配置项"};switch(a.items[t].type){case"boolean":if("true"!==i&&"false"!==i)return{isValid:!1,error:"值必须是true或false"};break;case"number":if(isNaN(parseFloat(i)))return{isValid:!1,error:"值必须是数字"};break;case"string":if("string"!=typeof i)return{isValid:!1,error:"值必须是字符串"}}return{isValid:!0}}}class l{constructor(){this.configPath="/data/oplus/os/bpm/sys_elsa_config_list.xml",this.backupPath="/data/local/tmp/sys_elsa_config_list.xml.bak",this.tempDir="/data/local/tmp/tombstone_temp",this.initializeDirectories()}async initializeDirectories(){try{await (0,e.exec)(`mkdir -p "${this.tempDir}"`),await (0,e.exec)(`chmod 755 "${this.tempDir}"`),await i("目录初始化完成")}catch(e){await a("目录初始化警告:",e.message)}}async checkAPIAvailable(){try{let t=await (0,e.exec)('echo "test"');return 0===t.errno}catch(e){return await n("KernelSU API检查失败:",e),!1}}async checkConfigFileExists(){try{let t=await (0,e.exec)(`test -f "${this.configPath}"`);return 0===t.errno}catch(e){return!1}}async readConfigFile(){try{if(!await this.checkConfigFileExists())throw Error(`\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{4E0D}\u{5B58}\u{5728}: ${this.configPath}`);let t=await (0,e.exec)(`cat "${this.configPath}"`);if(0!==t.errno)throw Error(`\u{8BFB}\u{53D6}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${t.stderr||"未知错误"}`);if(!t.stdout||0===t.stdout.trim().length)throw Error("配置文件为空");return await i("配置文件读取成功"),t.stdout}catch(e){throw await n("读取配置文件失败:",e),Error(`\u{8BFB}\u{53D6}\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${e.message}`)}}async writeConfigFile(t){try{if(!t||0===t.trim().length)throw Error("配置内容不能为空");let a=`${this.tempDir}/config_temp_${Date.now()}.xml`,n=t.replace(/'/g,"'\"'\"'"),s=await (0,e.exec)(`echo '${n}' > "${a}"`);if(0!==s.errno)throw Error(`\u{5199}\u{5165}\u{4E34}\u{65F6}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${s.stderr}`);let r=await (0,e.exec)(`test -f "${a}" && test -s "${a}"`);if(0!==r.errno)throw Error("临时文件验证失败");let o=await (0,e.exec)(`cp "${a}" "${this.configPath}"`);if(0!==o.errno)throw Error(`\u{590D}\u{5236}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${o.stderr}`);await (0,e.exec)(`chmod 644 "${this.configPath}"`),await (0,e.exec)(`chown system:system "${this.configPath}"`),await (0,e.exec)(`rm -f "${a}"`),await i("配置文件写入成功")}catch(e){throw await n("写入配置文件失败:",e),Error(`\u{5199}\u{5165}\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${e.message}`)}}async createBackup(){try{if(!await this.checkConfigFileExists())throw Error("原配置文件不存在，无法创建备份");let t=await (0,e.exec)(`cp "${this.configPath}" "${this.backupPath}"`);if(0!==t.errno)throw Error(`\u{521B}\u{5EFA}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${t.stderr}`);return await (0,e.exec)(`chmod 644 "${this.backupPath}"`),await i(`\u{5907}\u{4EFD}\u{521B}\u{5EFA}\u{6210}\u{529F}: ${this.backupPath}`),this.backupPath}catch(e){throw await n("创建备份失败:",e),Error(`\u{521B}\u{5EFA}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.message}`)}}async checkBackupExists(){try{let t=await (0,e.exec)(`test -f "${this.backupPath}"`);return 0===t.errno}catch(e){return!1}}async getBackupInfo(){try{if(!await this.checkBackupExists())return null;let t=await (0,e.exec)(`stat "${this.backupPath}"`);if(0!==t.errno)return null;let i=t.stdout,a=i.match(/Size:\s+(\d+)/),n=i.match(/Modify:\s+([^\n]+)/);return{path:this.backupPath,filename:"sys_elsa_config_list.xml.bak",size:a?parseInt(a[1]):0,lastModified:n?n[1].trim():"Unknown",exists:!0}}catch(e){return await n("获取备份信息失败:",e),null}}async restoreBackup(){try{if(!await this.checkBackupExists())throw Error("备份文件不存在");let t=await (0,e.exec)(`head -1 "${this.backupPath}"`);if(0!==t.errno||!t.stdout.includes("<?xml"))throw Error("备份文件格式无效");let a=await (0,e.exec)(`cp "${this.backupPath}" "${this.configPath}"`);if(0!==a.errno)throw Error(`\u{6062}\u{590D}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${a.stderr}`);await (0,e.exec)(`chmod 644 "${this.configPath}"`),await (0,e.exec)(`chown system:system "${this.configPath}"`),await i(`\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5DF2}\u{6062}\u{590D}: ${this.backupPath}`)}catch(e){throw await n("恢复备份失败:",e),Error(`\u{6062}\u{590D}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.message}`)}}async deleteBackup(){try{if(!await this.checkBackupExists())return void await i("备份文件不存在，无需删除");await (0,e.exec)(`rm -f "${this.backupPath}"`),await i("备份文件已删除")}catch(e){await a("删除备份文件时出现警告:",e.message)}}async getFileInfo(){try{if(!await this.checkConfigFileExists())return null;let t=await (0,e.exec)(`stat "${this.configPath}"`);if(0!==t.errno)throw Error("获取文件信息失败");let i=t.stdout,a=i.match(/Size:\s+(\d+)/),n=i.match(/Modify:\s+([^\n]+)/);return{path:this.configPath,size:a?parseInt(a[1]):0,lastModified:n?n[1].trim():"Unknown",exists:!0}}catch(e){return await n("获取文件信息失败:",e),null}}async validateFileIntegrity(t=null){try{let i=t||this.configPath,a=await (0,e.exec)(`test -f "${i}" && test -s "${i}"`);if(0!==a.errno)return!1;let n=await (0,e.exec)(`head -1 "${i}"`);if(0!==n.errno||!n.stdout.includes("<?xml"))return!1;return!0}catch(e){return await n("文件完整性验证失败:",e),!1}}}class u{constructor(){this.currentSection="basic",this.searchTerm="",this.configData=null,this.whitelistManager=null,this.configManager=null,this.toastManager=null,this.modalManager=null,this.bindEvents()}setDependencies(e){this.whitelistManager=e.whitelistManager,this.configManager=e.configManager,this.toastManager=e.toastManager,this.modalManager=e.modalManager}initializeUI(){this.setupNavigation(),this.setupSearch(),this.hideLoading()}setupNavigation(){document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let i=e.dataset.section;this.switchSection(i)})})}setupSearch(){let e=document.getElementById("search-input");e&&e.addEventListener("input",e=>{this.searchTerm=e.target.value.toLowerCase(),this.filterConfigItems()})}switchSection(e){document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("active")});let t=document.querySelector(`[data-section="${e}"]`);t&&t.classList.add("active"),this.currentSection=e,this.renderCurrentSection()}renderCurrentSection(){if(!this.configData)return;let e=document.getElementById("config-container");if(e){switch(this.currentSection){case"basic":this.renderBasicConfig(e);break;case"screen":this.renderScreenConfig(e);break;case"freeze":this.renderFreezeConfig(e);break;case"proxy":this.renderProxyConfig(e);break;case"memory":this.renderMemoryConfig(e);break;case"cpu":this.renderCpuConfig(e);break;case"special":this.renderSpecialConfig(e);break;case"whitelist":this.renderWhitelistConfig(e);break;case"blacklist":this.renderBlacklistConfig(e);break;default:e.innerHTML="<p>未知的配置节</p>"}e.classList.remove("hidden")}}renderBasicConfig(e){if(!this.findConfigElement("enableConfig")){e.innerHTML="<p>未找到基础配置数据</p>";return}e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{57FA}\u{7840}\u{5F00}\u{5173}\u{914D}\u{7F6E}</h2>
                <div class="config-items">
                    ${this.renderConfigItem("enableConfig","hansEnable","启用全局墓碑机制","控制整个墓碑系统的总开关","boolean")}
                    ${this.renderConfigItem("enableConfig","gmsEnable","GMS应用优化","对Google移动服务(GMS)应用启用优化","boolean")}
                    ${this.renderConfigItem("enableConfig","releaseStatistic","释放统计信息","收集并释放统计信息","boolean")}
                    ${this.renderConfigItem("enableConfig","skipToast","跳过Toast通知","冻结时跳过Toast通知避免唤醒","boolean")}
                    ${this.renderConfigItem("enableConfig","heatGameCloseNet","高温游戏断网","高温时是否关闭游戏网络","boolean")}
                    ${this.renderConfigItem("enableConfig","dozeRestrictSwitch","Doze模式限制","在Doze模式下启用限制开关","boolean")}
                    ${this.renderConfigItem("enableConfig","audioByHook","音频钩子拦截","通过钩子拦截音频事件减少唤醒","boolean")}
                    ${this.renderConfigItem("enableConfig","navigationByHook","导航钩子拦截","通过钩子拦截导航事件减少唤醒","boolean")}
                    ${this.renderConfigItem("enableConfig","audioCheckEnable","音频状态检查","启用音频状态检查","boolean")}
                    ${this.renderConfigItem("enableConfig","proxyWakeLockEnable","WakeLock代理","启用WakeLock代理机制","boolean")}
                    ${this.renderConfigItem("enableConfig","cgp_v2","CGP v2","使用第二代CGP功耗策略","boolean")}
                    ${this.renderConfigItem("enableConfig","hansWatchDogEnable","墓碑看门狗","启用墓碑看门狗监控","boolean")}
                    ${this.renderConfigItem("enableConfig","cpnCheckByHook","组件钩子检查","通过钩子检查组件状态","boolean")}
                    ${this.renderConfigItem("enableConfig","restoreAlarm","恢复闹钟","解冻时恢复闹钟功能","boolean")}
                    ${this.renderConfigItem("enableConfig","uidGoneRemoveAlarm","卸载移除闹钟","应用卸载时移除关联闹钟","boolean")}
                    ${this.renderConfigItem("enableConfig","MStateTrimMemConfig","M状态内存压缩","对M状态应用启用内存压缩","boolean")}
                </div>
            </div>
        `}renderScreenConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{5C4F}\u{5E55}\u{72B6}\u{6001}\u{7B56}\u{7565}</h2>
                
                <h3 class="config-subsection-title">\u{7184}\u{5C4F}\u{914D}\u{7F6E}</h3>
                <div class="config-items">
                    ${this.renderConfigItem("lcdOffConfig","ffTotal","每次冻结数量","每次冻结的最大应用数","number","个")}
                    ${this.renderConfigItem("lcdOffConfig","ffInterval","冻结间隔","冻结尝试间隔时间","number","毫秒")}
                    ${this.renderConfigItem("lcdOffConfig","interval","检查间隔","常规检查间隔时间","number","毫秒")}
                    ${this.renderConfigItem("lcdOffConfig","deepSleepFreezeWhite","深度睡眠冻结白名单","深度睡眠时冻结白名单应用","boolean")}
                    ${this.renderConfigItem("lcdOffConfig","gameCloseNet","游戏断网","熄屏时是否关闭游戏网络","boolean")}
                    ${this.renderConfigItem("lcdOffConfig","idleEnable","空闲检测","启用空闲状态检测","boolean")}
                </div>
                
                <h3 class="config-subsection-title">\u{4EAE}\u{5C4F}\u{914D}\u{7F6E}</h3>
                <div class="config-items">
                    ${this.renderConfigItem("lcdOnConfig","RToM","Recent→M延迟","Recent状态到M状态的冻结延迟","number","毫秒")}
                    ${this.renderConfigItem("lcdOnConfig","MToF","M→Frozen延迟","M状态到Frozen状态的冻结延迟","number","毫秒")}
                    ${this.renderConfigItem("lcdOnConfig","checkImportance","重要性检查间隔","应用重要性检查间隔","number","毫秒")}
                    ${this.renderConfigItem("lcdOnConfig","gameCloseNet","游戏断网","亮屏时是否关闭游戏网络","boolean")}
                </div>
            </div>
        `}renderFreezeConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{8FDB}\u{7A0B}\u{51BB}\u{7ED3}\u{89C4}\u{5219}</h2>
                
                <h3 class="config-subsection-title">\u{5FEB}\u{901F}\u{51BB}\u{7ED3}\u{914D}\u{7F6E}</h3>
                <div class="config-items">
                    ${this.renderConfigItem("ffConfig","enable","启用快速冻结","是否启用快速冻结功能","boolean")}
                    ${this.renderConfigItem("ffConfig","enterTimeout","进入超时","进入冻结状态的超时时间","number","毫秒")}
                    ${this.renderConfigItem("ffConfig","interval","冻结周期","快速冻结的执行周期","number","毫秒")}
                    ${this.renderConfigItem("ffConfig","maxFzNum","最大冻结数","单批次最大冻结应用数量","number","个")}
                </div>
            </div>
        `}renderProxyConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{529F}\u{8017}\u{4EE3}\u{7406}\u{673A}\u{5236}</h2>

                <!-- \u{5E7F}\u{64AD}\u{4EE3}\u{7406}\u{914D}\u{7F6E} -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">\u{5E7F}\u{64AD}\u{4EE3}\u{7406}\u{914D}\u{7F6E}</h3>
                    <div class="config-items">
                        ${this.renderConfigItem("proxyConfig","alarm","代理Alarm广播","是否代理 AlarmManager 广播","boolean")}
                        ${this.renderConfigItem("proxyConfig","service","代理Service广播","是否代理 Service 广播","boolean")}
                        ${this.renderConfigItem("proxyConfig","job","代理JobScheduler事件","是否代理 JobScheduler 事件","boolean")}
                        ${this.renderConfigItem("proxyConfig","broadcast","代理常规广播","是否代理普通广播","boolean")}
                        ${this.renderConfigItem("proxyConfig","proxyBCmax","最大代理广播数","允许代理的最大广播数","number","条")}
                    </div>
                </div>

                <!-- WakeLock\u{4EE3}\u{7406}\u{914D}\u{7F6E} -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">WakeLock\u{4EE3}\u{7406}\u{914D}\u{7F6E}</h3>
                    <div class="config-items">
                        <div class="config-item">
                            <div class="config-item-info">
                                <div class="config-item-title">WakeLock\u{4EE3}\u{7406}\u{89C4}\u{5219}</div>
                                <div class="config-item-description">\u{914D}\u{7F6E}WakeLock\u{7684}\u{4EE3}\u{7406}\u{89C4}\u{5219}\u{FF0C}\u{652F}\u{6301}\u{6309}\u{6807}\u{7B7E}\u{548C}\u{5305}\u{540D}\u{8FC7}\u{6EE4}</div>
                            </div>
                            <div class="config-item-control">
                                <button class="btn btn-secondary" onclick="uiManager.showWakeLockEditor()">
                                    <span class="icon">\u{2699}\u{FE0F}</span>
                                    \u{914D}\u{7F6E}\u{89C4}\u{5219}
                                </button>
                            </div>
                        </div>
                        ${this.renderWakeLockRules()}
                    </div>
                </div>

                <!-- GPS\u{4EE3}\u{7406}\u{914D}\u{7F6E} -->
                <div class="config-subsection">
                    <h3 class="config-subsection-title">GPS\u{4EE3}\u{7406}\u{914D}\u{7F6E}</h3>
                    <div class="config-items">
                        <div class="config-item">
                            <div class="config-item-info">
                                <div class="config-item-title">GPS\u{4EE3}\u{7406}\u{89C4}\u{5219}</div>
                                <div class="config-item-description">\u{914D}\u{7F6E}GPS\u{4F4D}\u{7F6E}\u{670D}\u{52A1}\u{7684}\u{4EE3}\u{7406}\u{89C4}\u{5219}\u{FF0C}\u{652F}\u{6301}\u{5E94}\u{7528}\u{7C7B}\u{578B}\u{548C}\u{4F7F}\u{7528}\u{65F6}\u{95F4}\u{8FC7}\u{6EE4}</div>
                            </div>
                            <div class="config-item-control">
                                <button class="btn btn-secondary" onclick="uiManager.showGpsEditor()">
                                    <span class="icon">\u{1F4CD}</span>
                                    \u{914D}\u{7F6E}\u{89C4}\u{5219}
                                </button>
                            </div>
                        </div>
                        ${this.renderGpsRules()}
                    </div>
                </div>
            </div>
        `}renderWakeLockRules(){let e=this.findConfigElement("proxyWL");if(!e||!e.children)return'<div class="config-item-description">暂无WakeLock代理规则</div>';let t="";return e.children.forEach((e,i)=>{if("wakelock"===e.tagName){let a=e.attributes.type||"",n=e.attributes.tag||"",s=e.attributes.pkg||"",r=e.attributes.proxy||"",o=e.attributes.enable||"true";t+=`
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">\u{89C4}\u{5219} ${i+1}: ${a}</div>
                            <div class="rule-details">
                                <span class="rule-tag">\u{6807}\u{7B7E}: ${n}</span>
                                <span class="rule-pkg">\u{5305}\u{540D}: ${s}</span>
                                <span class="rule-proxy">\u{4EE3}\u{7406}\u{7EA7}\u{522B}: ${r}</span>
                                <span class="rule-status ${"true"===o?"enabled":"disabled"}">
                                    ${"true"===o?"启用":"禁用"}
                                </span>
                            </div>
                        </div>
                        <div class="rule-actions">
                            <button class="btn btn-sm btn-secondary" onclick="uiManager.editWakeLockRule(${i})">\u{7F16}\u{8F91}</button>
                            <button class="btn btn-sm btn-danger" onclick="uiManager.deleteWakeLockRule(${i})">\u{5220}\u{9664}</button>
                        </div>
                    </div>
                `}}),t||'<div class="config-item-description">暂无WakeLock代理规则</div>'}renderGpsRules(){let e=this.findConfigElement("proxyGps");if(!e||!e.children)return'<div class="config-item-description">暂无GPS代理规则</div>';let t="";return e.children.forEach((e,i)=>{if("item"===e.tagName){let a=e.attributes.type||"",n=e.attributes.appType||"",s=e.attributes.recentUse||"",r=e.attributes.stillInterval||"";t+=`
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">\u{89C4}\u{5219} ${i+1}: ${a}</div>
                            <div class="rule-details">
                                <span class="rule-tag">\u{5E94}\u{7528}\u{7C7B}\u{578B}: ${n}</span>
                                <span class="rule-pkg">\u{6700}\u{8FD1}\u{4F7F}\u{7528}: ${s}\u{5206}\u{949F}</span>
                                <span class="rule-proxy">\u{9759}\u{6B62}\u{95F4}\u{9694}: ${r}\u{5206}\u{949F}</span>
                            </div>
                        </div>
                        <div class="rule-actions">
                            <button class="btn btn-sm btn-secondary" onclick="uiManager.editGpsRule(${i})">\u{7F16}\u{8F91}</button>
                            <button class="btn btn-sm btn-danger" onclick="uiManager.deleteGpsRule(${i})">\u{5220}\u{9664}</button>
                        </div>
                    </div>
                `}}),t||'<div class="config-item-description">暂无GPS代理规则</div>'}renderMemoryConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{5185}\u{5B58}\u{4F18}\u{5316}</h2>
                <div class="config-items">
                    ${this.renderConfigItem("superFreezeConfig","enable","启用Super Freeze","是否启用 Super Freeze 机制","boolean")}
                </div>
                <p class="config-item-description">\u{26A0}\u{FE0F} \u{590D}\u{6742}\u{5B50}\u{9879}(\u{5982} trimMemUFZConfig) \u{6682}\u{672A}\u{652F}\u{6301}\u{56FE}\u{5F62}\u{5316}\u{7F16}\u{8F91}\u{FF0C}\u{53EF}\u{5728} XML \u{6A21}\u{5F0F}\u{4E0B}\u{624B}\u{52A8}\u{4FEE}\u{6539}\u{3002}</p>
            </div>
        `}renderCpuConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">CPU\u{7BA1}\u{63A7}</h2>
                <div class="config-items">
                    ${this.renderConfigItem("cpuCtlRus","shortCommCpuRateCtl","短期通信CPU阈值","短期通信CPU使用率阈值(%)","number","%")}
                    ${this.renderConfigItem("cpuCtlRus","longCommCpuRateCtl","长期通信CPU阈值","长期通信CPU使用率阈值(%)","number","%")}
                    ${this.renderConfigItem("cpuCtlRus","shortSysCpuRateCtl","短期系统CPU阈值","短期系统CPU使用率阈值(% * 核心数)","number","%")}
                    ${this.renderConfigItem("cpuCtlRus","collectCpuInfoCycle","CPU信息收集周期","CPU信息收集周期(毫秒)","number","毫秒")}
                    ${this.renderConfigItem("cpuCtlRus","cpuCollectEnable","启用CPU信息收集","是否启用CPU信息收集","boolean")}
                </div>
            </div>
        `}renderSpecialConfig(e){e.innerHTML=`
            <div class="config-section">
                <h2 class="config-section-title">\u{7279}\u{6B8A}\u{573A}\u{666F}\u{89C4}\u{5219}</h2>

                <h3 class="config-subsection-title">\u{6E38}\u{620F}\u{7F51}\u{7EDC}\u{9650}\u{5236}</h3>
                <div class="config-items">
                    ${this.renderConfigItem("restrictNet","appTypeValue","应用类型值","4 表示游戏应用","number")}
                    ${this.renderConfigItem("restrictNet","delayTime","限制延迟","延迟执行限制的时间","number","毫秒")}
                </div>

                <h3 class="config-subsection-title">\u{9AD8}\u{6E29}\u{6A21}\u{5F0F}</h3>
                <div class="config-items">
                    ${this.renderConfigItem("thermalMode","enable","启用高温模式","是否启用高温模式策略","boolean")}
                    ${this.renderConfigItem("thermalMode","enterLevel","进入温度等级","达到该温度等级时进入高温模式","number")}
                    ${this.renderConfigItem("thermalMode","exitLevel","退出温度等级","降至该温度等级时退出高温模式","number")}
                </div>
            </div>
        `}renderWhitelistConfig(e){if(!this.whitelistManager){e.innerHTML='<div class="config-section"><h2>白名单管理</h2><p>白名单管理器未初始化</p></div>';return}e.innerHTML=`
            <div class="config-section">
                <div class="section-header">
                    <h2>\u{767D}\u{540D}\u{5355}\u{7BA1}\u{7406}</h2>
                    <p>\u{7BA1}\u{7406}\u{5404}\u{79CD}\u{7C7B}\u{578B}\u{7684}\u{767D}\u{540D}\u{5355}\u{914D}\u{7F6E}\u{FF0C}\u{63A7}\u{5236}\u{5E94}\u{7528}\u{7684}\u{7279}\u{6B8A}\u{6743}\u{9650}\u{548C}\u{884C}\u{4E3A}</p>
                </div>

                <!-- \u{5217}\u{8868}\u{7C7B}\u{578B}\u{9009}\u{62E9} -->
                <div class="whitelist-controls">
                    <div class="control-group">
                        <label for="whitelist-type">\u{5217}\u{8868}\u{7C7B}\u{578B}:</label>
                        <select id="whitelist-type" class="form-control">
                            <option value="">\u{8BF7}\u{9009}\u{62E9}\u{5217}\u{8868}\u{7C7B}\u{578B}</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <button id="add-whitelist-item" class="btn btn-primary" disabled>
                            <i class="icon-plus"></i> \u{6DFB}\u{52A0}\u{9879}\u{76EE}
                        </button>
                    </div>
                </div>

                <!-- \u{5217}\u{8868}\u{5185}\u{5BB9} -->
                <div id="whitelist-content" class="whitelist-content">
                    <div class="empty-state">
                        <p>\u{8BF7}\u{9009}\u{62E9}\u{4E00}\u{4E2A}\u{5217}\u{8868}\u{7C7B}\u{578B}\u{6765}\u{67E5}\u{770B}\u{548C}\u{7BA1}\u{7406}\u{9879}\u{76EE}</p>
                    </div>
                </div>
            </div>
        `,this.initializeWhitelistControls()}renderBlacklistConfig(e){if(!this.whitelistManager){e.innerHTML='<div class="config-section"><h2>黑名单管理</h2><p>白名单管理器未初始化</p></div>';return}e.innerHTML=`
            <div class="config-section">
                <div class="section-header">
                    <h2>\u{9ED1}\u{540D}\u{5355}\u{7BA1}\u{7406}</h2>
                    <p>\u{7BA1}\u{7406}\u{5404}\u{79CD}\u{7C7B}\u{578B}\u{7684}\u{9ED1}\u{540D}\u{5355}\u{914D}\u{7F6E}\u{FF0C}\u{63A7}\u{5236}\u{5E94}\u{7528}\u{7684}\u{9650}\u{5236}\u{548C}\u{7981}\u{7528}\u{884C}\u{4E3A}</p>
                </div>

                <!-- \u{5217}\u{8868}\u{7C7B}\u{578B}\u{9009}\u{62E9} -->
                <div class="blacklist-controls">
                    <div class="control-group">
                        <label for="blacklist-type">\u{5217}\u{8868}\u{7C7B}\u{578B}:</label>
                        <select id="blacklist-type" class="form-control">
                            <option value="">\u{8BF7}\u{9009}\u{62E9}\u{5217}\u{8868}\u{7C7B}\u{578B}</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <button id="add-blacklist-item" class="btn btn-primary" disabled>
                            <i class="icon-plus"></i> \u{6DFB}\u{52A0}\u{9879}\u{76EE}
                        </button>
                    </div>
                </div>

                <!-- \u{5217}\u{8868}\u{5185}\u{5BB9} -->
                <div id="blacklist-content" class="blacklist-content">
                    <div class="empty-state">
                        <p>\u{8BF7}\u{9009}\u{62E9}\u{4E00}\u{4E2A}\u{5217}\u{8868}\u{7C7B}\u{578B}\u{6765}\u{67E5}\u{770B}\u{548C}\u{7BA1}\u{7406}\u{9879}\u{76EE}</p>
                    </div>
                </div>
            </div>
        `,this.initializeBlacklistControls()}renderConfigItem(e,t,i,a,n,s=""){let r=this.getConfigValue(e,t),o=`${e}.${t}`,l="";switch(n){case"boolean":l=`
                    <div class="switch-container">
                        <div class="switch">
                            <input type="checkbox" id="${o}" ${"true"===r?"checked":""} 
                                   onchange="handleConfigChange('${o}', this.checked ? 'true' : 'false')">
                            <span class="switch-slider"></span>
                        </div>
                    </div>
                `;break;case"number":l=`
                    <div class="number-input-container">
                        <input type="number" class="form-input number-input" id="${o}" 
                               value="${r||""}" 
                               onchange="handleConfigChange('${o}', this.value)">
                        ${s?`<span class="number-unit">${s}</span>`:""}
                    </div>
                `;break;case"string":l=`
                    <input type="text" class="form-input" id="${o}" 
                           value="${r||""}" 
                           onchange="handleConfigChange('${o}', this.value)">
                `}return`
            <div class="config-item" data-search="${i.toLowerCase()} ${a.toLowerCase()}">
                <div class="config-item-info">
                    <div class="config-item-title">${i}</div>
                    <div class="config-item-description">${a}</div>
                </div>
                <div class="config-item-control">
                    ${l}
                </div>
            </div>
        `}getConfigValue(e,t){if(!this.configData)return"";let i=this.findConfigElement(e);return i&&i.attributes&&i.attributes[t]||""}findConfigElement(e){return this.configData&&this.configData.children&&this.configData.children.find(t=>t.tagName===e)||null}filterConfigItems(){document.querySelectorAll(".config-item").forEach(e=>{let t=(e.dataset.search||"").includes(this.searchTerm);e.style.display=t?"flex":"none"})}setConfigData(e){this.configData=e,this.renderCurrentSection()}renderConfigSections(e){this.setConfigData(e)}showLoading(e="正在加载..."){let t=document.getElementById("loading"),i=t.querySelector("p");i&&(i.textContent=e),t.classList.remove("hidden"),document.getElementById("config-container").classList.add("hidden"),document.getElementById("error-message").classList.add("hidden")}hideLoading(){document.getElementById("loading").classList.add("hidden")}showError(e,t){let i=document.getElementById("error-message"),a=i.querySelector("h3"),n=document.getElementById("error-details");a&&(a.textContent=e),n&&(n.textContent=t),i.classList.remove("hidden"),document.getElementById("loading").classList.add("hidden"),document.getElementById("config-container").classList.add("hidden")}updateUnsavedIndicator(e){let t=document.getElementById("unsaved-changes");t&&(e?t.classList.remove("hidden"):t.classList.add("hidden"))}bindEvents(){window.handleConfigChange=(e,t)=>{let i=new CustomEvent("configChange",{detail:{path:e,value:t}});document.dispatchEvent(i)}}showWakeLockEditor(){let e=`
            <div class="modal-overlay" id="wakelock-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>WakeLock\u{4EE3}\u{7406}\u{89C4}\u{5219}\u{7F16}\u{8F91}</h3>
                        <button class="modal-close" onclick="uiManager.closeModal('wakelock-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="wakelock-form">
                            <div class="form-group">
                                <label for="wl-type">\u{89C4}\u{5219}\u{7C7B}\u{578B}</label>
                                <select id="wl-type" class="form-input">
                                    <option value="proxy">\u{4EE3}\u{7406}</option>
                                    <option value="block">\u{963B}\u{6B62}</option>
                                    <option value="allow">\u{5141}\u{8BB8}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="wl-tag">WakeLock\u{6807}\u{7B7E}</label>
                                <input type="text" id="wl-tag" class="form-input" placeholder="\u{5982}: *job.deadline*" />
                                <small class="form-help">\u{652F}\u{6301}\u{901A}\u{914D}\u{7B26} * \u{5339}\u{914D}</small>
                            </div>
                            <div class="form-group">
                                <label for="wl-pkg">\u{5305}\u{540D}</label>
                                <input type="text" id="wl-pkg" class="form-input" placeholder="\u{5982}: com.example.app \u{6216} * \u{8868}\u{793A}\u{6240}\u{6709}" />
                                <small class="form-help">\u{652F}\u{6301}\u{901A}\u{914D}\u{7B26} * \u{5339}\u{914D}\u{6240}\u{6709}\u{5E94}\u{7528}</small>
                            </div>
                            <div class="form-group">
                                <label for="wl-proxy">\u{4EE3}\u{7406}\u{7EA7}\u{522B}</label>
                                <select id="wl-proxy" class="form-input">
                                    <option value="1">1 - \u{8F7B}\u{5EA6}\u{4EE3}\u{7406}</option>
                                    <option value="2">2 - \u{4E2D}\u{5EA6}\u{4EE3}\u{7406}</option>
                                    <option value="3">3 - \u{91CD}\u{5EA6}\u{4EE3}\u{7406}</option>
                                    <option value="4">4 - \u{9650}\u{5236}\u{6027}\u{4EE3}\u{7406}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="wl-enable" checked />
                                    <span class="checkbox-text">\u{542F}\u{7528}\u{6B64}\u{89C4}\u{5219}</span>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="uiManager.closeModal('wakelock-modal')">\u{53D6}\u{6D88}</button>
                        <button class="btn btn-primary" onclick="uiManager.saveWakeLockRule()">\u{4FDD}\u{5B58}</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e)}showGpsEditor(){let e=`
            <div class="modal-overlay" id="gps-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>GPS\u{4EE3}\u{7406}\u{89C4}\u{5219}\u{7F16}\u{8F91}</h3>
                        <button class="modal-close" onclick="uiManager.closeModal('gps-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="gps-form">
                            <div class="form-group">
                                <label for="gps-type">\u{89C4}\u{5219}\u{7C7B}\u{578B}</label>
                                <select id="gps-type" class="form-input">
                                    <option value="white">\u{767D}\u{540D}\u{5355}</option>
                                    <option value="black">\u{9ED1}\u{540D}\u{5355}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="gps-apptype">\u{5E94}\u{7528}\u{7C7B}\u{578B}</label>
                                <select id="gps-apptype" class="form-input">
                                    <option value="4">4 - \u{6E38}\u{620F}\u{5E94}\u{7528}</option>
                                    <option value="7">7 - \u{5373}\u{65F6}\u{901A}\u{8BAF}\u{5E94}\u{7528}</option>
                                    <option value="11">11 - \u{5BFC}\u{822A}\u{5E94}\u{7528}</option>
                                    <option value="0">0 - \u{5176}\u{4ED6}\u{5E94}\u{7528}</option>
                                </select>
                                <small class="form-help">\u{9009}\u{62E9}\u{8981}\u{5E94}\u{7528}\u{6B64}\u{89C4}\u{5219}\u{7684}\u{5E94}\u{7528}\u{7C7B}\u{578B}</small>
                            </div>
                            <div class="form-group">
                                <label for="gps-recent">\u{6700}\u{8FD1}\u{4F7F}\u{7528}\u{65F6}\u{95F4}</label>
                                <input type="number" id="gps-recent" class="form-input" placeholder="5" min="0" />
                                <small class="form-help">\u{6700}\u{8FD1}\u{4F7F}\u{7528}\u{591A}\u{5C11}\u{5206}\u{949F}\u{5185}\u{4E0D}\u{4EE3}\u{7406}GPS</small>
                            </div>
                            <div class="form-group">
                                <label for="gps-interval">\u{9759}\u{6B62}\u{72B6}\u{6001}\u{95F4}\u{9694}</label>
                                <input type="number" id="gps-interval" class="form-input" placeholder="10" min="0" />
                                <small class="form-help">\u{8BBE}\u{5907}\u{9759}\u{6B62}\u{72B6}\u{6001}\u{4E0B}GPS\u{4EE3}\u{7406}\u{95F4}\u{9694}(\u{5206}\u{949F})</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="uiManager.closeModal('gps-modal')">\u{53D6}\u{6D88}</button>
                        <button class="btn btn-primary" onclick="uiManager.saveGpsRule()">\u{4FDD}\u{5B58}</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e)}saveWakeLockRule(){let e=document.getElementById("wl-type").value,t=document.getElementById("wl-tag").value,i=document.getElementById("wl-pkg").value,a=document.getElementById("wl-proxy").value,n=document.getElementById("wl-enable").checked;if(!t||!i)return void alert("请填写完整的规则信息");let s={tagName:"wakelock",attributes:{type:e,tag:t,pkg:i,proxy:a,enable:n.toString()},children:[],textContent:""},r=this.findConfigElement("proxyWL");r||(r={tagName:"proxyWL",attributes:{},children:[],textContent:""},this.configData.children.push(r)),r.children.push(s);let o=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(o),this.closeModal("wakelock-modal"),this.renderCurrentSection()}saveGpsRule(){let e=document.getElementById("gps-type").value,t=document.getElementById("gps-apptype").value,i=document.getElementById("gps-recent").value,a=document.getElementById("gps-interval").value;if(!t||!i||!a)return void alert("请填写完整的规则信息");let n=this.findConfigElement("proxyGps");n||(n={tagName:"proxyGps",attributes:{},children:[],textContent:""},this.configData.children.push(n)),n.children.push({tagName:"item",attributes:{type:e,appType:t,recentUse:i,stillInterval:a},children:[],textContent:""});let s=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(s),this.closeModal("gps-modal"),this.renderCurrentSection()}editWakeLockRule(e){let t=this.findConfigElement("proxyWL");if(!t||!t.children[e])return;let i=t.children[e];this.showWakeLockEditor(),setTimeout(()=>{document.getElementById("wl-type").value=i.attributes.type||"proxy",document.getElementById("wl-tag").value=i.attributes.tag||"",document.getElementById("wl-pkg").value=i.attributes.pkg||"",document.getElementById("wl-proxy").value=i.attributes.proxy||"4",document.getElementById("wl-enable").checked="false"!==i.attributes.enable},100),setTimeout(()=>{let t=document.querySelector("#wakelock-modal .btn-primary");t&&(t.onclick=()=>this.updateWakeLockRule(e))},100)}updateWakeLockRule(e){let t=this.findConfigElement("proxyWL");if(!t||!t.children[e])return;let i=document.getElementById("wl-type").value,a=document.getElementById("wl-tag").value,n=document.getElementById("wl-pkg").value,s=document.getElementById("wl-proxy").value,r=document.getElementById("wl-enable").checked;if(!a||!n)return void alert("请填写完整的规则信息");t.children[e].attributes={type:i,tag:a,pkg:n,proxy:s,enable:r.toString()};let o=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(o),this.closeModal("wakelock-modal"),this.renderCurrentSection()}deleteWakeLockRule(e){if(!confirm("确定要删除这个WakeLock规则吗？"))return;let t=this.findConfigElement("proxyWL");if(t&&t.children[e]){t.children.splice(e,1);let i=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(i),this.renderCurrentSection()}}editGpsRule(e){let t=this.findConfigElement("proxyGps");if(!t||!t.children[e])return;let i=t.children[e];this.showGpsEditor(),setTimeout(()=>{document.getElementById("gps-type").value=i.attributes.type||"white",document.getElementById("gps-apptype").value=i.attributes.appType||"11",document.getElementById("gps-recent").value=i.attributes.recentUse||"",document.getElementById("gps-interval").value=i.attributes.stillInterval||""},100),setTimeout(()=>{let t=document.querySelector("#gps-modal .btn-primary");t&&(t.onclick=()=>this.updateGpsRule(e))},100)}updateGpsRule(e){let t=this.findConfigElement("proxyGps");if(!t||!t.children[e])return;let i=document.getElementById("gps-type").value,a=document.getElementById("gps-apptype").value,n=document.getElementById("gps-recent").value,s=document.getElementById("gps-interval").value;if(!a||!n||!s)return void alert("请填写完整的规则信息");t.children[e].attributes={type:i,appType:a,recentUse:n,stillInterval:s};let r=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(r),this.closeModal("gps-modal"),this.renderCurrentSection()}deleteGpsRule(e){if(!confirm("确定要删除这个GPS规则吗？"))return;let t=this.findConfigElement("proxyGps");if(t&&t.children[e]){t.children.splice(e,1);let i=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(i),this.renderCurrentSection()}}closeModal(e){let t=document.getElementById(e);t&&t.remove()}initializeWhitelistControls(){this.populateListTypeSelect("whitelist-type",["whitePkg","ffPkg","alarm","cpnBroadcast","cpnService","proxyBroadcast","proxyWL","proxyGps"]),this.bindWhitelistEvents()}initializeBlacklistControls(){this.populateListTypeSelect("blacklist-type",["SysBlack","ffPkg","alarm","cpnBroadcast","cpnService","proxyBroadcast","proxyWL"]),this.bindBlacklistEvents()}populateListTypeSelect(e,t){let i=document.getElementById(e);i&&this.whitelistManager&&(i.innerHTML='<option value="">请选择列表类型</option>',t.forEach(e=>{let t=this.whitelistManager.getListTypeConfig(e);if(t){let a=document.createElement("option");a.value=e,a.textContent=`${t.name} (${e})`,a.title=t.description,i.appendChild(a)}}))}bindWhitelistEvents(){let e=document.getElementById("whitelist-type"),t=document.getElementById("add-whitelist-item");e&&e.addEventListener("change",e=>{let i=e.target.value;this.loadWhitelistItems(i),t.disabled=""===i}),t&&t.addEventListener("click",()=>{let t=e.value;t&&this.showAddItemDialog(t,"whitelist")})}bindBlacklistEvents(){let e=document.getElementById("blacklist-type"),t=document.getElementById("add-blacklist-item");e&&e.addEventListener("change",e=>{let i=e.target.value;this.loadBlacklistItems(i),t.disabled=""===i}),t&&t.addEventListener("click",()=>{let t=e.value;t&&this.showAddItemDialog(t,"blacklist")})}loadWhitelistItems(e){if(!e||!this.whitelistManager){document.getElementById("whitelist-content").innerHTML='<div class="empty-state"><p>请选择一个列表类型</p></div>';return}try{let t=this.whitelistManager.getListItems(e),i=this.whitelistManager.getListTypeConfig(e);this.renderListItems("whitelist-content",t,i,e,"whitelist")}catch(e){document.getElementById("whitelist-content").innerHTML=`<div class="error-state"><p>\u{52A0}\u{8F7D}\u{5931}\u{8D25}: ${e.message}</p></div>`}}loadBlacklistItems(e){if(!e||!this.whitelistManager){document.getElementById("blacklist-content").innerHTML='<div class="empty-state"><p>请选择一个列表类型</p></div>';return}try{let t=this.whitelistManager.getListItems(e),i=this.whitelistManager.getListTypeConfig(e);this.renderListItems("blacklist-content",t,i,e,"blacklist")}catch(e){document.getElementById("blacklist-content").innerHTML=`<div class="error-state"><p>\u{52A0}\u{8F7D}\u{5931}\u{8D25}: ${e.message}</p></div>`}}renderListItems(e,t,i,a,n){let s=document.getElementById(e);if(!s)return;if(0===t.length){s.innerHTML=`
                <div class="empty-state">
                    <p>\u{6682}\u{65E0}${i.name}\u{9879}\u{76EE}</p>
                    <p class="text-muted">${i.description}</p>
                </div>
            `;return}let r=`
            <div class="list-header">
                <h3>${i.name}</h3>
                <p class="text-muted">${i.description}</p>
                <div class="list-stats">
                    <span class="badge">${t.length} \u{4E2A}\u{9879}\u{76EE}</span>
                </div>
            </div>
            <div class="list-table-container">
                <table class="list-table">
                    <thead>
                        <tr>
        `;i.attributes.forEach(e=>{r+=`<th>${this.getAttributeDisplayName(e)}</th>`}),r+=`<th>\u{64CD}\u{4F5C}</th></tr></thead><tbody>`,t.forEach(e=>{r+="<tr>",i.attributes.forEach(t=>{let a=e[t]||"",n=this.formatAttributeValue(t,a,i);r+=`<td title="${a}">${n}</td>`}),r+=`
                <td class="actions">
                    <button class="btn btn-sm btn-secondary list-edit-btn"
                            data-list-type="${a}"
                            data-item-id="${e.id}"
                            data-context="${n}"
                            title="\u{7F16}\u{8F91}">
                        \u{7F16}\u{8F91}
                    </button>
                    <button class="btn btn-sm btn-danger list-delete-btn"
                            data-list-type="${a}"
                            data-item-id="${e.id}"
                            data-context="${n}"
                            title="\u{5220}\u{9664}">
                        \u{5220}\u{9664}
                    </button>
                </td>
            </tr>`}),s.innerHTML=r+="</tbody></table></div>",this.bindListActionEvents(e)}getAttributeDisplayName(e){return({name:"应用包名",pkg:"包名",type:"类型",category:"分类",action:"动作",cpn:"组件",calling:"调用方向",scene:"场景",tag:"标签",proxy:"代理级别",enable:"启用状态",appType:"应用类型",recentUse:"最近使用",stillInterval:"静止间隔",version:"版本",mask:"掩码"})[e]||e}formatAttributeValue(e,t,i){return t?"type"===e&&i.types&&i.types[t]?`<span class="type-badge type-${t}">${i.types[t]}</span>`:"category"===e&&i.categories&&i.categories[t]?`<span class="category-badge">${i.categories[t]}</span>`:"true"===t||"false"===t?`<span class="bool-badge bool-${t}">${"true"===t?"是":"否"}</span>`:t.length>30?`<span title="${t}">${t.substring(0,30)}...</span>`:t:"-"}showAddItemDialog(e,t){if(!this.whitelistManager)return void console.error("WhitelistManager未初始化");let a=this.whitelistManager.getListTypeConfig(e);if(!a)return void console.error(`\u{672A}\u{627E}\u{5230}\u{5217}\u{8868}\u{7C7B}\u{578B}\u{914D}\u{7F6E}: ${e}`);i("显示添加项目的浮动表单",{listType:e,context:t,configName:a.name}),this.removeFloatingForm();let n=`
            <div id="floating-add-form" class="floating-form collapsed">
                <div class="floating-form-header" id="floating-form-header">
                    <div class="floating-form-title">
                        <i class="icon-plus"></i>
                        <span>\u{6DFB}\u{52A0}${a.name}\u{9879}\u{76EE}</span>
                    </div>
                    <div class="floating-form-toggle">
                        <i class="icon-chevron-up"></i>
                    </div>
                </div>
                <div class="floating-form-content">
                    <form id="floating-add-item-form">
                        ${this.generateFormFields(a)}
                    </form>
                    <div class="floating-form-actions">
                        <button type="button" class="btn btn-secondary" id="floating-cancel-btn">\u{53D6}\u{6D88}</button>
                        <button type="button" class="btn btn-primary" id="floating-save-btn" data-list-type="${e}" data-context="${t}">\u{4FDD}\u{5B58}</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",n),this.bindFloatingFormEvents(),setTimeout(()=>{this.toggleFloatingForm()},100),i("浮动表单已创建并显示",{listType:e,context:t})}generateFormFields(e){let t="";return e.attributes.forEach(i=>{let a=this.getAttributeDisplayName(i),n=["name","pkg","type"].includes(i);t+=`
                <div class="form-group">
                    <label for="field-${i}">${a}${n?" *":""}:</label>
            `,"type"===i&&e.types?(t+=`<select id="field-${i}" class="form-control" ${n?"required":""}><option value="">\u8BF7\u9009\u62E9\u7C7B\u578B</option>`,Object.entries(e.types).forEach(([e,i])=>{t+=`<option value="${e}">${i}</option>`}),t+="</select>"):"category"===i&&e.categories?(t+=`<select id="field-${i}" class="form-control" ${n?"required":""}><option value="">\u8BF7\u9009\u62E9\u5206\u7C7B</option>`,Object.entries(e.categories).forEach(([e,i])=>{t+=`<option value="${e}">${i}</option>`}),t+="</select>"):"enable"===i||"calling"===i?t+=`
                    <select id="field-${i}" class="form-control">
                        <option value="true">\u{662F}</option>
                        <option value="false">\u{5426}</option>
                    </select>
                `:t+=`<input type="text" id="field-${i}" class="form-control" ${n?"required":""} placeholder="\u{8BF7}\u{8F93}\u{5165}${a}">`,t+="</div>"}),t}toggleFloatingForm(){let e=document.getElementById("floating-add-form");if(!e)return void console.warn("浮动表单不存在");let t=e.classList.contains("collapsed");console.log(`\u{5207}\u{6362}\u{6D6E}\u{52A8}\u{8868}\u{5355}\u{72B6}\u{6001}: ${t?"展开":"收起"}`),t?(e.classList.remove("collapsed"),e.classList.add("expanded")):(e.classList.remove("expanded"),e.classList.add("collapsed"))}removeFloatingForm(){let e=document.getElementById("floating-add-form");e&&(console.log("移除现有浮动表单"),e.remove())}bindFloatingFormEvents(){console.log("绑定浮动表单事件监听器");let e=document.getElementById("floating-form-header");e&&e.addEventListener("click",()=>{console.log("点击浮动表单头部"),this.toggleFloatingForm()});let t=document.getElementById("floating-cancel-btn");t&&t.addEventListener("click",()=>{console.log("点击取消按钮"),this.removeFloatingForm()});let i=document.getElementById("floating-save-btn");i&&i.addEventListener("click",()=>{console.log("点击保存按钮");let e=i.getAttribute("data-list-type"),t=i.getAttribute("data-context"),a=i.getAttribute("data-item-id");console.log("保存按钮数据:",{listType:e,context:t,itemId:a}),a?this.saveEditedItemFromFloating(e,a,t):this.saveNewItemFromFloating(e,t)}),console.log("浮动表单事件监听器绑定完成")}bindListActionEvents(e){let t=document.getElementById(e);if(!t)return void a("容器不存在",{containerId:e});s("绑定列表操作事件",{containerId:e}),t._listActionHandler&&t.removeEventListener("click",t._listActionHandler);let n=this,r=e=>{s("列表操作事件触发",{target:e.target.tagName,className:e.target.className});let t=e.target.closest("button");if(!t)return void s("未找到按钮元素");e.preventDefault(),e.stopPropagation(),s("找到按钮元素",{tagName:t.tagName,className:t.className});let r=t.getAttribute("data-list-type"),o=t.getAttribute("data-item-id"),l=t.getAttribute("data-context");if(s("按钮数据属性",{listType:r,itemId:o,context:l}),!r||!o||!l)return void a("按钮缺少必要的数据属性",{listType:r,itemId:o,context:l});t.classList.contains("list-edit-btn")?(i("点击编辑按钮",{listType:r,itemId:o,context:l}),n.editListItem(r,o,l)):t.classList.contains("list-delete-btn")?(i("点击删除按钮",{listType:r,itemId:o,context:l}),n.deleteListItem(r,o,l)):a("未识别的按钮类型",{className:t.className})};t._listActionHandler=r,t.addEventListener("click",r,!0),t.addEventListener("click",r,!1),i("列表操作事件绑定完成",{containerId:e}),setTimeout(()=>{s("验证按钮绑定",{containerId:e,buttonCount:t.querySelectorAll(".list-delete-btn, .list-edit-btn").length,hasHandler:!!t._listActionHandler})},100)}async saveNewItemFromFloating(e,t){if(!this.whitelistManager)return void console.error("WhitelistManager未初始化");let i=this.whitelistManager.getListTypeConfig(e);if(!i)return void console.error(`\u{672A}\u{627E}\u{5230}\u{5217}\u{8868}\u{7C7B}\u{578B}\u{914D}\u{7F6E}: ${e}`);console.log(`\u{5F00}\u{59CB}\u{4FDD}\u{5B58}${i.name}\u{9879}\u{76EE}`,{listType:e,context:t});try{let a={};i.attributes.forEach(e=>{let t=document.getElementById(`field-${e}`);t&&(a[e]=t.value.trim())}),console.log("收集到的表单数据:",a);let n=["name","pkg","type"].filter(e=>i.attributes.includes(e)).filter(e=>!a[e]);if(n.length>0){let e=`\u{8BF7}\u{586B}\u{5199}\u{5FC5}\u{9700}\u{5B57}\u{6BB5}: ${n.join(", ")}`;console.warn("表单验证失败:",e),this.toastManager?.show(e,"error");return}console.log("开始添加列表项目..."),await this.whitelistManager.addListItem(e,a),console.log("列表项目添加成功"),this.removeFloatingForm(),console.log(`\u{5237}\u{65B0}${t}\u{5217}\u{8868}`),"whitelist"===t?this.loadWhitelistItems(e):this.loadBlacklistItems(e),this.toastManager?.show("项目添加成功","success"),console.log("项目添加流程完成")}catch(e){console.error("添加项目失败:",e),this.toastManager?.show(`\u{6DFB}\u{52A0}\u{5931}\u{8D25}: ${e.message}`,"error")}}async saveNewItem(e,t){return this.saveNewItemFromFloating(e,t)}editListItem(e,t,i){if(!this.whitelistManager)return void console.error("WhitelistManager未初始化");let a=this.whitelistManager.getListItems(e).find(e=>e.id===t),n=this.whitelistManager.getListTypeConfig(e);if(!a||!n)return void console.error("未找到要编辑的项目或配置",{listType:e,itemId:t,hasItem:!!a,hasConfig:!!n});console.log(`\u{663E}\u{793A}\u{7F16}\u{8F91}${n.name}\u{9879}\u{76EE}\u{7684}\u{6D6E}\u{52A8}\u{8868}\u{5355}`,{listType:e,itemId:t,context:i,item:a}),this.removeFloatingForm();let s=`
            <div id="floating-add-form" class="floating-form collapsed">
                <div class="floating-form-header" id="floating-form-header">
                    <div class="floating-form-title">
                        <i class="icon-edit"></i>
                        <span>\u{7F16}\u{8F91}${n.name}\u{9879}\u{76EE}</span>
                    </div>
                    <div class="floating-form-toggle">
                        <i class="icon-chevron-up"></i>
                    </div>
                </div>
                <div class="floating-form-content">
                    <form id="floating-add-item-form">
                        ${this.generateFormFields(n)}
                    </form>
                    <div class="floating-form-actions">
                        <button type="button" class="btn btn-secondary" id="floating-cancel-btn">\u{53D6}\u{6D88}</button>
                        <button type="button" class="btn btn-primary" id="floating-save-btn" data-list-type="${e}" data-item-id="${t}" data-context="${i}">\u{4FDD}\u{5B58}</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",s),this.bindFloatingFormEvents(),setTimeout(()=>{this.toggleFloatingForm(),n.attributes.forEach(e=>{let t=document.getElementById(`field-${e}`);t&&void 0!==a[e]&&(t.value=a[e],console.log(`\u{586B}\u{5145}\u{5B57}\u{6BB5} ${e}: ${a[e]}`))}),console.log("编辑表单数据填充完成")},100)}async saveEditedItemFromFloating(e,t,i){if(!this.whitelistManager)return void console.error("WhitelistManager未初始化");let a=this.whitelistManager.getListTypeConfig(e);if(!a)return void console.error(`\u{672A}\u{627E}\u{5230}\u{5217}\u{8868}\u{7C7B}\u{578B}\u{914D}\u{7F6E}: ${e}`);console.log(`\u{5F00}\u{59CB}\u{4FDD}\u{5B58}\u{7F16}\u{8F91}\u{7684}${a.name}\u{9879}\u{76EE}`,{listType:e,itemId:t,context:i});try{let n={};a.attributes.forEach(e=>{let t=document.getElementById(`field-${e}`);t&&(n[e]=t.value.trim())}),console.log("收集到的编辑数据:",n),console.log("开始更新列表项目..."),await this.whitelistManager.updateListItem(e,t,n),console.log("列表项目更新成功"),this.removeFloatingForm(),console.log(`\u{5237}\u{65B0}${i}\u{5217}\u{8868}`),"whitelist"===i?this.loadWhitelistItems(e):this.loadBlacklistItems(e),this.toastManager?.show("项目更新成功","success"),console.log("项目更新流程完成")}catch(e){console.error("更新项目失败:",e),this.toastManager?.show(`\u{66F4}\u{65B0}\u{5931}\u{8D25}: ${e.message}`,"error")}}async saveEditedItem(e,t,i){return this.saveEditedItemFromFloating(e,t,i)}async deleteListItem(e,t,o){if(!this.whitelistManager)return void n("WhitelistManager未初始化");i("开始删除项目",{listType:e,itemId:t,context:o});let l=this.whitelistManager.getListItems(e).find(e=>e.id===t);if(!l){a("要删除的项目不存在",{itemId:t,listType:e}),this.toastManager?.show("项目不存在","error");return}s("找到要删除的项目",{item:{...l,_element:void 0}});let u=!1;if(this.modalManager?(s("显示删除确认对话框"),u=await this.modalManager.showDanger("确认删除","确定要删除这个项目吗？此操作无法撤销。","删除")):(a("ModalManager未初始化，使用浏览器原生确认对话框"),u=window.confirm("确定要删除这个项目吗？此操作无法撤销。")),s("用户确认结果",{confirmed:u}),!u)return void i("用户取消删除操作",{itemId:t,listType:e});try{s("开始执行删除操作",{listType:e,itemId:t}),await this.whitelistManager.removeListItem(e,t),s("删除操作执行成功",{listType:e,itemId:t}),s("刷新列表",{context:o,listType:e}),"whitelist"===o?this.loadWhitelistItems(e):this.loadBlacklistItems(e),this.toastManager?.show("项目删除成功","success"),r("删除列表项目",{listType:e,itemId:t,context:o})}catch(i){n("删除项目失败",{error:i.message,itemId:t,listType:e,context:o,stack:i.stack}),this.toastManager?.show(`\u{5220}\u{9664}\u{5931}\u{8D25}: ${i.message}`,"error")}}}class c{constructor(){this.parser=new DOMParser,this.serializer=new XMLSerializer}parse(e){try{let t=this.parser.parseFromString(e,"text/xml"),a=t.querySelector("parsererror");if(a)throw Error(`XML\u{89E3}\u{6790}\u{9519}\u{8BEF}: ${a.textContent}`);let n=t.documentElement;if(!n||"filter-conf"!==n.tagName)throw Error("无效的配置文件格式，缺少filter-conf根节点");let s=this.parseElement(n);return i("XML解析完成"),s}catch(e){throw n("XML解析失败:",e),Error(`XML\u{89E3}\u{6790}\u{5931}\u{8D25}: ${e.message}`)}}serialize(e){try{let t=document.implementation.createDocument(null,"filter-conf",null),a=t.documentElement;this.buildElement(t,a,e);let n=this.serializer.serializeToString(t);return n='<?xml version="1.0" encoding="utf-8"?>\n'+n,n=this.formatXML(n),i("XML序列化完成"),n}catch(e){throw n("XML序列化失败:",e),Error(`XML\u{5E8F}\u{5217}\u{5316}\u{5931}\u{8D25}: ${e.message}`)}}parseElement(e){let t={tagName:e.tagName,attributes:{},children:[],textContent:""};for(let i of e.attributes)t.attributes[i.name]=i.value;for(let i of e.childNodes)if(i.nodeType===Node.ELEMENT_NODE)t.children.push(this.parseElement(i));else if(i.nodeType===Node.TEXT_NODE){let e=i.textContent.trim();e&&(t.textContent+=e)}return t}buildElement(e,t,i){if(i.attributes)for(let[e,a]of Object.entries(i.attributes))t.setAttribute(e,a);if(i.textContent&&(t.textContent=i.textContent),i.children&&i.children.length>0)for(let a of i.children){let i=e.createElement(a.tagName);t.appendChild(i),this.buildElement(e,i,a)}}formatXML(e){let t=[];e=e.replace(/(>)(<)(\/*)/g,"$1\n$2$3");let i=0;return e.split("\n").forEach(e=>{let a=0;e.match(/.+<\/\w[^>]*>$/)?a=0:e.match(/^<\/\w/)?0!==i&&(i-=1):a=+!!e.match(/^<\w[^>]*[^\/]>.*$/);let n="    ".repeat(i);t.push(n+e),i+=a}),t.join("\n")}getValueByPath(e,t){let i=t.split("."),a=e;for(let e of i)if(e.includes("[")&&e.includes("]")){let[t,i]=e.split("["),n=parseInt(i.replace("]",""));a=a[t]&&a[t][n]}else if(a&&a.children){let t=a.children.find(t=>t.tagName===e);if(t)a=t;else if(a.attributes&&void 0!==a.attributes[e])return a.attributes[e];else return}else if(a&&a.attributes&&void 0!==a.attributes[e])return a.attributes[e];else return;return a}setValueByPath(e,t,i){let a=t.split("."),n=e;for(let e=0;e<a.length-1;e++){let t=a[e];if(t.includes("[")&&t.includes("]")){let[e,i]=t.split("["),a=parseInt(i.replace("]",""));n=n[e]&&n[e][a]}else if(n&&n.children){let e=n.children.find(e=>e.tagName===t);e||(e={tagName:t,attributes:{},children:[],textContent:""},n.children.push(e)),n=e}}let s=a[a.length-1];n&&void 0!==n.attributes&&(n.attributes[s]=i)}findElementsByTagName(e,t){let i=[],a=e=>{e.tagName===t&&i.push(e),e.children&&e.children.forEach(a)};return a(e),i}validateStructure(e){let t=[],i=[];if(!e||"filter-conf"!==e.tagName)return t.push("缺少有效的filter-conf根节点"),{isValid:!1,errors:t,warnings:i};for(let t of["version","filter-name","enableConfig","lcdOffConfig","lcdOnConfig"])0===this.findElementsByTagName(e,t).length&&i.push(`\u{7F3A}\u{5C11}\u{63A8}\u{8350}\u{7684}\u{914D}\u{7F6E}\u{8282}\u{70B9}: ${t}`);return{isValid:0===t.length,errors:t,warnings:i}}}class d{constructor(){this.validationRules=this.initializeValidationRules()}initializeValidationRules(){return{enableConfig:{required:!0,attributes:{hansEnable:{type:"boolean",required:!0},gmsEnable:{type:"boolean",required:!0},releaseStatistic:{type:"boolean",required:!0},skipToast:{type:"boolean",required:!0},heatGameCloseNet:{type:"boolean",required:!0},dozeRestrictSwitch:{type:"boolean",required:!0},audioByHook:{type:"boolean",required:!0},navigationByHook:{type:"boolean",required:!0},audioCheckEnable:{type:"boolean",required:!0},proxyWakeLockEnable:{type:"boolean",required:!0},cgp_v2:{type:"boolean",required:!0},hansWatchDogEnable:{type:"boolean",required:!0},cpnCheckByHook:{type:"boolean",required:!0},restoreAlarm:{type:"boolean",required:!0},uidGoneRemoveAlarm:{type:"boolean",required:!0},MStateTrimMemConfig:{type:"boolean",required:!0}}},lcdOffConfig:{required:!0,attributes:{ffTotal:{type:"number",required:!0},ffInterval:{type:"number",required:!0},interval:{type:"number",required:!0},deepSleepFreezeWhite:{type:"boolean",required:!0},gameCloseNet:{type:"boolean",required:!0},idleEnable:{type:"boolean",required:!0}}},lcdOnConfig:{required:!0,attributes:{RToM:{type:"number",required:!0},MToF:{type:"number",required:!0},checkImportance:{type:"number",required:!0},gameCloseNet:{type:"boolean",required:!0}}},ffConfig:{required:!0,attributes:{enable:{type:"boolean",required:!0},enterTimeout:{type:"number",required:!0},interval:{type:"number",required:!0},maxFzNum:{type:"number",required:!0}}},proxyConfig:{required:!1,attributes:{alarm:{type:"boolean",required:!0},service:{type:"boolean",required:!0},job:{type:"boolean",required:!0},broadcast:{type:"boolean",required:!0},proxyBCmax:{type:"number",required:!0}}},superFreezeConfig:{required:!1,attributes:{enable:{type:"boolean",required:!0}}},cpuCtlRus:{required:!1,attributes:{shortCommCpuRateCtl:{type:"number",required:!0},longCommCpuRateCtl:{type:"number",required:!0},shortSysCpuRateCtl:{type:"number",required:!0},collectCpuInfoCycle:{type:"number",required:!0},cpuCollectEnable:{type:"boolean",required:!0}}},restrictNet:{required:!1,attributes:{appTypeValue:{type:"number",required:!0},delayTime:{type:"number",required:!0}}},thermalMode:{required:!1,attributes:{enable:{type:"boolean",required:!0},enterLevel:{type:"number",required:!0},exitLevel:{type:"number",required:!0}}}}}validateConfig(e){let t=[],i=[];try{if(!e||"filter-conf"!==e.tagName)return t.push("配置文件缺少有效的filter-conf根节点"),{isValid:!1,errors:t,warnings:i};for(let[a,n]of Object.entries(this.validationRules)){let s=this.validateSection(e,a,n);t.push(...s.errors),i.push(...s.warnings)}let a=this.validateVersion(e);return i.push(...a.warnings),{isValid:0===t.length,errors:t,warnings:i}}catch(e){return console.error("配置验证过程中发生错误:",e),t.push(`\u{9A8C}\u{8BC1}\u{8FC7}\u{7A0B}\u{4E2D}\u{53D1}\u{751F}\u{9519}\u{8BEF}: ${e.message}`),{isValid:!1,errors:t,warnings:i}}}validateSection(e,t,i){let a=[],n=[],s=this.findConfigElement(e,t);if(!s)return i.required?a.push(`\u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{7684}\u{914D}\u{7F6E}\u{8282}: ${t}`):n.push(`\u{7F3A}\u{5C11}\u{53EF}\u{9009}\u{7684}\u{914D}\u{7F6E}\u{8282}: ${t}`),{errors:a,warnings:n};if(i.attributes)for(let[e,r]of Object.entries(i.attributes)){let i=this.validateAttribute(s,e,r,t);a.push(...i.errors),n.push(...i.warnings)}return{errors:a,warnings:n}}validateAttribute(e,t,i,a){let n=[],s=[],r=e.attributes?e.attributes[t]:void 0;if(i.required&&(void 0===r||""===r))return n.push(`${a}.${t}: \u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{7684}\u{5C5E}\u{6027}`),{errors:n,warnings:s};if(void 0===r||""===r)return{errors:n,warnings:s};switch(i.type){case"boolean":"true"!==r&&"false"!==r&&n.push(`${a}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}'true'\u{6216}'false'\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${r}`);break;case"number":let o=parseInt(r);isNaN(o)?n.push(`${a}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}\u{6570}\u{5B57}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${r}`):(void 0!==i.min&&o<i.min&&n.push(`${a}.${t}: \u{503C}\u{4E0D}\u{80FD}\u{5C0F}\u{4E8E}${i.min}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${o}`),void 0!==i.max&&o>i.max&&n.push(`${a}.${t}: \u{503C}\u{4E0D}\u{80FD}\u{5927}\u{4E8E}${i.max}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${o}`),void 0!==i.recommendedMin&&o<i.recommendedMin&&s.push(`${a}.${t}: \u{5EFA}\u{8BAE}\u{503C}\u{4E0D}\u{5C0F}\u{4E8E}${i.recommendedMin}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${o}`),void 0!==i.recommendedMax&&o>i.recommendedMax&&s.push(`${a}.${t}: \u{5EFA}\u{8BAE}\u{503C}\u{4E0D}\u{5927}\u{4E8E}${i.recommendedMax}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${o}`));break;case"string":"string"!=typeof r?n.push(`${a}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}\u{5B57}\u{7B26}\u{4E32}\u{FF0C}\u{5F53}\u{524D}\u{7C7B}\u{578B}: ${typeof r}`):(void 0!==i.minLength&&r.length<i.minLength&&n.push(`${a}.${t}: \u{5B57}\u{7B26}\u{4E32}\u{957F}\u{5EA6}\u{4E0D}\u{80FD}\u{5C0F}\u{4E8E}${i.minLength}`),void 0!==i.maxLength&&r.length>i.maxLength&&n.push(`${a}.${t}: \u{5B57}\u{7B26}\u{4E32}\u{957F}\u{5EA6}\u{4E0D}\u{80FD}\u{5927}\u{4E8E}${i.maxLength}`),i.pattern&&!i.pattern.test(r)&&n.push(`${a}.${t}: \u{503C}\u{683C}\u{5F0F}\u{4E0D}\u{6B63}\u{786E}`))}return{errors:n,warnings:s}}validateVersion(e){let t=[],i=this.findConfigElement(e,"version");if(!i)return t.push("缺少版本信息"),{warnings:t};let a=i.textContent;return a&&""!==a.trim()?/^\d{10}$/.test(a.trim())||t.push(`\u{7248}\u{672C}\u{683C}\u{5F0F}\u{53EF}\u{80FD}\u{4E0D}\u{6B63}\u{786E}: ${a}`):t.push("版本信息为空"),{warnings:t}}validateValue(e,t,i){let a=this.validationRules[e];if(!a||!a.attributes||!a.attributes[t])return{isValid:!1,error:"未知的配置项"};let n=a.attributes[t],s=this.validateAttribute({attributes:{[t]:i}},t,n,e);return{isValid:0===s.errors.length,error:s.errors[0]||null,warning:s.warnings[0]||null}}checkCompatibility(e){let t=[],i=this.findConfigElement(e,"enableConfig");if(i&&i.attributes){let e=i.attributes;"false"===e.audioByHook&&"true"===e.audioCheckEnable&&t.push("音频钩子拦截已禁用，但音频状态检查仍启用，可能导致功能冲突"),"false"===e.proxyWakeLockEnable&&"true"===e.cgp_v2&&t.push("WakeLock代理已禁用，但CGP v2仍启用，可能影响功耗优化效果")}let a=this.findConfigElement(e,"lcdOffConfig"),n=this.findConfigElement(e,"lcdOnConfig");if(a&&n){let e=parseInt(a.attributes?.ffInterval||"0"),i=parseInt(n.attributes?.RToM||"0");e>0&&i>0&&e>i&&t.push("熄屏冻结间隔大于亮屏Recent→M延迟，可能导致策略冲突")}return{warnings:t}}findConfigElement(e,t){return e&&e.children&&e.children.find(e=>e.tagName===t)||null}validateRealTime(e,t,i,a){let n=this.validateValue(e,t,i);a.classList.remove("input-valid","input-invalid");let s=a.parentNode.querySelector(".validation-error");if(s&&s.remove(),n.isValid){if(a.classList.add("input-valid"),n.warning){let e=document.createElement("div");e.className="validation-warning",e.textContent=n.warning,a.parentNode.appendChild(e)}return!0}{a.classList.add("input-invalid");let e=document.createElement("div");return e.className="validation-error",e.textContent=n.error,a.parentNode.appendChild(e),!1}}validateForm(e){let t=[],i=[],a=!0;return e.querySelectorAll("[data-config-path]").forEach(e=>{let n=e.dataset.configPath,[s,r]=n.split("."),o="checkbox"===e.type?e.checked?"true":"false":e.value,l=this.validateValue(s,r,o);l.isValid||(t.push(`${n}: ${l.error}`),a=!1),l.warning&&i.push(`${n}: ${l.warning}`)}),{isValid:a,errors:t,warnings:i}}displayValidationResult(e,t){if(t.innerHTML="",e.isValid){let e=document.createElement("div");e.className="validation-success",e.innerHTML='<span class="icon">✅</span> 配置验证通过',t.appendChild(e)}else{let i=document.createElement("div");i.className="validation-errors",i.innerHTML=`
                <div class="validation-header">
                    <span class="icon">\u{274C}</span> \u{53D1}\u{73B0} ${e.errors.length} \u{4E2A}\u{9519}\u{8BEF}
                </div>
                <ul class="validation-list">
                    ${e.errors.map(e=>`<li>${e}</li>`).join("")}
                </ul>
            `,t.appendChild(i)}if(e.warnings.length>0){let i=document.createElement("div");i.className="validation-warnings",i.innerHTML=`
                <div class="validation-header">
                    <span class="icon">\u{26A0}\u{FE0F}</span> ${e.warnings.length} \u{4E2A}\u{8B66}\u{544A}
                </div>
                <ul class="validation-list">
                    ${e.warnings.map(e=>`<li>${e}</li>`).join("")}
                </ul>
            `,t.appendChild(i)}}createValidationSummary(e){return{isValid:e.isValid,errorCount:e.errors.length,warningCount:e.warnings.length,status:e.isValid?"valid":"invalid",message:e.isValid?"配置验证通过":`\u{53D1}\u{73B0} ${e.errors.length} \u{4E2A}\u{9519}\u{8BEF}`,details:{errors:e.errors,warnings:e.warnings}}}generateReport(e){let t="配置验证报告\n";return t+="================\n\n",e.isValid?t+="✅ 配置验证通过\n\n":(t+="❌ 配置验证失败\n\n",e.errors.length>0&&(t+="错误:\n",e.errors.forEach((e,i)=>{t+=`${i+1}. ${e}
`}),t+="\n")),e.warnings.length>0&&(t+="警告:\n",e.warnings.forEach((e,i)=>{t+=`${i+1}. ${e}
`})),t}exportValidationResult(e){return JSON.stringify(this.createValidationSummary(e),null,2)}}class h{constructor(){this.container=null,this.toasts=new Map,this.autoCloseDelay=5e3,this.maxToasts=5,this.initializeContainer()}initializeContainer(){this.container=document.getElementById("toast-container"),this.container||a("Toast容器未找到")}show(e,t="info",i=this.autoCloseDelay){return"loading"===t?this.showLoading(e):this.showToast(t,"",e,i)}showSuccess(e,t,i=this.autoCloseDelay){this.showToast("success",e,t,i)}showError(e,t,i=2*this.autoCloseDelay){this.showToast("error",e,t,i)}showWarning(e,t,i=this.autoCloseDelay){this.showToast("warning",e,t,i)}showInfo(e,t,i=this.autoCloseDelay){this.showToast("info",e,t,i)}showToast(e,t,i,n=this.autoCloseDelay){if(!this.container)return void a("Toast容器未初始化");if(this.toasts.size>=this.maxToasts){let e=this.toasts.keys().next().value;this.removeToast(e)}let r=`toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=this.createToastElement(r,e,t,i);this.container.appendChild(o),this.toasts.set(r,{element:o,type:e,title:t,message:i,createdAt:Date.now()}),setTimeout(()=>{o.classList.add("toast-show")},10),n>0&&setTimeout(()=>{this.removeToast(r)},n);let l=o.querySelector(".toast-close");return l&&l.addEventListener("click",()=>{this.removeToast(r)}),s(`Toast\u{663E}\u{793A}: [${e.toUpperCase()}] ${t} - ${i}`),r}createToastElement(e,t,i,a){let n=document.createElement("div");n.id=e,n.className=`toast toast-${t}`;let s={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"},r=s[t]||s.info;return n.innerHTML=`
            <div class="toast-content">
                <div class="toast-icon">${r}</div>
                <div class="toast-body">
                    <div class="toast-title">${this.escapeHtml(i)}</div>
                    <div class="toast-message">${this.escapeHtml(a)}</div>
                </div>
                <button class="toast-close" type="button" aria-label="\u{5173}\u{95ED}">\xd7</button>
            </div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `,n}removeToast(e){let t=this.toasts.get(e);if(!t)return;let i=t.element;i.classList.add("toast-removing"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i),this.toasts.delete(e)},300)}clearAll(){Array.from(this.toasts.keys()).forEach(e=>this.removeToast(e))}clearByType(e){Array.from(this.toasts.entries()).filter(([t,i])=>i.type===e).map(([e,t])=>e).forEach(e=>this.removeToast(e))}getToastCount(){return this.toasts.size}getToastCountByType(e){return Array.from(this.toasts.values()).filter(t=>t.type===e).length}setMaxToasts(e){for(this.maxToasts=Math.max(1,e);this.toasts.size>this.maxToasts;){let e=this.toasts.keys().next().value;this.removeToast(e)}}setAutoCloseDelay(e){this.autoCloseDelay=Math.max(1e3,e)}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}showLoading(e="正在处理..."){let t=`loading-${Date.now()}`,i=document.createElement("div");return i.id=t,i.className="toast toast-loading",i.innerHTML=`
            <div class="toast-content">
                <div class="toast-icon">
                    <div class="loading-spinner-small"></div>
                </div>
                <div class="toast-body">
                    <div class="toast-message">${this.escapeHtml(e)}</div>
                </div>
            </div>
        `,this.container.appendChild(i),setTimeout(()=>{i.classList.add("toast-show")},10),this.toasts.set(t,{element:i,type:"loading",title:"",message:e,createdAt:Date.now()}),t}updateLoadingMessage(e,t){let i=this.toasts.get(e);if(i&&"loading"===i.type){let e=i.element.querySelector(".toast-message");e&&(e.textContent=t)}}showResult(e,t,i,a=null){a&&this.removeToast(a),e?this.showSuccess("操作成功",t):this.showError("操作失败",i)}}class m{constructor(){this.overlay=null,this.modal=null,this.isOpen=!1,this.currentResolve=null,this.initializeModal(),this.bindEvents()}initializeModal(){this.overlay=document.getElementById("modal-overlay"),this.modal=this.overlay?.querySelector(".modal"),s("ModalManager初始化",{hasOverlay:!!this.overlay,hasModal:!!this.modal,overlayId:this.overlay?.id,modalClass:this.modal?.className}),this.overlay&&this.modal||n("模态对话框元素未找到",{overlayExists:!!document.getElementById("modal-overlay"),modalExists:!!document.querySelector(".modal")})}bindEvents(){if(!this.overlay)return;this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close(!1)});let e=document.getElementById("modal-close");e&&e.addEventListener("click",()=>{this.close(!1)});let t=document.getElementById("modal-cancel");t&&t.addEventListener("click",()=>{this.close(!1)});let i=document.getElementById("modal-confirm");i&&i.addEventListener("click",()=>{this.close(!0)}),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.isOpen&&this.close(!1)})}showConfirm(e,t,i="确认",n="info"){return s("ModalManager.showConfirm调用",{title:e,message:t,confirmText:i,type:n,isOpen:this.isOpen}),new Promise(r=>{if(this.isOpen){a("模态对话框已经打开，拒绝新的请求"),r(!1);return}this.currentResolve=r,s("开始更新对话框内容"),this.updateContent(e,t,i,n),s("开始打开对话框"),this.open()})}showInfo(e,t,i="确定"){return this.showConfirm(e,t,i,"info")}showWarning(e,t,i="继续"){return this.showConfirm(e,t,i,"warning")}showDanger(e,t,i="删除"){return s("ModalManager.showDanger调用",{title:e,message:t,confirmText:i}),this.showConfirm(e,t,i,"danger")}showCustom(e){let{title:t="确认",message:i="",confirmText:a="确认",cancelText:n="取消",type:s="info",showCancel:r=!0,html:o=null}=e;return new Promise(e=>{if(this.isOpen)return void e(!1);this.currentResolve=e,this.updateContent(t,o||i,a,s,n,r),this.open()})}updateContent(e,t,i,a,n="取消",s=!0){if(!this.modal)return;let r=document.getElementById("modal-title");r&&(r.textContent=e);let o=document.getElementById("modal-message");o&&(t.includes("<")?o.innerHTML=t:o.textContent=t);let l=document.getElementById("modal-confirm"),u=document.getElementById("modal-cancel");if(l)switch(l.textContent=i,l.className="btn",a){case"warning":l.classList.add("btn-warning");break;case"danger":l.classList.add("btn-danger");break;default:l.classList.add("btn-primary")}u&&(u.textContent=n,u.style.display=s?"inline-flex":"none"),this.modal.className=`modal modal-${a}`}open(){return(s("ModalManager.open调用",{hasOverlay:!!this.overlay,isOpen:this.isOpen}),this.overlay)?this.isOpen?void a("模态对话框已经打开"):void(this.isOpen=!0,this.overlay.classList.remove("hidden"),i("模态对话框已打开"),document.body.style.overflow="hidden",setTimeout(()=>{let e=document.getElementById("modal-confirm");e&&e.focus()},100),console.log("模态对话框已打开")):void n("模态对话框overlay元素不存在")}close(e=!1){this.overlay&&this.isOpen&&(this.isOpen=!1,this.overlay.classList.add("hidden"),document.body.style.overflow="",this.currentResolve&&(this.currentResolve(e),this.currentResolve=null),console.log(`\u{6A21}\u{6001}\u{5BF9}\u{8BDD}\u{6846}\u{5DF2}\u{5173}\u{95ED}\u{FF0C}\u{7ED3}\u{679C}: ${e}`))}showInput(e,t,i="",a=""){return new Promise(n=>{if(this.isOpen)return void n(null);let s=`
                <p>${this.escapeHtml(t)}</p>
                <div class="form-group">
                    <input type="text" id="modal-input" class="form-input" 
                           value="${this.escapeHtml(i)}" 
                           placeholder="${this.escapeHtml(a)}">
                </div>
            `;this.currentResolve=e=>{if(e){let e=document.getElementById("modal-input");n(e?e.value:null)}else n(null)},this.updateContent(e,s,"确定","info"),this.open(),setTimeout(()=>{let e=document.getElementById("modal-input");e&&(e.focus(),e.select())},100)})}showSelect(e,t,i){return new Promise(a=>{if(this.isOpen)return void a(null);let n=i.map((e,t)=>{let i="object"==typeof e?e.value:e,a="object"==typeof e?e.label:e;return`<option value="${this.escapeHtml(i)}">${this.escapeHtml(a)}</option>`}).join(""),s=`
                <p>${this.escapeHtml(t)}</p>
                <div class="form-group">
                    <select id="modal-select" class="form-input form-select">
                        ${n}
                    </select>
                </div>
            `;this.currentResolve=e=>{if(e){let e=document.getElementById("modal-select");a(e?e.value:null)}else a(null)},this.updateContent(e,s,"确定","info"),this.open(),setTimeout(()=>{let e=document.getElementById("modal-select");e&&e.focus()},100)})}isModalOpen(){return this.isOpen}forceClose(){this.close(!1)}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}}class g{constructor(e,t,i,a){this.configManager=e,this.xmlParser=t,this.toastManager=i,this.modalManager=a,this.listTypes={whitePkg:{name:"应用白名单",description:"加入白名单的应用将获得更宽松的冻结策略",tagName:"whitePkg",attributes:["name","category"],categories:{100:"强制白名单","010":"OPPO/OnePlus白名单","001":"第三方白名单"}},ffPkg:{name:"快速冻结列表",description:"控制应用是否参与快速冻结机制",tagName:"ffPkg",attributes:["type","pkg"],types:{white:"白名单(允许快速冻结)",black:"黑名单(跳过快速冻结)",skipAppSwitch:"跳过应用切换检查"}},SysBlack:{name:"系统应用黑名单",description:"对系统应用进行限制的黑名单配置",tagName:"SysBlack",attributes:["name","version","scene","mask"]},alarm:{name:"闹钟管理列表",description:"控制应用闹钟权限的白名单/黑名单",tagName:"alarm",attributes:["type","pkg","action"],types:{white:"白名单(允许闹钟)",black:"黑名单(禁止闹钟)"}},cpnBroadcast:{name:"广播组件列表",description:"控制应用广播接收权限",tagName:"cpnBroadcast",attributes:["calling","type","pkg","action","scene"],types:{white:"白名单(允许广播)",black:"黑名单(禁止广播)"}},cpnService:{name:"服务组件列表",description:"控制应用服务调用权限",tagName:"cpnService",attributes:["calling","type","pkg","cpn","action"],types:{white:"白名单(允许服务)",black:"黑名单(禁止服务)"}},proxyBroadcast:{name:"代理广播列表",description:"控制广播代理机制的白名单/黑名单",tagName:"proxyBroadcast",attributes:["type","pkg","action"],types:{white:"白名单(不代理)",black:"黑名单(强制代理)",drop:"丢弃列表(直接丢弃)"}},proxyWL:{name:"WakeLock代理列表",description:"控制WakeLock代理机制",tagName:"wakelock",parentTag:"proxyWL",attributes:["type","tag","pkg","proxy","enable"],types:{white:"白名单(不代理)",black:"黑名单(禁止)",proxy:"代理(延迟处理)"}},proxyGps:{name:"GPS代理列表",description:"控制GPS定位代理机制",tagName:"item",parentTag:"proxyGps",attributes:["type","pkg","appType","recentUse","stillInterval"],types:{white:"白名单(不代理)",black:"黑名单(强制代理)",gray:"灰名单(条件代理)"}}}}getListItems(e){try{let t=this.listTypes[e];if(!t)throw Error(`\u{672A}\u{77E5}\u{7684}\u{5217}\u{8868}\u{7C7B}\u{578B}: ${e}`);let i=this.configManager.getCurrentConfig();if(!i)return s(`\u{914D}\u{7F6E}\u{6570}\u{636E}\u{4E3A}\u{7A7A}\u{FF0C}\u{8FD4}\u{56DE}\u{7A7A}\u{5217}\u{8868}: ${e}`),[];s(`\u{5F00}\u{59CB}\u{83B7}\u{53D6}${e}\u{5217}\u{8868}\u{FF0C}\u{914D}\u{7F6E}\u{7C7B}\u{578B}:`,{hasParentTag:!!t.parentTag,tagName:t.tagName,parentTag:t.parentTag});let n=[];return t.parentTag?this.xmlParser.findElementsByTagName(i,t.parentTag).forEach(e=>{let i=e.children?.filter(e=>e.tagName===t.tagName)||[];n.push(...i)}):n=this.xmlParser.findElementsByTagName(i,t.tagName),s(`\u{627E}\u{5230}${n.length}\u{4E2A}${e}\u{9879}\u{76EE}`),n.map(e=>(e.attributes||(a(`\u{9879}\u{76EE}\u{7F3A}\u{5C11}attributes\u{5C5E}\u{6027}:`,e),e.attributes={}),{id:this.generateItemId(e),...e.attributes,_element:e}))}catch(t){return n(`\u{83B7}\u{53D6}${e}\u{5217}\u{8868}\u{5931}\u{8D25}:`,{error:t.message||t.toString(),stack:t.stack,listType:e,configExists:!!config}),[]}}async addListItem(e,t){s(`\u{5F00}\u{59CB}\u{6DFB}\u{52A0}${e}\u{9879}\u{76EE}`,t);try{let n=this.listTypes[e];if(!n)throw Error(`\u{672A}\u{77E5}\u{7684}\u{5217}\u{8868}\u{7C7B}\u{578B}: ${e}`);s(`\u{4F7F}\u{7528}\u{914D}\u{7F6E}:`,{tagName:n.tagName,parentTag:n.parentTag,attributes:n.attributes});let o=this.configManager.getCurrentConfig();if(!o)throw Error("配置数据未加载");let l=n.attributes.filter(e=>!t.hasOwnProperty(e)||""===t[e]);if(l.length>0)throw a(`\u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{5C5E}\u{6027}:`,l),Error(`\u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{5C5E}\u{6027}: ${l.join(", ")}`);if(this.isItemExists(e,t))throw a(`\u{9879}\u{76EE}\u{5DF2}\u{5B58}\u{5728}:`,t),Error("该项目已存在");let u={tagName:n.tagName,attributes:{},children:[],textContent:""};if(n.attributes.forEach(e=>{void 0!==t[e]&&(u.attributes[e]=String(t[e]))}),s(`\u{521B}\u{5EFA}\u{7684}\u{65B0}\u{5143}\u{7D20}:`,u),n.parentTag){let e=this.xmlParser.findElementsByTagName(o,n.parentTag)[0];e||(s(`\u{521B}\u{5EFA}\u{7236}\u{5143}\u{7D20}: ${n.parentTag}`),e={tagName:n.parentTag,attributes:{},children:[],textContent:""},o.children.push(e)),e.children.push(u),s(`\u{6DFB}\u{52A0}\u{5230}\u{7236}\u{5143}\u{7D20} ${n.parentTag} \u{4E2D}`)}else o.children.push(u),s(`\u{76F4}\u{63A5}\u{6DFB}\u{52A0}\u{5230}\u{6839}\u{914D}\u{7F6E}\u{4E2D}`);return await r("添加列表项",{listType:e,item:t,elementCreated:u}),i(`${e}\u{9879}\u{76EE}\u{6DFB}\u{52A0}\u{6210}\u{529F}:`,t),!0}catch(i){throw n(`\u{6DFB}\u{52A0}${e}\u{9879}\u{76EE}\u{5931}\u{8D25}:`,{error:i.message,itemData:t,stack:i.stack}),i}}async removeListItem(e,t){s(`\u{5F00}\u{59CB}\u{5220}\u{9664}${e}\u{9879}\u{76EE}`,{itemId:t});try{let n=this.getListItems(e).find(e=>e.id===t);if(!n)throw a(`\u{8981}\u{5220}\u{9664}\u{7684}\u{9879}\u{76EE}\u{4E0D}\u{5B58}\u{5728}: ${t}`),Error("项目不存在");let o=this.configManager.getCurrentConfig(),l=this.listTypes[e];if(!o)throw Error("配置数据未加载");s(`\u{627E}\u{5230}\u{8981}\u{5220}\u{9664}\u{7684}\u{9879}\u{76EE}:`,{itemId:t,item:{...n,_element:void 0},typeConfig:{tagName:l.tagName,parentTag:l.parentTag}});let u=0;if(l.parentTag)s(`\u{4ECE}\u{5D4C}\u{5957}\u{7ED3}\u{6784}\u{4E2D}\u{5220}\u{9664}\u{FF0C}\u{7236}\u{6807}\u{7B7E}: ${l.parentTag}`),this.xmlParser.findElementsByTagName(o,l.parentTag).forEach(e=>{let i=e.children?.length||0;e.children=e.children?.filter(e=>{let i=e.tagName===l.tagName&&this.generateItemId(e)===t;return i&&u++,!i})||[];let a=e.children.length;s(`\u{7236}\u{5143}\u{7D20}\u{5B50}\u{9879}\u{6570}\u{91CF}\u{53D8}\u{5316}: ${i} -> ${a}`)});else{s(`\u{4ECE}\u{76F4}\u{63A5}\u{7ED3}\u{6784}\u{4E2D}\u{5220}\u{9664}`);let e=o.children.length;o.children=o.children.filter(e=>{let i=e.tagName===l.tagName&&this.generateItemId(e)===t;return i&&u++,!i});let i=o.children.length;s(`\u{6839}\u{914D}\u{7F6E}\u{5B50}\u{9879}\u{6570}\u{91CF}\u{53D8}\u{5316}: ${e} -> ${i}`)}if(0===u)throw a(`\u{672A}\u{627E}\u{5230}\u{8981}\u{5220}\u{9664}\u{7684}\u{5143}\u{7D20}: ${t}`),Error("未找到要删除的项目");return await r("删除列表项",{listType:e,itemId:t,item:{...n,_element:void 0},removedCount:u}),i(`${e}\u{9879}\u{76EE}\u{5220}\u{9664}\u{6210}\u{529F}:`,{itemId:t,removedCount:u}),!0}catch(i){throw n(`\u{5220}\u{9664}${e}\u{9879}\u{76EE}\u{5931}\u{8D25}:`,{error:i.message,itemId:t,listType:e,stack:i.stack}),i}}async updateListItem(e,t,o){s(`\u{5F00}\u{59CB}\u{66F4}\u{65B0}${e}\u{9879}\u{76EE}`,{itemId:t,newData:o});try{let n=this.getListItems(e).find(e=>e.id===t);if(!n)throw a(`\u{9879}\u{76EE}\u{4E0D}\u{5B58}\u{5728}: ${t}`),Error("项目不存在");let l=this.listTypes[e],u={...n};return delete u._element,s(`\u{627E}\u{5230}\u{8981}\u{66F4}\u{65B0}\u{7684}\u{9879}\u{76EE}:`,u),l.attributes.forEach(e=>{if(void 0!==o[e]){let t=n._element.attributes[e],i=String(o[e]);t!==i&&(n._element.attributes[e]=i,s(`\u{66F4}\u{65B0}\u{5C5E}\u{6027} ${e}: ${t} -> ${i}`))}}),await r("更新列表项",{listType:e,itemId:t,oldData:u,newData:o,updatedElement:n._element}),i(`${e}\u{9879}\u{76EE}\u{66F4}\u{65B0}\u{6210}\u{529F}:`,{itemId:t,newData:o}),!0}catch(i){throw n(`\u{66F4}\u{65B0}${e}\u{9879}\u{76EE}\u{5931}\u{8D25}:`,{error:i.message,itemId:t,newData:o,stack:i.stack}),i}}isItemExists(e,t){let i=this.getListItems(e);this.listTypes[e];let a=this.getKeyAttributes(e);return i.some(e=>a.every(i=>e[i]===t[i]))}getKeyAttributes(e){return({whitePkg:["name"],ffPkg:["type","pkg"],SysBlack:["name"],alarm:["type","pkg","action"],cpnBroadcast:["type","pkg","action"],cpnService:["type","pkg","cpn","action"],proxyBroadcast:["type","pkg","action"],proxyWL:["type","tag","pkg"],proxyGps:["type","pkg","appType"]})[e]||["pkg"]}generateItemId(e){return btoa(Object.entries(e.attributes||{}).map(([e,t])=>`${e}=${t}`).join("&")).replace(/[^a-zA-Z0-9]/g,"").substring(0,16)}getListTypeConfig(e){return this.listTypes[e]}getSupportedListTypes(){return Object.keys(this.listTypes).map(e=>({key:e,...this.listTypes[e]}))}}class p{constructor(){this.isInitialized=!1,this.hasUnsavedChanges=!1,this.currentConfig=null,this.configManager=null,this.fileManager=null,this.uiManager=null,this.xmlParser=null,this.validationManager=null,this.toastManager=null,this.modalManager=null,this.whitelistManager=null}async initializeModules(){try{await i("开始初始化模块..."),this.toastManager=new h,this.modalManager=new m,this.configManager=new o,this.fileManager=new l,this.uiManager=new u,this.xmlParser=new c,this.validationManager=new d,this.whitelistManager=new g(this.configManager,this.xmlParser,this.toastManager,this.modalManager),await new Promise(e=>setTimeout(e,100)),await i("模块初始化完成")}catch(e){throw await n("模块初始化失败:",e),Error(`\u{6A21}\u{5757}\u{521D}\u{59CB}\u{5316}\u{5931}\u{8D25}: ${e.message}`)}}async initialize(){try{await i("开始初始化 ColorOS 墓碑配置编辑器..."),await this.initializeModules(),await this.bindGlobalEvents(),await this.checkEnvironment(),this.initializeTheme(),this.uiManager.initializeUI(),this.uiManager.setDependencies({whitelistManager:this.whitelistManager,configManager:this.configManager,toastManager:this.toastManager,modalManager:this.modalManager}),await this.loadConfiguration(),this.isInitialized=!0,await i("应用初始化完成"),await r("应用启动",{version:"1.0.0",timestamp:new Date().toISOString()}),this.toastManager.show("应用初始化完成","success")}catch(e){await n("应用初始化失败:",e),this.showInitializationError("初始化失败",e.message)}}showInitializationError(e,t){try{if(this.uiManager&&"function"==typeof this.uiManager.showError)return void this.uiManager.showError(e,t)}catch(e){a("UIManager不可用，使用备用错误显示")}try{let i=document.getElementById("error-message"),a=i?.querySelector("h3"),n=document.getElementById("error-details");a&&(a.textContent=e),n&&(n.textContent=t),i&&i.classList.remove("hidden");let s=document.getElementById("loading");s&&s.classList.add("hidden")}catch(i){n("无法显示错误信息:",i),alert(`${e}: ${t}`)}}async checkEnvironment(){if(!await this.fileManager.checkAPIAvailable())throw await n("KernelSU API不可用"),Error("KernelSU API不可用，请确保在KernelSU环境中运行");await i("运行环境检查通过")}async loadConfiguration(){try{this.uiManager.showLoading();let e=await this.fileManager.readConfigFile();this.currentConfig=this.xmlParser.parse(e),this.configManager.setCurrentConfig(this.currentConfig);let t=this.xmlParser.validateStructure(this.currentConfig);t.isValid||(await a("配置文件结构验证失败:",t.errors),this.toastManager.show("配置文件结构有问题，但仍可编辑","warning")),this.uiManager.setConfigData(this.currentConfig),this.uiManager.renderCurrentSection();let n=await this.fileManager.getFileInfo();this.updateFileStatus(n),this.uiManager.hideLoading(),await i("配置文件加载完成"),await r("配置文件加载",{fileSize:n?.size||0})}catch(e){throw await n("加载配置文件失败:",e),this.uiManager.hideLoading(),e}}async saveConfiguration(){let e=null;try{if(!this.currentConfig)throw Error("没有可保存的配置数据");e=this.toastManager.show("正在保存配置...","loading"),await this.fileManager.createBackup();let t=this.xmlParser.serialize(this.currentConfig);await this.fileManager.writeConfigFile(t),this.hasUnsavedChanges=!1,this.uiManager.updateUnsavedIndicator(!1);let a=await this.fileManager.getFileInfo();this.updateFileStatus(a),e&&this.toastManager.removeToast(e),this.toastManager.show("配置保存成功","success"),await i("配置文件保存完成"),await r("配置保存",{hasChanges:this.hasUnsavedChanges})}catch(t){throw e&&this.toastManager.removeToast(e),await n("保存配置文件失败:",t),this.toastManager.show(`\u{4FDD}\u{5B58}\u{5931}\u{8D25}: ${t.message}`,"error"),t}}async backupConfiguration(){let e=null;try{e=this.toastManager.show("正在创建备份...","loading");let t=await this.fileManager.createBackup();e&&this.toastManager.removeToast(e),this.toastManager.show(`\u{5907}\u{4EFD}\u{521B}\u{5EFA}\u{6210}\u{529F}: ${t}`,"success"),await i("配置备份完成:",t),await r("创建备份",{backupPath:t})}catch(t){e&&this.toastManager.removeToast(e),await n("创建备份失败:",t),this.toastManager.show(`\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${t.message}`,"error")}}async restoreConfiguration(){let e=null;try{if(!await this.modalManager.confirm("恢复备份","确定要恢复备份配置吗？当前的修改将会丢失。"))return;e=this.toastManager.show("正在恢复备份...","loading"),await this.fileManager.restoreBackup(),await this.loadConfiguration(),e&&this.toastManager.removeToast(e),this.toastManager.show("备份恢复成功","success"),await i("配置恢复完成"),await r("恢复备份")}catch(t){e&&this.toastManager.removeToast(e),await n("恢复备份失败:",t),this.toastManager.show(`\u{6062}\u{590D}\u{5931}\u{8D25}: ${t.message}`,"error")}}async handleConfigChange(e,t){try{if(!this.currentConfig)return void await a("配置数据未加载，忽略变更");let n=e.split(".");if(n.length>=2){let e=n[0],i=n[1],s=this.configManager.validateValue(e,i,t);if(!s.isValid){await a("配置验证失败:",s.error),this.toastManager.show(`\u{914D}\u{7F6E}\u{9A8C}\u{8BC1}\u{5931}\u{8D25}: ${s.error}`,"error");return}}this.xmlParser.setValueByPath(this.currentConfig,e,t),this.hasUnsavedChanges=!0,this.uiManager.updateUnsavedIndicator(!0),await i(`\u{914D}\u{7F6E}\u{5DF2}\u{66F4}\u{65B0}: ${e} = ${t}`),await r("配置变更",{path:e,value:t})}catch(e){await n("处理配置变更失败:",e),this.toastManager.show(`\u{914D}\u{7F6E}\u{66F4}\u{65B0}\u{5931}\u{8D25}: ${e.message}`,"error")}}updateFileStatus(e){let t=document.getElementById("file-status"),i=document.getElementById("last-modified");t&&e&&(t.textContent=`\u{914D}\u{7F6E}\u{6587}\u{4EF6}: \u{5DF2}\u{52A0}\u{8F7D} (${(e.size/1024).toFixed(1)} KB)`),i&&e&&(i.textContent=`\u{6700}\u{540E}\u{4FEE}\u{6539}: ${e.lastModified}`)}toggleTheme(){let e=document.body,t=document.querySelector(".theme-icon");"dark"===e.getAttribute("data-theme")?(e.removeAttribute("data-theme"),t&&(t.textContent="\uD83C\uDF19"),localStorage.setItem("theme","light")):(e.setAttribute("data-theme","dark"),t&&(t.textContent="☀️"),localStorage.setItem("theme","dark"))}initializeTheme(){let e=localStorage.getItem("theme"),t=document.body,i=document.querySelector(".theme-icon");"dark"===e?(t.setAttribute("data-theme","dark"),i&&(i.textContent="☀️")):(t.removeAttribute("data-theme"),i&&(i.textContent="\uD83C\uDF19"))}async bindGlobalEvents(){document.addEventListener("configChange",async e=>{let{path:t,value:i}=e.detail;await this.handleConfigChange(t,i)}),document.getElementById("theme-toggle")?.addEventListener("click",()=>{this.toggleTheme()}),document.getElementById("save-btn")?.addEventListener("click",()=>{this.saveConfiguration()}),document.getElementById("backup-btn")?.addEventListener("click",()=>{this.backupConfiguration()}),document.getElementById("restore-btn")?.addEventListener("click",()=>{this.restoreConfiguration()}),document.getElementById("retry-btn")?.addEventListener("click",async()=>{try{let e=document.getElementById("error-message");e&&e.classList.add("hidden");let t=document.getElementById("loading");t&&t.classList.remove("hidden"),await this.initialize()}catch(e){await n("重试失败:",e),this.showInitializationError("重试失败",e.message)}}),window.addEventListener("beforeunload",e=>{this.hasUnsavedChanges&&(e.preventDefault(),e.returnValue="有未保存的更改，确定要离开吗？")}),await i("全局事件绑定完成")}}document.addEventListener("DOMContentLoaded",async()=>{try{window.tombstoneEditor=new p,await window.tombstoneEditor.initialize()}catch(a){n("应用启动失败:",a);let e=document.getElementById("error-message"),t=document.getElementById("error-details");e&&t&&(t.textContent=a.message,e.classList.remove("hidden"));let i=document.getElementById("loading");i&&i.classList.add("hidden")}});