# 蜈支洲项目
   * 运行时要执行 npm run build 执行压缩 及jade模板编译
   * 请尽量避免在js中拼接复杂html，使用jade模板（templates目录下为js中使用的jade模板，gulp会自动打包到dist目录下）
   * 官网wap，汪汪商城，珊瑚酒店，门店终端分销等项目使用同一套代码
       
        测试环境  
        https://wzzfxswap.sendinfo.com.cn        http://192.168.200.152:4029/  官网wap  
                http://192.168.200.152:4023/  汪汪商城  
        http://wzzfxswap2.sendinfo.com.cn        http://192.168.200.152:5008/  珊瑚酒店  
        http://wzzfxswap3.sendinfo.com.cn(没配)  http://192.168.200.152:3004/  门店终端分销   
       
        生产环境  
        https://wap.wuzhizhou.com/  官网wap   
        http://wap.wuzhizhou.com/   官网wap   
        http://m.dogplanet.cn/      汪汪商城  
        http://h.wuzhizhou.com/     珊瑚酒店  
        http://s.wuzhizhou.com/     门店终端分销   
      
   * 源码地址(svn)：https://dssvn.sendinfo.com/svn/webwork/frontEnd/蜈支洲(已废弃)
   * 源码地址(git)：http://git.sendinfo.com/BasicBusiness/Frontdesign/wzz/wzz-wap-node.git
   * 堡垒机：http://192.168.200.94:7190 guoqingbo/123456
   * 提供的外链(/other快捷查看)  
       项目预约(大屏滚动) /appoint/list  
       排队叫号 /callNum?screenCode=1  
       排队叫号新版 /queueCallNum/list?screenCode=1?col=1,1,1,1,1 col参数为列布局  
       排队叫号新版1 /queueCallNum/list1?screenCode=1  
       游玩项目列表 /appoint/gameList  
       手机取号 /appoint/takeNum  
       我的行程 /myTrip
       供应商手机端 /supplier/login
       
## 官网wap
### 测试环境
   * 测试域名：https://wzzfxswap.sendinfo.com.cn
   * 测试ip：192.168.200.152:4029
   * 部署地址：192.168.200.152 /usr/apps/node/wzzWapOfficial
   * 后台接口：https://wzz.sendinfo.com.cn
   * 预约测试接口: http://192.168.200.72:8080
   * 后台swagger：https://wzz.sendinfo.com.cn/admin/login
   * wap测试账号：
   
### 正式环境
   * 生产域名：https://wap.wuzhizhou.com/
   * 生产ip：http://47.99.119.191:3000
   * 部署地址：47.99.119.191:3000 /application/sendinfo-wzz-node/wzz-wap-3000
   * 堡垒机：http://192.168.200.94:7190 guoqingbo/123456
   * 排队预约：http://coach.wuzhizhou.com
   * 后台接口：https://b2b.wuzhizhou.com
   * 后台swagger：https://b2b.wuzhizhou.com
   * 后台账号: shenda  hello123  superadmin hello123
   

## 汪汪商城
### 测试环境
   * 测试地址: http://192.168.200.152:4023
   * 测试域名: https://wzzfxswap1.sendinfo.com.cn
   * 部署地址: 192.168.200.152:4023 /usr/apps/node/wzzWapWangWang
   * 后台接口: https://wzz.sendinfo.com.cn
   * 后台地址: http://192.168.200.72:9080/admin/login#
   
### 生产环境
   * 生产ip：http://47.99.119.191:4016
   * 生产域名: http://m.dogplanet.cn/
   * 部署地址: 47.99.119.191:3000 /application/sendinfo-wzz-node/wzz-wap-3000
   * 部署地址: 47.99.119.191:3000 /application/sendinfo-wzz-node/wap-fxsc-4016（原来的，已废弃）
   * 后台接口: https://b2b.wuzhizhou.com
   * 后台地址: https://b2b.wuzhizhou.com/admin/login
   

## 珊瑚酒店
### 测试环境
   * 测试地址: http://192.168.200.152:5008
   * 测试域名: https://wzzfxswap2.sendinfo.com.cn
   * 部署地址: 192.168.200.152:4023 /usr/apps/node/wzzWapCoralHotel
   * 后台接口: https://wzz.sendinfo.com.cn
   * 后台地址: https://wzz.sendinfo.com.cn/admin/index#
   
### 生产环境
   * 生产ip：http://47.99.119.191:5008
   * 生产域名: http://h.wuzhizhou.com/
   * 部署地址: 47.99.119.191:5008 /application/sendinfo-wzz-node/wzz-wap-3000
   * 后台接口: https://b2b.wuzhizhou.com
   * 后台地址: https://b2b.wuzhizhou.com/admin/login

## 门店终端分销
### 测试环境
   * 测试地址: http://192.168.200.152:3004
   * 测试域名: https://wzzfxswap3.sendinfo.com.cn（尚未配置）
   * 部署地址: 192.168.200.152:3004 /usr/apps/node/wzzWapOfficial
   * 后台接口: https://wzz.sendinfo.com.cn
   * 后台地址: https://wzz.sendinfo.com.cn/admin/index#
   
### 生产环境
   * 生产ip：http://47.99.119.191:3004
   * 生产域名: http://s.wuzhizhou.com/
   * 部署地址: 47.99.119.191:3004 /application/sendinfo-wzz-node/wzz-wap-3000
   * 后台接口: https://b2b.wuzhizhou.com
   * 后台地址: https://b2b.wuzhizhou.com/admin/login
