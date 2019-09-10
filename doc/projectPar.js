/*
* ---整站正式&测试参数整理---
*
* domain    | 接口域名        | routers/common/config.json
* host      | redis地址       | app.js
* appId     | 微信appId       | routes/pay.js  routes/main.js
* appSecret | 微信appSecret   | routes/pay.js  routes/main.js
* txt       | 微信授权txt文件  | public/*.txt
* qyyxSrc   | 全员营销js      | public/javascripts/public.js
*
* pcUrl     | PC访问地址
* wapUrl    | WAP访问地址
* */

// 正式参数，接口等-------------------------------------------------------
var _$formal={
    domain: "127.0.0.1:8080",
    host: "sendinfo.redis.com",
    appId:"wx16130af4fd102a02",
    appSecret:"a9559a5099714abeeb5f22084aec12a8",
    qyyxSrc: "//qyyx.zhiyoubao.com/static/h-ui/js/pro.js?wuzhizhou",

    txt:"MP_verify_PGb39veEFJP9vtPT.txt",
    pcUrl:"",
    wapUrl:"http://wap.wuzhizhou.com/"
};



//测试参数，接口等-------------------------------------------------------
var _$test={
    domain: "http://192.168.200.208:8080",
    host: "192.168.200.50",
    appId:"wx37b45b55a30c1726",
    appSecret:"e7560178d2dcfc37e0c9d14eb8ae9a49",
    qyyxSrc:"//qyyxcs.sendinfo.com.cn/static/h-ui/js/pro.js?fx001",

    txt:"MP_verify_0O7X6J1VfudhLNGQ.txt",
    pcUrl:"",
    wapUrl:"https://wzzfxswap.sendinfo.com.cn/"
};


// exports.projectPar = _$test;




