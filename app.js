var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
// var configProject = require('./config');
var envConfig = require('./routes/common/index').common.envConfig;
var mergeEnvConfig = require('./routes/common/index').common.mergeEnvConfig;
// var commonFun = require('./routes/common/index');
// var async = require('async');
// var needle = require('needle');
var app = express();
// app.disable('x-powered-by');
// view engine setup
// app.set('trust proxy', false)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', true);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 使用压缩文件,es6转为es5
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// 设置 Session
app.use(session({
    resave: true,
    saveUninitialized: false,
    store: new RedisStore(envConfig.redis),
    rolling:true,// 是否自动更新过期时间
    secret: 'wzzwap'
}));
app.use(flash());


if(process.env.projectNameCode){
    console.log("启动时指定了项目名称==========================================="+process.env.projectNameCode)
    // 生产和测试使用该逻辑
    // 如果启动时指定了项目名称
    // 合并配置参数
    envConfig = mergeEnvConfig(process.env.projectNameCode)

    app.use(function (req, res, next) {
        // 如果路由参数里带有项目编码参数

        // 便于在路由或页面获取启动的项目编码
        res.locals.projectNameCode = req.session.projectNameCode = process.env.projectNameCode
        res.locals.nodeEnv = process.env.NODE_ENV || 'develop'
        next()
    });

}
else {
    // 本地开发用到（生产或测试已废弃）
    // 如果启动时没有指定环境变量区分不同的项目
    app.use(function (req, res, next) {

        if(/^\/official/.test(req.originalUrl)||
            req.headers.host == 'wzzfxswap.sendinfo.com.cn' ||
            req.headers.host == 'wap.wuzhizhou.com'){
            //路径路由以/officail开头，或测试域名为wzzfxswap.sendinfo.com.cn，或生产域名为wap.wuzhizhou.com 则为官网wap
            req.session.projectNameCode = 'official'

        }else  if(/^\/wangWang/.test(req.originalUrl)||
            req.headers.host == 'wzzfxswap1.sendinfo.com.cn' ||
            req.headers.host == 'm.dogplanet.cn'){
            //路径路由以/wangWang，或测试域名为wzzfxswap1.sendinfo.com.cn，或生产域名为m.dogplanet.cn 则为汪汪商城
            req.session.projectNameCode = 'wangWang'
        }else if(/^\/coralHotel/.test(req.originalUrl)||
            req.headers.host == 'wzzfxswap2.sendinfo.com.cn' ||
            req.headers.host == 'h.wuzhizhou.com'){
            //路径路由以/coralHotel开头，测试域名为wzzfxswap2.sendinfo.com.cn，或生产域名h.wuzhizhou.com为 则为官网wap
            req.session.projectNameCode = 'coralHotel'
        }else if(/^\/storeTerminal/.test(req.originalUrl)||
            req.headers.host == 'wzzfxswap3.sendinfo.com.cn' ||
            req.headers.host == 's.wuzhizhou.com'){
            //路径路由以/coralHotel开头，测试域名为wzzfxswap3.sendinfo.com.cn，或生产域名s.wuzhizhou.com为 则为官网wap
            req.session.projectNameCode = 'storeTerminal'
        }else{

            if(!req.session.projectNameCode){
                // 默认为官网wap
                req.session.projectNameCode = 'official'
            }
        }

        // 如果路由以/officail 、/wangWang、/coralHotel 则去除前缀重定向路由
        if(/(^\/coralHotel)|(^\/wangWang)|(^\/official)|(^\/storeTerminal)/.test(req.originalUrl)){
            let url = req.originalUrl.replace(/(^\/coralHotel)|(^\/wangWang)|(^\/official)|(^\/storeTerminal)/,'')||"/"
            res.redirect(url)
            return
        }

        res.locals.projectNameCode = req.session.projectNameCode

        // 合并配置参数
        envConfig = mergeEnvConfig(req.session.projectNameCode)

        next()
    });
}

app.use(function (req, res, next) {
    // 如果路由参数中有企业编码
    if(req.method=="GET" && req.headers['x-requested-with']!=='XMLHttpRequest'){
        let corpCode = req.query.corpCode
        let oldCorpCode = req.cookies.corpCode
        if(corpCode && corpCode!=oldCorpCode){
            res.cookie('corpCode', req.query.corpCode);
        }
    }
    next()
});
app.use(function (req, res, next) {
    if(req.method=="GET"){
        // 全渠道扫码进入(需要登录)
        if(req.cookies.promoter){
            res.locals.promoter = JSON.parse(req.cookies.promoter)
        }
        if(/(^\/login)|(^\/horization)|(^\/weixinProxy)/.test(req.originalUrl)){
            return next()
        }
        // let promoter = JSON.parse(req.cookies.promoter || '{}')
        let {channelId,promoterId,teamBatchNo,promoteSrcCode,timeTmp,corpCode} = req.query
        if(promoterId && !timeTmp){
            // req.cookies.promoter = JSON.stringify({channelId,promoterId,teamBatchNo,promoteSrcCode})
            // res.cookie.setMaxAge(-10)
            res.cookie('promoter', JSON.stringify({channelId,promoterId,teamBatchNo,promoteSrcCode}));
            // res.cookie('ceshi', '123',{expires: false,maxAge:0});
            // 兼容之前旧的码，判断是否有企业吗（旧的扫码没有企业码，添加默认的企业码）
            if(!corpCode){
                res.cookie('corpCode', envConfig.corpCode);
            }
            // 添加自定义参数 ,防止重复登陆
            req.session.curUrl = req.originalUrl +'&timeTmp=1'
            return res.redirect('/login')
        }else{
            next()
        }
    }else{
        next()
    }
})

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var error = new Error('Not Found');
    res.status(404);
    res.render('error404',{
        message: error.message,
    });

    //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    // 内存快照
    // var heapdump = require('heapdump');
    // var memwatch = require('memwatch-next');
// 1.stats事件：每次进行全堆回收时，会触发改时间，传递内存的统计信息
// 2.leak事件：经过五次垃圾回收之后，内存仍没有被释放的对象，会触发leak事件，传递相关的信息。
// memwatch.on('stats', function(info) {
//     console.log(info)
//     heapdump.writeSnapshot('heapsnapshot/'+Date.now() + '.heapsnapshot');
// });
//     memwatch.on('leak', function(info) {
//         console.log(info)
//         heapdump.writeSnapshot('heapsnapshot/'+Date.now() + '.heapsnapshot');
//     });
// heapdump.writeSnapshot('heapsnapshot/'+Date.now() + '.heapsnapshot');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
