class e{constructor(){this.configDefinitions=this.initializeConfigDefinitions()}initializeConfigDefinitions(){return{enableConfig:{title:"基础开关",description:"控制墓碑机制的基础功能开关",type:"group",items:{hansEnable:{title:"启用全局墓碑机制",description:"控制整个墓碑系统的总开关",type:"boolean"},gmsEnable:{title:"GMS应用优化",description:"对Google移动服务(GMS)应用启用优化",type:"boolean"},releaseStatistic:{title:"释放统计信息",description:"收集并释放统计信息",type:"boolean"},skipToast:{title:"跳过Toast通知",description:"冻结时跳过Toast通知避免唤醒",type:"boolean"},heatGameCloseNet:{title:"高温游戏断网",description:"高温时是否关闭游戏网络",type:"boolean"},dozeRestrictSwitch:{title:"Doze模式限制",description:"在Doze模式下启用限制开关",type:"boolean"},audioByHook:{title:"音频钩子拦截",description:"通过钩子拦截音频事件减少唤醒",type:"boolean"},navigationByHook:{title:"导航钩子拦截",description:"通过钩子拦截导航事件减少唤醒",type:"boolean"},audioCheckEnable:{title:"音频状态检查",description:"启用音频状态检查",type:"boolean"},proxyWakeLockEnable:{title:"WakeLock代理",description:"启用WakeLock代理机制",type:"boolean"},cgp_v2:{title:"CGP v2",description:"使用第二代CGP功耗策略",type:"boolean"},hansWatchDogEnable:{title:"墓碑看门狗",description:"启用墓碑看门狗监控",type:"boolean"},cpnCheckByHook:{title:"组件钩子检查",description:"通过钩子检查组件状态",type:"boolean"},restoreAlarm:{title:"恢复闹钟",description:"解冻时恢复闹钟功能",type:"boolean"},uidGoneRemoveAlarm:{title:"卸载移除闹钟",description:"应用卸载时移除关联闹钟",type:"boolean"},MStateTrimMemConfig:{title:"M状态内存压缩",description:"对M状态应用启用内存压缩",type:"boolean"}}},lcdOffConfig:{title:"熄屏配置",description:"屏幕关闭时的墓碑策略",type:"group",items:{ffTotal:{title:"每次冻结数量",description:"每次冻结的最大应用数",type:"number",unit:"个"},ffInterval:{title:"冻结间隔",description:"冻结尝试间隔时间",type:"number",unit:"毫秒"},interval:{title:"检查间隔",description:"常规检查间隔时间",type:"number",unit:"毫秒"},deepSleepFreezeWhite:{title:"深度睡眠冻结白名单",description:"深度睡眠时冻结白名单应用",type:"boolean"},gameCloseNet:{title:"游戏断网",description:"熄屏时是否关闭游戏网络",type:"boolean"},idleEnable:{title:"空闲检测",description:"启用空闲状态检测",type:"boolean"}}},lcdOnConfig:{title:"亮屏配置",description:"屏幕开启时的墓碑策略",type:"group",items:{RToM:{title:"Recent→M延迟",description:"Recent状态到M状态的冻结延迟",type:"number",unit:"毫秒"},MToF:{title:"M→Frozen延迟",description:"M状态到Frozen状态的冻结延迟",type:"number",unit:"毫秒"},checkImportance:{title:"重要性检查间隔",description:"应用重要性检查间隔",type:"number",unit:"毫秒"},gameCloseNet:{title:"游戏断网",description:"亮屏时是否关闭游戏网络",type:"boolean"}}},ffConfig:{title:"快速冻结配置",description:"快速冻结机制的相关设置",type:"group",items:{enable:{title:"启用快速冻结",description:"是否启用快速冻结功能",type:"boolean"},enterTimeout:{title:"进入超时",description:"进入冻结状态的超时时间",type:"number",unit:"毫秒"},interval:{title:"冻结周期",description:"快速冻结的执行周期",type:"number",unit:"毫秒"},maxFzNum:{title:"最大冻结数",description:"单批次最大冻结应用数量",type:"number",unit:"个"}}},proxyConfig:{title:"功耗代理设置",description:"控制 alarm/service/job/broadcast 等代理开关",type:"group",items:{alarm:{title:"代理Alarm广播",description:"是否代理 AlarmManager 广播",type:"boolean"},service:{title:"代理Service广播",description:"是否代理 Service 广播",type:"boolean"},job:{title:"代理JobScheduler事件",description:"是否代理 JobScheduler 事件",type:"boolean"},broadcast:{title:"代理常规广播",description:"是否代理常规广播",type:"boolean"},proxyBCmax:{title:"最大代理广播数",description:"允许代理的最大广播数",type:"number",unit:"条"}}},superFreezeConfig:{title:"内存优化",description:"Super Freeze 相关设置",type:"group",items:{enable:{title:"启用Super Freeze",description:"是否启用 Super Freeze 机制",type:"boolean"}}},cpuCtlRus:{title:"CPU管控",description:"CPU 使用率阈值及采集配置",type:"group",items:{shortCommCpuRateCtl:{title:"短期通信CPU阈值",description:"短期通信CPU使用率阈值(%)",type:"number",unit:"%"},longCommCpuRateCtl:{title:"长期通信CPU阈值",description:"长期通信CPU使用率阈值(%)",type:"number",unit:"%"},shortSysCpuRateCtl:{title:"短期系统CPU阈值",description:"短期系统CPU使用率阈值(% * 核心数)",type:"number",unit:"%"},collectCpuInfoCycle:{title:"CPU信息收集周期",description:"CPU信息收集周期(毫秒)",type:"number",unit:"毫秒"},cpuCollectEnable:{title:"启用CPU信息收集",description:"是否启用CPU信息收集",type:"boolean"}}},restrictNet:{title:"游戏网络限制",description:"针对特定应用类型在场景中限制网络",type:"group",items:{appTypeValue:{title:"应用类型值",description:"如4代表游戏",type:"number"},delayTime:{title:"限制延迟",description:"延迟执行限制的时间",type:"number",unit:"毫秒"}}},thermalMode:{title:"高温模式",description:"设备温度触发的性能/功耗策略",type:"group",items:{enable:{title:"启用高温模式",description:"是否启用高温模式策略",type:"boolean"},enterLevel:{title:"进入温度等级",description:"达到该温度等级时进入高温模式",type:"number"},exitLevel:{title:"退出温度等级",description:"降至该温度等级时退出高温模式",type:"number"}}}}}updateValue(e,t,i){try{let n=t.split("."),s=e;for(let e=0;e<n.length-1;e++){let i=n[e];if(s.children){let e=s.children.find(e=>e.tagName===i);e||(e={tagName:i,attributes:{},children:[],textContent:""},s.children.push(e)),s=e}else throw Error(`\u{65E0}\u{6548}\u{7684}\u{914D}\u{7F6E}\u{8DEF}\u{5F84}: ${t}`)}let o=n[n.length-1];if(s.attributes)s.attributes[o]=String(i),console.log(`\u{914D}\u{7F6E}\u{5DF2}\u{66F4}\u{65B0}: ${t} = ${i}`);else throw Error(`\u{65E0}\u{6CD5}\u{8BBE}\u{7F6E}\u{914D}\u{7F6E}\u{503C}: ${t}`)}catch(e){throw console.error("更新配置值失败:",e),e}}getValue(e,t){try{let i=t.split("."),n=e;for(let e of i)if(n.children){let t=n.children.find(t=>t.tagName===e);if(t)n=t;else if(n.attributes&&void 0!==n.attributes[e])return n.attributes[e];else return}else if(n.attributes&&void 0!==n.attributes[e])return n.attributes[e];else return;return n}catch(e){console.error("获取配置值失败:",e);return}}getConfigDefinition(e){return this.configDefinitions[e]||null}getAllSections(){return Object.keys(this.configDefinitions)}validateValue(e,t,i){let n=this.configDefinitions[e];if(!n||!n.items||!n.items[t])return{isValid:!1,error:"未知的配置项"};switch(n.items[t].type){case"boolean":if("true"!==i&&"false"!==i)return{isValid:!1,error:"值必须是true或false"};break;case"number":if(isNaN(parseFloat(i)))return{isValid:!1,error:"值必须是数字"};break;case"string":if("string"!=typeof i)return{isValid:!1,error:"值必须是字符串"}}return{isValid:!0}}}let t=0;function i(e,i){return void 0===i&&(i={}),new Promise((n,s)=>{let o=`exec_callback_${Date.now()}_${t++}`;function r(e){delete window[e]}window[o]=(e,t,i)=>{n({errno:e,stdout:t,stderr:i}),r(o)};try{ksu.exec(e,JSON.stringify(i),o)}catch(e){s(e),r(o)}})}function n(){this.listeners={}}function s(){this.listeners={},this.stdin=new n,this.stdout=new n,this.stderr=new n}n.prototype.on=function(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)},n.prototype.emit=function(e,...t){this.listeners[e]&&this.listeners[e].forEach(e=>e(...t))},s.prototype.on=function(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)},s.prototype.emit=function(e,...t){this.listeners[e]&&this.listeners[e].forEach(e=>e(...t))};class o{constructor(){this.configPath="/data/oplus/os/bpm/sys_elsa_config_list.xml",this.backupPath="/data/local/tmp/sys_elsa_config_list.xml.bak",this.tempDir="/data/local/tmp/tombstone_temp",this.initializeDirectories()}async initializeDirectories(){try{await i(`mkdir -p "${this.tempDir}"`),await i(`chmod 755 "${this.tempDir}"`),console.log("目录初始化完成")}catch(e){console.warn("目录初始化警告:",e.message)}}async checkAPIAvailable(){try{let e=await i('echo "test"');return 0===e.errno}catch(e){return console.error("KernelSU API检查失败:",e),!1}}async checkConfigFileExists(){try{let e=await i(`test -f "${this.configPath}"`);return 0===e.errno}catch(e){return!1}}async readConfigFile(){try{if(!await this.checkConfigFileExists())throw Error(`\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{4E0D}\u{5B58}\u{5728}: ${this.configPath}`);let e=await i(`cat "${this.configPath}"`);if(0!==e.errno)throw Error(`\u{8BFB}\u{53D6}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${e.stderr||"未知错误"}`);if(!e.stdout||0===e.stdout.trim().length)throw Error("配置文件为空");return console.log("配置文件读取成功"),e.stdout}catch(e){throw console.error("读取配置文件失败:",e),Error(`\u{8BFB}\u{53D6}\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${e.message}`)}}async writeConfigFile(e){try{if(!e||0===e.trim().length)throw Error("配置内容不能为空");let t=`${this.tempDir}/config_temp_${Date.now()}.xml`,n=e.replace(/'/g,"'\"'\"'"),s=await i(`echo '${n}' > "${t}"`);if(0!==s.errno)throw Error(`\u{5199}\u{5165}\u{4E34}\u{65F6}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${s.stderr}`);let o=await i(`test -f "${t}" && test -s "${t}"`);if(0!==o.errno)throw Error("临时文件验证失败");let r=await i(`cp "${t}" "${this.configPath}"`);if(0!==r.errno)throw Error(`\u{590D}\u{5236}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${r.stderr}`);await i(`chmod 644 "${this.configPath}"`),await i(`chown system:system "${this.configPath}"`),await i(`rm -f "${t}"`),console.log("配置文件写入成功")}catch(e){throw console.error("写入配置文件失败:",e),Error(`\u{5199}\u{5165}\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${e.message}`)}}async createBackup(){try{if(!await this.checkConfigFileExists())throw Error("原配置文件不存在，无法创建备份");let e=await i(`cp "${this.configPath}" "${this.backupPath}"`);if(0!==e.errno)throw Error(`\u{521B}\u{5EFA}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.stderr}`);return await i(`chmod 644 "${this.backupPath}"`),console.log(`\u{5907}\u{4EFD}\u{521B}\u{5EFA}\u{6210}\u{529F}: ${this.backupPath}`),this.backupPath}catch(e){throw console.error("创建备份失败:",e),Error(`\u{521B}\u{5EFA}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.message}`)}}async checkBackupExists(){try{let e=await i(`test -f "${this.backupPath}"`);return 0===e.errno}catch(e){return!1}}async getBackupInfo(){try{if(!await this.checkBackupExists())return null;let e=await i(`stat "${this.backupPath}"`);if(0!==e.errno)return null;let t=e.stdout,n=t.match(/Size:\s+(\d+)/),s=t.match(/Modify:\s+([^\n]+)/);return{path:this.backupPath,filename:"sys_elsa_config_list.xml.bak",size:n?parseInt(n[1]):0,lastModified:s?s[1].trim():"Unknown",exists:!0}}catch(e){return console.error("获取备份信息失败:",e),null}}async restoreBackup(){try{if(!await this.checkBackupExists())throw Error("备份文件不存在");let e=await i(`head -1 "${this.backupPath}"`);if(0!==e.errno||!e.stdout.includes("<?xml"))throw Error("备份文件格式无效");let t=await i(`cp "${this.backupPath}" "${this.configPath}"`);if(0!==t.errno)throw Error(`\u{6062}\u{590D}\u{6587}\u{4EF6}\u{5931}\u{8D25}: ${t.stderr}`);await i(`chmod 644 "${this.configPath}"`),await i(`chown system:system "${this.configPath}"`),console.log(`\u{914D}\u{7F6E}\u{6587}\u{4EF6}\u{5DF2}\u{6062}\u{590D}: ${this.backupPath}`)}catch(e){throw console.error("恢复备份失败:",e),Error(`\u{6062}\u{590D}\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.message}`)}}async deleteBackup(){try{if(!await this.checkBackupExists())return void console.log("备份文件不存在，无需删除");await i(`rm -f "${this.backupPath}"`),console.log("备份文件已删除")}catch(e){console.warn("删除备份文件时出现警告:",e.message)}}async getFileInfo(){try{if(!await this.checkConfigFileExists())return null;let e=await i(`stat "${this.configPath}"`);if(0!==e.errno)throw Error("获取文件信息失败");let t=e.stdout,n=t.match(/Size:\s+(\d+)/),s=t.match(/Modify:\s+([^\n]+)/);return{path:this.configPath,size:n?parseInt(n[1]):0,lastModified:s?s[1].trim():"Unknown",exists:!0}}catch(e){return console.error("获取文件信息失败:",e),null}}async validateFileIntegrity(e=null){try{let t=e||this.configPath,n=await i(`test -f "${t}" && test -s "${t}"`);if(0!==n.errno)return!1;let s=await i(`head -1 "${t}"`);if(0!==s.errno||!s.stdout.includes("<?xml"))return!1;return!0}catch(e){return console.error("文件完整性验证失败:",e),!1}}}class r{constructor(){this.currentSection="basic",this.searchTerm="",this.configData=null,this.bindEvents()}initializeUI(){this.setupNavigation(),this.setupSearch(),this.hideLoading()}setupNavigation(){document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let i=e.dataset.section;this.switchSection(i)})})}setupSearch(){let e=document.getElementById("search-input");e&&e.addEventListener("input",e=>{this.searchTerm=e.target.value.toLowerCase(),this.filterConfigItems()})}switchSection(e){document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("active")});let t=document.querySelector(`[data-section="${e}"]`);t&&t.classList.add("active"),this.currentSection=e,this.renderCurrentSection()}renderCurrentSection(){if(!this.configData)return;let e=document.getElementById("config-container");if(e){switch(this.currentSection){case"basic":this.renderBasicConfig(e);break;case"screen":this.renderScreenConfig(e);break;case"freeze":this.renderFreezeConfig(e);break;case"proxy":this.renderProxyConfig(e);break;case"memory":this.renderMemoryConfig(e);break;case"cpu":this.renderCpuConfig(e);break;case"special":this.renderSpecialConfig(e);break;case"whitelist":this.renderWhitelistConfig(e);break;case"blacklist":this.renderBlacklistConfig(e);break;default:e.innerHTML="<p>未知的配置节</p>"}e.classList.remove("hidden")}}renderBasicConfig(e){if(!this.findConfigElement("enableConfig")){e.innerHTML="<p>未找到基础配置数据</p>";return}e.innerHTML=`
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
        `}renderWakeLockRules(){let e=this.findConfigElement("proxyWL");if(!e||!e.children)return'<div class="config-item-description">暂无WakeLock代理规则</div>';let t="";return e.children.forEach((e,i)=>{if("wakelock"===e.tagName){let n=e.attributes.type||"",s=e.attributes.tag||"",o=e.attributes.pkg||"",r=e.attributes.proxy||"",a=e.attributes.enable||"true";t+=`
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">\u{89C4}\u{5219} ${i+1}: ${n}</div>
                            <div class="rule-details">
                                <span class="rule-tag">\u{6807}\u{7B7E}: ${s}</span>
                                <span class="rule-pkg">\u{5305}\u{540D}: ${o}</span>
                                <span class="rule-proxy">\u{4EE3}\u{7406}\u{7EA7}\u{522B}: ${r}</span>
                                <span class="rule-status ${"true"===a?"enabled":"disabled"}">
                                    ${"true"===a?"启用":"禁用"}
                                </span>
                            </div>
                        </div>
                        <div class="rule-actions">
                            <button class="btn btn-sm btn-secondary" onclick="uiManager.editWakeLockRule(${i})">\u{7F16}\u{8F91}</button>
                            <button class="btn btn-sm btn-danger" onclick="uiManager.deleteWakeLockRule(${i})">\u{5220}\u{9664}</button>
                        </div>
                    </div>
                `}}),t||'<div class="config-item-description">暂无WakeLock代理规则</div>'}renderGpsRules(){let e=this.findConfigElement("proxyGps");if(!e||!e.children)return'<div class="config-item-description">暂无GPS代理规则</div>';let t="";return e.children.forEach((e,i)=>{if("item"===e.tagName){let n=e.attributes.type||"",s=e.attributes.appType||"",o=e.attributes.recentUse||"",r=e.attributes.stillInterval||"";t+=`
                    <div class="config-rule-item">
                        <div class="rule-info">
                            <div class="rule-title">\u{89C4}\u{5219} ${i+1}: ${n}</div>
                            <div class="rule-details">
                                <span class="rule-tag">\u{5E94}\u{7528}\u{7C7B}\u{578B}: ${s}</span>
                                <span class="rule-pkg">\u{6700}\u{8FD1}\u{4F7F}\u{7528}: ${o}\u{5206}\u{949F}</span>
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
        `}renderWhitelistConfig(e){e.innerHTML='<div class="config-section"><h2>白名单管理</h2><p>此功能正在开发中...</p></div>'}renderBlacklistConfig(e){e.innerHTML='<div class="config-section"><h2>黑名单管理</h2><p>此功能正在开发中...</p></div>'}renderConfigItem(e,t,i,n,s,o=""){let r=this.getConfigValue(e,t),a=`${e}.${t}`,l="";switch(s){case"boolean":l=`
                    <div class="switch-container">
                        <div class="switch">
                            <input type="checkbox" id="${a}" ${"true"===r?"checked":""} 
                                   onchange="handleConfigChange('${a}', this.checked ? 'true' : 'false')">
                            <span class="switch-slider"></span>
                        </div>
                    </div>
                `;break;case"number":l=`
                    <div class="number-input-container">
                        <input type="number" class="form-input number-input" id="${a}" 
                               value="${r||""}" 
                               onchange="handleConfigChange('${a}', this.value)">
                        ${o?`<span class="number-unit">${o}</span>`:""}
                    </div>
                `;break;case"string":l=`
                    <input type="text" class="form-input" id="${a}" 
                           value="${r||""}" 
                           onchange="handleConfigChange('${a}', this.value)">
                `}return`
            <div class="config-item" data-search="${i.toLowerCase()} ${n.toLowerCase()}">
                <div class="config-item-info">
                    <div class="config-item-title">${i}</div>
                    <div class="config-item-description">${n}</div>
                </div>
                <div class="config-item-control">
                    ${l}
                </div>
            </div>
        `}getConfigValue(e,t){if(!this.configData)return"";let i=this.findConfigElement(e);return i&&i.attributes&&i.attributes[t]||""}findConfigElement(e){return this.configData&&this.configData.children&&this.configData.children.find(t=>t.tagName===e)||null}filterConfigItems(){document.querySelectorAll(".config-item").forEach(e=>{let t=(e.dataset.search||"").includes(this.searchTerm);e.style.display=t?"flex":"none"})}setConfigData(e){this.configData=e,this.renderCurrentSection()}renderConfigSections(e){this.setConfigData(e)}showLoading(e="正在加载..."){let t=document.getElementById("loading"),i=t.querySelector("p");i&&(i.textContent=e),t.classList.remove("hidden"),document.getElementById("config-container").classList.add("hidden"),document.getElementById("error-message").classList.add("hidden")}hideLoading(){document.getElementById("loading").classList.add("hidden")}showError(e,t){let i=document.getElementById("error-message"),n=i.querySelector("h3"),s=document.getElementById("error-details");n&&(n.textContent=e),s&&(s.textContent=t),i.classList.remove("hidden"),document.getElementById("loading").classList.add("hidden"),document.getElementById("config-container").classList.add("hidden")}updateUnsavedIndicator(e){let t=document.getElementById("unsaved-changes");t&&(e?t.classList.remove("hidden"):t.classList.add("hidden"))}bindEvents(){window.handleConfigChange=(e,t)=>{let i=new CustomEvent("configChange",{detail:{path:e,value:t}});document.dispatchEvent(i)}}showWakeLockEditor(){let e=`
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
        `;document.body.insertAdjacentHTML("beforeend",e)}saveWakeLockRule(){let e=document.getElementById("wl-type").value,t=document.getElementById("wl-tag").value,i=document.getElementById("wl-pkg").value,n=document.getElementById("wl-proxy").value,s=document.getElementById("wl-enable").checked;if(!t||!i)return void alert("请填写完整的规则信息");let o={tagName:"wakelock",attributes:{type:e,tag:t,pkg:i,proxy:n,enable:s.toString()},children:[],textContent:""},r=this.findConfigElement("proxyWL");r||(r={tagName:"proxyWL",attributes:{},children:[],textContent:""},this.configData.children.push(r)),r.children.push(o);let a=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(a),this.closeModal("wakelock-modal"),this.renderCurrentSection()}saveGpsRule(){let e=document.getElementById("gps-type").value,t=document.getElementById("gps-apptype").value,i=document.getElementById("gps-recent").value,n=document.getElementById("gps-interval").value;if(!t||!i||!n)return void alert("请填写完整的规则信息");let s=this.findConfigElement("proxyGps");s||(s={tagName:"proxyGps",attributes:{},children:[],textContent:""},this.configData.children.push(s)),s.children.push({tagName:"item",attributes:{type:e,appType:t,recentUse:i,stillInterval:n},children:[],textContent:""});let o=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(o),this.closeModal("gps-modal"),this.renderCurrentSection()}editWakeLockRule(e){let t=this.findConfigElement("proxyWL");if(!t||!t.children[e])return;let i=t.children[e];this.showWakeLockEditor(),setTimeout(()=>{document.getElementById("wl-type").value=i.attributes.type||"proxy",document.getElementById("wl-tag").value=i.attributes.tag||"",document.getElementById("wl-pkg").value=i.attributes.pkg||"",document.getElementById("wl-proxy").value=i.attributes.proxy||"4",document.getElementById("wl-enable").checked="false"!==i.attributes.enable},100),setTimeout(()=>{let t=document.querySelector("#wakelock-modal .btn-primary");t&&(t.onclick=()=>this.updateWakeLockRule(e))},100)}updateWakeLockRule(e){let t=this.findConfigElement("proxyWL");if(!t||!t.children[e])return;let i=document.getElementById("wl-type").value,n=document.getElementById("wl-tag").value,s=document.getElementById("wl-pkg").value,o=document.getElementById("wl-proxy").value,r=document.getElementById("wl-enable").checked;if(!n||!s)return void alert("请填写完整的规则信息");t.children[e].attributes={type:i,tag:n,pkg:s,proxy:o,enable:r.toString()};let a=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(a),this.closeModal("wakelock-modal"),this.renderCurrentSection()}deleteWakeLockRule(e){if(!confirm("确定要删除这个WakeLock规则吗？"))return;let t=this.findConfigElement("proxyWL");if(t&&t.children[e]){t.children.splice(e,1);let i=new CustomEvent("configChange",{detail:{path:"proxyWL",value:"updated"}});document.dispatchEvent(i),this.renderCurrentSection()}}editGpsRule(e){let t=this.findConfigElement("proxyGps");if(!t||!t.children[e])return;let i=t.children[e];this.showGpsEditor(),setTimeout(()=>{document.getElementById("gps-type").value=i.attributes.type||"white",document.getElementById("gps-apptype").value=i.attributes.appType||"11",document.getElementById("gps-recent").value=i.attributes.recentUse||"",document.getElementById("gps-interval").value=i.attributes.stillInterval||""},100),setTimeout(()=>{let t=document.querySelector("#gps-modal .btn-primary");t&&(t.onclick=()=>this.updateGpsRule(e))},100)}updateGpsRule(e){let t=this.findConfigElement("proxyGps");if(!t||!t.children[e])return;let i=document.getElementById("gps-type").value,n=document.getElementById("gps-apptype").value,s=document.getElementById("gps-recent").value,o=document.getElementById("gps-interval").value;if(!n||!s||!o)return void alert("请填写完整的规则信息");t.children[e].attributes={type:i,appType:n,recentUse:s,stillInterval:o};let r=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(r),this.closeModal("gps-modal"),this.renderCurrentSection()}deleteGpsRule(e){if(!confirm("确定要删除这个GPS规则吗？"))return;let t=this.findConfigElement("proxyGps");if(t&&t.children[e]){t.children.splice(e,1);let i=new CustomEvent("configChange",{detail:{path:"proxyGps",value:"updated"}});document.dispatchEvent(i),this.renderCurrentSection()}}closeModal(e){let t=document.getElementById(e);t&&t.remove()}}class a{constructor(){this.parser=new DOMParser,this.serializer=new XMLSerializer}parse(e){try{let t=this.parser.parseFromString(e,"text/xml"),i=t.querySelector("parsererror");if(i)throw Error(`XML\u{89E3}\u{6790}\u{9519}\u{8BEF}: ${i.textContent}`);let n=t.documentElement;if(!n||"filter-conf"!==n.tagName)throw Error("无效的配置文件格式，缺少filter-conf根节点");let s=this.parseElement(n);return console.log("XML解析完成:",s),s}catch(e){throw console.error("XML解析失败:",e),Error(`XML\u{89E3}\u{6790}\u{5931}\u{8D25}: ${e.message}`)}}serialize(e){try{let t=document.implementation.createDocument(null,"filter-conf",null),i=t.documentElement;this.buildElement(t,i,e);let n=this.serializer.serializeToString(t);return n='<?xml version="1.0" encoding="utf-8"?>\n'+n,n=this.formatXML(n),console.log("XML序列化完成"),n}catch(e){throw console.error("XML序列化失败:",e),Error(`XML\u{5E8F}\u{5217}\u{5316}\u{5931}\u{8D25}: ${e.message}`)}}parseElement(e){let t={tagName:e.tagName,attributes:{},children:[],textContent:""};for(let i of e.attributes)t.attributes[i.name]=i.value;for(let i of e.childNodes)if(i.nodeType===Node.ELEMENT_NODE)t.children.push(this.parseElement(i));else if(i.nodeType===Node.TEXT_NODE){let e=i.textContent.trim();e&&(t.textContent+=e)}return t}buildElement(e,t,i){if(i.attributes)for(let[e,n]of Object.entries(i.attributes))t.setAttribute(e,n);if(i.textContent&&(t.textContent=i.textContent),i.children&&i.children.length>0)for(let n of i.children){let i=e.createElement(n.tagName);t.appendChild(i),this.buildElement(e,i,n)}}formatXML(e){let t=[];e=e.replace(/(>)(<)(\/*)/g,"$1\n$2$3");let i=0;return e.split("\n").forEach(e=>{let n=0;e.match(/.+<\/\w[^>]*>$/)?n=0:e.match(/^<\/\w/)?0!==i&&(i-=1):n=+!!e.match(/^<\w[^>]*[^\/]>.*$/);let s="    ".repeat(i);t.push(s+e),i+=n}),t.join("\n")}getValueByPath(e,t){let i=t.split("."),n=e;for(let e of i)if(e.includes("[")&&e.includes("]")){let[t,i]=e.split("["),s=parseInt(i.replace("]",""));n=n[t]&&n[t][s]}else if(n&&n.children){let t=n.children.find(t=>t.tagName===e);if(t)n=t;else if(n.attributes&&void 0!==n.attributes[e])return n.attributes[e];else return}else if(n&&n.attributes&&void 0!==n.attributes[e])return n.attributes[e];else return;return n}setValueByPath(e,t,i){let n=t.split("."),s=e;for(let e=0;e<n.length-1;e++){let t=n[e];if(t.includes("[")&&t.includes("]")){let[e,i]=t.split("["),n=parseInt(i.replace("]",""));s=s[e]&&s[e][n]}else if(s&&s.children){let e=s.children.find(e=>e.tagName===t);e||(e={tagName:t,attributes:{},children:[],textContent:""},s.children.push(e)),s=e}}let o=n[n.length-1];s&&void 0!==s.attributes&&(s.attributes[o]=i)}findElementsByTagName(e,t){let i=[],n=e=>{e.tagName===t&&i.push(e),e.children&&e.children.forEach(n)};return n(e),i}validateStructure(e){let t=[],i=[];if(!e||"filter-conf"!==e.tagName)return t.push("缺少有效的filter-conf根节点"),{isValid:!1,errors:t,warnings:i};for(let t of["version","filter-name","enableConfig","lcdOffConfig","lcdOnConfig"])0===this.findElementsByTagName(e,t).length&&i.push(`\u{7F3A}\u{5C11}\u{63A8}\u{8350}\u{7684}\u{914D}\u{7F6E}\u{8282}\u{70B9}: ${t}`);return{isValid:0===t.length,errors:t,warnings:i}}}class l{constructor(){this.validationRules=this.initializeValidationRules()}initializeValidationRules(){return{enableConfig:{required:!0,attributes:{hansEnable:{type:"boolean",required:!0},gmsEnable:{type:"boolean",required:!0},releaseStatistic:{type:"boolean",required:!0},skipToast:{type:"boolean",required:!0},heatGameCloseNet:{type:"boolean",required:!0},dozeRestrictSwitch:{type:"boolean",required:!0},audioByHook:{type:"boolean",required:!0},navigationByHook:{type:"boolean",required:!0},audioCheckEnable:{type:"boolean",required:!0},proxyWakeLockEnable:{type:"boolean",required:!0},cgp_v2:{type:"boolean",required:!0},hansWatchDogEnable:{type:"boolean",required:!0},cpnCheckByHook:{type:"boolean",required:!0},restoreAlarm:{type:"boolean",required:!0},uidGoneRemoveAlarm:{type:"boolean",required:!0},MStateTrimMemConfig:{type:"boolean",required:!0}}},lcdOffConfig:{required:!0,attributes:{ffTotal:{type:"number",required:!0},ffInterval:{type:"number",required:!0},interval:{type:"number",required:!0},deepSleepFreezeWhite:{type:"boolean",required:!0},gameCloseNet:{type:"boolean",required:!0},idleEnable:{type:"boolean",required:!0}}},lcdOnConfig:{required:!0,attributes:{RToM:{type:"number",required:!0},MToF:{type:"number",required:!0},checkImportance:{type:"number",required:!0},gameCloseNet:{type:"boolean",required:!0}}},ffConfig:{required:!0,attributes:{enable:{type:"boolean",required:!0},enterTimeout:{type:"number",required:!0},interval:{type:"number",required:!0},maxFzNum:{type:"number",required:!0}}},proxyConfig:{required:!1,attributes:{alarm:{type:"boolean",required:!0},service:{type:"boolean",required:!0},job:{type:"boolean",required:!0},broadcast:{type:"boolean",required:!0},proxyBCmax:{type:"number",required:!0}}},superFreezeConfig:{required:!1,attributes:{enable:{type:"boolean",required:!0}}},cpuCtlRus:{required:!1,attributes:{shortCommCpuRateCtl:{type:"number",required:!0},longCommCpuRateCtl:{type:"number",required:!0},shortSysCpuRateCtl:{type:"number",required:!0},collectCpuInfoCycle:{type:"number",required:!0},cpuCollectEnable:{type:"boolean",required:!0}}},restrictNet:{required:!1,attributes:{appTypeValue:{type:"number",required:!0},delayTime:{type:"number",required:!0}}},thermalMode:{required:!1,attributes:{enable:{type:"boolean",required:!0},enterLevel:{type:"number",required:!0},exitLevel:{type:"number",required:!0}}}}}validateConfig(e){let t=[],i=[];try{if(!e||"filter-conf"!==e.tagName)return t.push("配置文件缺少有效的filter-conf根节点"),{isValid:!1,errors:t,warnings:i};for(let[n,s]of Object.entries(this.validationRules)){let o=this.validateSection(e,n,s);t.push(...o.errors),i.push(...o.warnings)}let n=this.validateVersion(e);return i.push(...n.warnings),{isValid:0===t.length,errors:t,warnings:i}}catch(e){return console.error("配置验证过程中发生错误:",e),t.push(`\u{9A8C}\u{8BC1}\u{8FC7}\u{7A0B}\u{4E2D}\u{53D1}\u{751F}\u{9519}\u{8BEF}: ${e.message}`),{isValid:!1,errors:t,warnings:i}}}validateSection(e,t,i){let n=[],s=[],o=this.findConfigElement(e,t);if(!o)return i.required?n.push(`\u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{7684}\u{914D}\u{7F6E}\u{8282}: ${t}`):s.push(`\u{7F3A}\u{5C11}\u{53EF}\u{9009}\u{7684}\u{914D}\u{7F6E}\u{8282}: ${t}`),{errors:n,warnings:s};if(i.attributes)for(let[e,r]of Object.entries(i.attributes)){let i=this.validateAttribute(o,e,r,t);n.push(...i.errors),s.push(...i.warnings)}return{errors:n,warnings:s}}validateAttribute(e,t,i,n){let s=[],o=[],r=e.attributes?e.attributes[t]:void 0;if(i.required&&(void 0===r||""===r))return s.push(`${n}.${t}: \u{7F3A}\u{5C11}\u{5FC5}\u{9700}\u{7684}\u{5C5E}\u{6027}`),{errors:s,warnings:o};if(void 0===r||""===r)return{errors:s,warnings:o};switch(i.type){case"boolean":"true"!==r&&"false"!==r&&s.push(`${n}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}'true'\u{6216}'false'\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${r}`);break;case"number":let a=parseInt(r);isNaN(a)?s.push(`${n}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}\u{6570}\u{5B57}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${r}`):(void 0!==i.min&&a<i.min&&s.push(`${n}.${t}: \u{503C}\u{4E0D}\u{80FD}\u{5C0F}\u{4E8E}${i.min}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${a}`),void 0!==i.max&&a>i.max&&s.push(`${n}.${t}: \u{503C}\u{4E0D}\u{80FD}\u{5927}\u{4E8E}${i.max}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${a}`),void 0!==i.recommendedMin&&a<i.recommendedMin&&o.push(`${n}.${t}: \u{5EFA}\u{8BAE}\u{503C}\u{4E0D}\u{5C0F}\u{4E8E}${i.recommendedMin}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${a}`),void 0!==i.recommendedMax&&a>i.recommendedMax&&o.push(`${n}.${t}: \u{5EFA}\u{8BAE}\u{503C}\u{4E0D}\u{5927}\u{4E8E}${i.recommendedMax}\u{FF0C}\u{5F53}\u{524D}\u{503C}: ${a}`));break;case"string":"string"!=typeof r?s.push(`${n}.${t}: \u{503C}\u{5FC5}\u{987B}\u{662F}\u{5B57}\u{7B26}\u{4E32}\u{FF0C}\u{5F53}\u{524D}\u{7C7B}\u{578B}: ${typeof r}`):(void 0!==i.minLength&&r.length<i.minLength&&s.push(`${n}.${t}: \u{5B57}\u{7B26}\u{4E32}\u{957F}\u{5EA6}\u{4E0D}\u{80FD}\u{5C0F}\u{4E8E}${i.minLength}`),void 0!==i.maxLength&&r.length>i.maxLength&&s.push(`${n}.${t}: \u{5B57}\u{7B26}\u{4E32}\u{957F}\u{5EA6}\u{4E0D}\u{80FD}\u{5927}\u{4E8E}${i.maxLength}`),i.pattern&&!i.pattern.test(r)&&s.push(`${n}.${t}: \u{503C}\u{683C}\u{5F0F}\u{4E0D}\u{6B63}\u{786E}`))}return{errors:s,warnings:o}}validateVersion(e){let t=[],i=this.findConfigElement(e,"version");if(!i)return t.push("缺少版本信息"),{warnings:t};let n=i.textContent;return n&&""!==n.trim()?/^\d{10}$/.test(n.trim())||t.push(`\u{7248}\u{672C}\u{683C}\u{5F0F}\u{53EF}\u{80FD}\u{4E0D}\u{6B63}\u{786E}: ${n}`):t.push("版本信息为空"),{warnings:t}}validateValue(e,t,i){let n=this.validationRules[e];if(!n||!n.attributes||!n.attributes[t])return{isValid:!1,error:"未知的配置项"};let s=n.attributes[t],o=this.validateAttribute({attributes:{[t]:i}},t,s,e);return{isValid:0===o.errors.length,error:o.errors[0]||null,warning:o.warnings[0]||null}}checkCompatibility(e){let t=[],i=this.findConfigElement(e,"enableConfig");if(i&&i.attributes){let e=i.attributes;"false"===e.audioByHook&&"true"===e.audioCheckEnable&&t.push("音频钩子拦截已禁用，但音频状态检查仍启用，可能导致功能冲突"),"false"===e.proxyWakeLockEnable&&"true"===e.cgp_v2&&t.push("WakeLock代理已禁用，但CGP v2仍启用，可能影响功耗优化效果")}let n=this.findConfigElement(e,"lcdOffConfig"),s=this.findConfigElement(e,"lcdOnConfig");if(n&&s){let e=parseInt(n.attributes?.ffInterval||"0"),i=parseInt(s.attributes?.RToM||"0");e>0&&i>0&&e>i&&t.push("熄屏冻结间隔大于亮屏Recent→M延迟，可能导致策略冲突")}return{warnings:t}}findConfigElement(e,t){return e&&e.children&&e.children.find(e=>e.tagName===t)||null}validateRealTime(e,t,i,n){let s=this.validateValue(e,t,i);n.classList.remove("input-valid","input-invalid");let o=n.parentNode.querySelector(".validation-error");if(o&&o.remove(),s.isValid){if(n.classList.add("input-valid"),s.warning){let e=document.createElement("div");e.className="validation-warning",e.textContent=s.warning,n.parentNode.appendChild(e)}return!0}{n.classList.add("input-invalid");let e=document.createElement("div");return e.className="validation-error",e.textContent=s.error,n.parentNode.appendChild(e),!1}}validateForm(e){let t=[],i=[],n=!0;return e.querySelectorAll("[data-config-path]").forEach(e=>{let s=e.dataset.configPath,[o,r]=s.split("."),a="checkbox"===e.type?e.checked?"true":"false":e.value,l=this.validateValue(o,r,a);l.isValid||(t.push(`${s}: ${l.error}`),n=!1),l.warning&&i.push(`${s}: ${l.warning}`)}),{isValid:n,errors:t,warnings:i}}displayValidationResult(e,t){if(t.innerHTML="",e.isValid){let e=document.createElement("div");e.className="validation-success",e.innerHTML='<span class="icon">✅</span> 配置验证通过',t.appendChild(e)}else{let i=document.createElement("div");i.className="validation-errors",i.innerHTML=`
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
`})),t}exportValidationResult(e){return JSON.stringify(this.createValidationSummary(e),null,2)}}class u{constructor(){this.container=null,this.toasts=new Map,this.autoCloseDelay=5e3,this.maxToasts=5,this.initializeContainer()}initializeContainer(){this.container=document.getElementById("toast-container"),this.container||console.warn("Toast容器未找到")}show(e,t="info",i=this.autoCloseDelay){if("loading"===t)return this.showLoading(e);this.showToast(t,"",e,i)}showSuccess(e,t,i=this.autoCloseDelay){this.showToast("success",e,t,i)}showError(e,t,i=2*this.autoCloseDelay){this.showToast("error",e,t,i)}showWarning(e,t,i=this.autoCloseDelay){this.showToast("warning",e,t,i)}showInfo(e,t,i=this.autoCloseDelay){this.showToast("info",e,t,i)}showToast(e,t,i,n=this.autoCloseDelay){if(!this.container)return void console.warn("Toast容器未初始化");if(this.toasts.size>=this.maxToasts){let e=this.toasts.keys().next().value;this.removeToast(e)}let s=`toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=this.createToastElement(s,e,t,i);this.container.appendChild(o),this.toasts.set(s,{element:o,type:e,title:t,message:i,createdAt:Date.now()}),setTimeout(()=>{o.classList.add("toast-show")},10),n>0&&setTimeout(()=>{this.removeToast(s)},n);let r=o.querySelector(".toast-close");return r&&r.addEventListener("click",()=>{this.removeToast(s)}),console.log(`Toast\u{663E}\u{793A}: [${e.toUpperCase()}] ${t} - ${i}`),s}createToastElement(e,t,i,n){let s=document.createElement("div");s.id=e,s.className=`toast toast-${t}`;let o={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"},r=o[t]||o.info;return s.innerHTML=`
            <div class="toast-content">
                <div class="toast-icon">${r}</div>
                <div class="toast-body">
                    <div class="toast-title">${this.escapeHtml(i)}</div>
                    <div class="toast-message">${this.escapeHtml(n)}</div>
                </div>
                <button class="toast-close" type="button" aria-label="\u{5173}\u{95ED}">\xd7</button>
            </div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `,s}removeToast(e){let t=this.toasts.get(e);if(!t)return;let i=t.element;i.classList.add("toast-removing"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i),this.toasts.delete(e)},300)}clearAll(){Array.from(this.toasts.keys()).forEach(e=>this.removeToast(e))}clearByType(e){Array.from(this.toasts.entries()).filter(([t,i])=>i.type===e).map(([e,t])=>e).forEach(e=>this.removeToast(e))}getToastCount(){return this.toasts.size}getToastCountByType(e){return Array.from(this.toasts.values()).filter(t=>t.type===e).length}setMaxToasts(e){for(this.maxToasts=Math.max(1,e);this.toasts.size>this.maxToasts;){let e=this.toasts.keys().next().value;this.removeToast(e)}}setAutoCloseDelay(e){this.autoCloseDelay=Math.max(1e3,e)}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}showLoading(e="正在处理..."){let t=`loading-${Date.now()}`,i=document.createElement("div");return i.id=t,i.className="toast toast-loading",i.innerHTML=`
            <div class="toast-content">
                <div class="toast-icon">
                    <div class="loading-spinner-small"></div>
                </div>
                <div class="toast-body">
                    <div class="toast-message">${this.escapeHtml(e)}</div>
                </div>
            </div>
        `,this.container.appendChild(i),setTimeout(()=>{i.classList.add("toast-show")},10),this.toasts.set(t,{element:i,type:"loading",title:"",message:e,createdAt:Date.now()}),t}updateLoadingMessage(e,t){let i=this.toasts.get(e);if(i&&"loading"===i.type){let e=i.element.querySelector(".toast-message");e&&(e.textContent=t)}}showResult(e,t,i,n=null){n&&this.removeToast(n),e?this.showSuccess("操作成功",t):this.showError("操作失败",i)}}class c{constructor(){this.overlay=null,this.modal=null,this.isOpen=!1,this.currentResolve=null,this.initializeModal(),this.bindEvents()}initializeModal(){this.overlay=document.getElementById("modal-overlay"),this.modal=this.overlay?.querySelector(".modal"),this.overlay&&this.modal||console.warn("模态对话框元素未找到")}bindEvents(){if(!this.overlay)return;this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close(!1)});let e=document.getElementById("modal-close");e&&e.addEventListener("click",()=>{this.close(!1)});let t=document.getElementById("modal-cancel");t&&t.addEventListener("click",()=>{this.close(!1)});let i=document.getElementById("modal-confirm");i&&i.addEventListener("click",()=>{this.close(!0)}),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.isOpen&&this.close(!1)})}showConfirm(e,t,i="确认",n="info"){return new Promise(s=>{if(this.isOpen)return void s(!1);this.currentResolve=s,this.updateContent(e,t,i,n),this.open()})}showInfo(e,t,i="确定"){return this.showConfirm(e,t,i,"info")}showWarning(e,t,i="继续"){return this.showConfirm(e,t,i,"warning")}showDanger(e,t,i="删除"){return this.showConfirm(e,t,i,"danger")}showCustom(e){let{title:t="确认",message:i="",confirmText:n="确认",cancelText:s="取消",type:o="info",showCancel:r=!0,html:a=null}=e;return new Promise(e=>{if(this.isOpen)return void e(!1);this.currentResolve=e,this.updateContent(t,a||i,n,o,s,r),this.open()})}updateContent(e,t,i,n,s="取消",o=!0){if(!this.modal)return;let r=document.getElementById("modal-title");r&&(r.textContent=e);let a=document.getElementById("modal-message");a&&(t.includes("<")?a.innerHTML=t:a.textContent=t);let l=document.getElementById("modal-confirm"),u=document.getElementById("modal-cancel");if(l)switch(l.textContent=i,l.className="btn",n){case"warning":l.classList.add("btn-warning");break;case"danger":l.classList.add("btn-danger");break;default:l.classList.add("btn-primary")}u&&(u.textContent=s,u.style.display=o?"inline-flex":"none"),this.modal.className=`modal modal-${n}`}open(){this.overlay&&!this.isOpen&&(this.isOpen=!0,this.overlay.classList.remove("hidden"),document.body.style.overflow="hidden",setTimeout(()=>{let e=document.getElementById("modal-confirm");e&&e.focus()},100),console.log("模态对话框已打开"))}close(e=!1){this.overlay&&this.isOpen&&(this.isOpen=!1,this.overlay.classList.add("hidden"),document.body.style.overflow="",this.currentResolve&&(this.currentResolve(e),this.currentResolve=null),console.log(`\u{6A21}\u{6001}\u{5BF9}\u{8BDD}\u{6846}\u{5DF2}\u{5173}\u{95ED}\u{FF0C}\u{7ED3}\u{679C}: ${e}`))}showInput(e,t,i="",n=""){return new Promise(s=>{if(this.isOpen)return void s(null);let o=`
                <p>${this.escapeHtml(t)}</p>
                <div class="form-group">
                    <input type="text" id="modal-input" class="form-input" 
                           value="${this.escapeHtml(i)}" 
                           placeholder="${this.escapeHtml(n)}">
                </div>
            `;this.currentResolve=e=>{if(e){let e=document.getElementById("modal-input");s(e?e.value:null)}else s(null)},this.updateContent(e,o,"确定","info"),this.open(),setTimeout(()=>{let e=document.getElementById("modal-input");e&&(e.focus(),e.select())},100)})}showSelect(e,t,i){return new Promise(n=>{if(this.isOpen)return void n(null);let s=i.map((e,t)=>{let i="object"==typeof e?e.value:e,n="object"==typeof e?e.label:e;return`<option value="${this.escapeHtml(i)}">${this.escapeHtml(n)}</option>`}).join(""),o=`
                <p>${this.escapeHtml(t)}</p>
                <div class="form-group">
                    <select id="modal-select" class="form-input form-select">
                        ${s}
                    </select>
                </div>
            `;this.currentResolve=e=>{if(e){let e=document.getElementById("modal-select");n(e?e.value:null)}else n(null)},this.updateContent(e,o,"确定","info"),this.open(),setTimeout(()=>{let e=document.getElementById("modal-select");e&&e.focus()},100)})}isModalOpen(){return this.isOpen}forceClose(){this.close(!1)}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}}class d{constructor(){this.isInitialized=!1,this.hasUnsavedChanges=!1,this.currentConfig=null,this.configManager=null,this.fileManager=null,this.uiManager=null,this.xmlParser=null,this.validationManager=null,this.toastManager=null,this.modalManager=null}async initializeModules(){try{console.log("开始初始化模块..."),this.toastManager=new u,this.modalManager=new c,this.configManager=new e,this.fileManager=new o,this.uiManager=new r,this.xmlParser=new a,this.validationManager=new l,await new Promise(e=>setTimeout(e,100)),console.log("模块初始化完成")}catch(e){throw console.error("模块初始化失败:",e),Error(`\u{6A21}\u{5757}\u{521D}\u{59CB}\u{5316}\u{5931}\u{8D25}: ${e.message}`)}}async initialize(){try{console.log("开始初始化 ColorOS 墓碑配置编辑器..."),await this.initializeModules(),this.bindGlobalEvents(),await this.checkEnvironment(),this.uiManager.initializeUI(),await this.loadConfiguration(),this.isInitialized=!0,console.log("应用初始化完成"),this.toastManager.show("应用初始化完成","success")}catch(e){console.error("应用初始化失败:",e),this.showInitializationError("初始化失败",e.message)}}showInitializationError(e,t){try{if(this.uiManager&&"function"==typeof this.uiManager.showError)return void this.uiManager.showError(e,t)}catch(e){console.warn("UIManager不可用，使用备用错误显示")}try{let i=document.getElementById("error-message"),n=i?.querySelector("h3"),s=document.getElementById("error-details");n&&(n.textContent=e),s&&(s.textContent=t),i&&i.classList.remove("hidden");let o=document.getElementById("loading");o&&o.classList.add("hidden")}catch(i){console.error("无法显示错误信息:",i),alert(`${e}: ${t}`)}}async checkEnvironment(){if(!await this.fileManager.checkAPIAvailable())throw Error("KernelSU API不可用，请确保在KernelSU环境中运行");console.log("运行环境检查通过")}async loadConfiguration(){try{this.uiManager.showLoading();let e=await this.fileManager.readConfigFile();this.currentConfig=this.xmlParser.parse(e);let t=this.xmlParser.validateStructure(this.currentConfig);t.isValid||(console.warn("配置文件结构验证失败:",t.errors),this.toastManager.show("配置文件结构有问题，但仍可编辑","warning")),this.uiManager.setConfigData(this.currentConfig),this.uiManager.renderCurrentSection();let i=await this.fileManager.getFileInfo();this.updateFileStatus(i),this.uiManager.hideLoading(),console.log("配置文件加载完成")}catch(e){throw console.error("加载配置文件失败:",e),this.uiManager.hideLoading(),e}}async saveConfiguration(){try{if(!this.currentConfig)throw Error("没有可保存的配置数据");this.toastManager.show("正在保存配置...","loading"),await this.fileManager.createBackup();let e=this.xmlParser.serialize(this.currentConfig);await this.fileManager.writeConfigFile(e),this.hasUnsavedChanges=!1,this.uiManager.updateUnsavedIndicator(!1);let t=await this.fileManager.getFileInfo();this.updateFileStatus(t),this.toastManager.show("配置保存成功","success"),console.log("配置文件保存完成")}catch(e){throw console.error("保存配置文件失败:",e),this.toastManager.show(`\u{4FDD}\u{5B58}\u{5931}\u{8D25}: ${e.message}`,"error"),e}}async backupConfiguration(){try{this.toastManager.show("正在创建备份...","loading");let e=await this.fileManager.createBackup();this.toastManager.show(`\u{5907}\u{4EFD}\u{521B}\u{5EFA}\u{6210}\u{529F}: ${e}`,"success"),console.log("配置备份完成:",e)}catch(e){console.error("创建备份失败:",e),this.toastManager.show(`\u{5907}\u{4EFD}\u{5931}\u{8D25}: ${e.message}`,"error")}}async restoreConfiguration(){try{if(!await this.modalManager.confirm("恢复备份","确定要恢复备份配置吗？当前的修改将会丢失。"))return;this.toastManager.show("正在恢复备份...","loading"),await this.fileManager.restoreBackup(),await this.loadConfiguration(),this.toastManager.show("备份恢复成功","success"),console.log("配置恢复完成")}catch(e){console.error("恢复备份失败:",e),this.toastManager.show(`\u{6062}\u{590D}\u{5931}\u{8D25}: ${e.message}`,"error")}}handleConfigChange(e,t){try{if(!this.currentConfig)return void console.warn("配置数据未加载，忽略变更");let i=e.split(".");if(i.length>=2){let e=i[0],n=i[1],s=this.configManager.validateValue(e,n,t);if(!s.isValid)return void this.toastManager.show(`\u{914D}\u{7F6E}\u{9A8C}\u{8BC1}\u{5931}\u{8D25}: ${s.error}`,"error")}this.xmlParser.setValueByPath(this.currentConfig,e,t),this.hasUnsavedChanges=!0,this.uiManager.updateUnsavedIndicator(!0),console.log(`\u{914D}\u{7F6E}\u{5DF2}\u{66F4}\u{65B0}: ${e} = ${t}`)}catch(e){console.error("处理配置变更失败:",e),this.toastManager.show(`\u{914D}\u{7F6E}\u{66F4}\u{65B0}\u{5931}\u{8D25}: ${e.message}`,"error")}}updateFileStatus(e){let t=document.getElementById("file-status"),i=document.getElementById("last-modified");t&&e&&(t.textContent=`\u{914D}\u{7F6E}\u{6587}\u{4EF6}: \u{5DF2}\u{52A0}\u{8F7D} (${(e.size/1024).toFixed(1)} KB)`),i&&e&&(i.textContent=`\u{6700}\u{540E}\u{4FEE}\u{6539}: ${e.lastModified}`)}bindGlobalEvents(){document.addEventListener("configChange",e=>{let{path:t,value:i}=e.detail;this.handleConfigChange(t,i)}),document.getElementById("save-btn")?.addEventListener("click",()=>{this.saveConfiguration()}),document.getElementById("backup-btn")?.addEventListener("click",()=>{this.backupConfiguration()}),document.getElementById("restore-btn")?.addEventListener("click",()=>{this.restoreConfiguration()}),document.getElementById("retry-btn")?.addEventListener("click",async()=>{try{let e=document.getElementById("error-message");e&&e.classList.add("hidden");let t=document.getElementById("loading");t&&t.classList.remove("hidden"),await this.initialize()}catch(e){console.error("重试失败:",e),this.showInitializationError("重试失败",e.message)}}),window.addEventListener("beforeunload",e=>{this.hasUnsavedChanges&&(e.preventDefault(),e.returnValue="有未保存的更改，确定要离开吗？")}),console.log("全局事件绑定完成")}}document.addEventListener("DOMContentLoaded",async()=>{try{window.tombstoneEditor=new d,await window.tombstoneEditor.initialize()}catch(n){console.error("应用启动失败:",n);let e=document.getElementById("error-message"),t=document.getElementById("error-details");e&&t&&(t.textContent=n.message,e.classList.remove("hidden"));let i=document.getElementById("loading");i&&i.classList.add("hidden")}});