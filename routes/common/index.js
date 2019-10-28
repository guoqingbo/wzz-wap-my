let async = require('async'),
    // needle = require('needle'),// needle https请求有时会挂掉,废弃needle 换成 request
    // qs = require('querystring'),
    // crypto = require('crypto'),
    jsSHA = require('jssha'),
    conJson = require('./config.json'),
    // fetch = require('node-fetch'),
    request = require('request')
    jade = require('jade')
    configLite = require('config-lite');

const envConfig = configLite({
        filename: process.env.NODE_ENV,
        config_basedir: __dirname,
        config_dir: 'config/common'
    });

// 私有属性
let private = {
    partner: 'wap',
    key: 'd332326d0b36f9cf66d290363f3b29f6',
    getUrl: function (url) {
        let config = conJson,
            reUrl = envConfig.domain;
        url.urlArr
            .map(function (item, index) {
                config = config[item];
            });
        url.outApi ? reUrl = config : reUrl += config;
        // 如果outApi是字符串
        if( url.outApi && typeof  url.outApi == 'string'){
            reUrl = url.outApi+config
        }
        return reUrl;
    },
    gul: function (url, falg) {
        let reUrl = url;
        if (reUrl) {
            let tagUrl = '';

            for (key in falg) {
                tagUrl += key + '=' + falg[key] + '&'
            }
            return reUrl + '?' + tagUrl;
        } else {
            console.log('In config.json not found the url');
        }
    },
    nowdDate: Date.now(),
    getParam: function (item) {
        _o = item.parameter || {};
        if(!_o.corpCode){
            // 传入的接口中没有corpCode参数时
            _o.corpCode = "cgb2cfxs";
            if(common.envConfig.corpCode){
                // 项目中配置了corpCode参数时
                _o.corpCode = common.envConfig.corpCode
            }
        }
        _o.wayType = "2";
        return _o;
    }
};
// 导出属性
let common = {
    viewCase:{},
    envConfig,
    getUrl: function (url) {
        let config = conJson,
            reUrl = null,
            tagUrl = '';

        url.urlArr
            .map(function (item, index) {
                config = reUrl = config[item];
            });
        if (url.parameter) {
            for (key in url.parameter) {
                tagUrl += key + '=' + url.parameter[key] + '&'
            }
            reUrl += '?' + tagUrl.slice(0, -1);
        }

        return reUrl;
    },
    gul: function (url,outApi) {
        let config = conJson,
            reUrl = envConfig.domain;

        url.map(function (item, index) {
            config = config[item];
        });
        if( outApi && typeof  outApi == 'string'){
            reUrl = outApi+config
        }else{
            reUrl += config;
        }
        return reUrl;
    },
    commonRequest: function (_p) {
        // 扩展对象
        let opt = {
            title: '标题',    // 页面标题
            isAjax: false,   // 是否为异步
            callBack: function () { }  // 流程处理完之后的回调
        };
        _p.__proto__ = opt;
        let _a = new Array();

        _p.url.map(function (item, index) {
                let _u = private.getUrl(item),
                    _d = item.noLocal ? item.parameter : private.getParam(item),
                    method = item.method ? item.method : _p.req.method;
                let option = {
                    method:method,
                    url:_u,
                    jar: true,//携带cookie
                    timeout: 100000,
                    // json:false,
                    // qs: _d,
                    headers: {
                        'access-token': _p.req.session.token || "",
                        // 'content-type': 'application/json',
                    },
                    'content-type': 'text/html;charset=utf-8',
                    // "content-type": "application/json",
                }
                // console.log(_p.req.session.token)
                if(method.toUpperCase()=="POST"){
                    option.form = _d
                }else{
                    option.qs = _d
                }
                _a.push(function (cb){
                    common.request(option)
                        .then(reponse=> {
                            let {err, resp, body}= reponse
                            if (!err && resp.statusCode === 200) {
                                if (!body || (body.status != 200 && !item.noLocal)) {
                                    cb('error', body);
                                }
                                else {
                                    cb(null, body);
                                }
                            } else {
                                let result = body && typeof body === 'string' ? JSON.parse(body) : body;
                                if (result&&result.status == 400) {
                                    _p.req.session.curUrl = _p.originalUrl;
                                    //- _p.res.redirec/appoint/lookGameOrdert('/login');
                                    cb('error', result);
                                } else {
                                    cb('error', body);
                                }
                            }
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                });
            });
        async.parallel(_a, function (err, results) {
            if (err) {
                if (_p.isAjax) {
                    return _p.res.send(results);
                } else {
                    if (results.length > 0) {
                        results.map(function (item, index) {
                            if(!item){
                                _p.res.redirect('/error');
                            } else if (item.status !== 200) {
                                _p.req.flash('message', item.message ? item.message : '该产品不存在');
                                switch (item.status) {
                                    case 400:
                                        _p.req.session.curUrl = _p.originalUrl;
                                        _p.res.redirect('/login');
                                        break;
                                    case 402:
                                        console.log("接口 402！");
                                        _p.res.redirect('/error');
                                        break;
                                    case 404:
                                        console.log("接口 404！");
                                        _p.res.redirect('/error');
                                        break;
                                    default:
                                        _p.res.redirect('/error');
                                        break;
                                }
                                return false
                            }
                        });
                    } else {
                        _p.req.flash('message', '没有数据');
                        // _p.res.status(404);
                        return _p.res.redirect(404,'/error404');
                    }
                }
            } else
                {
                let reObj = {};
                let handTag = { tag: 1 };

                _p.callBack(results, reObj, _p.res, handTag);

                if (handTag.tag) {
                    if (_p.isAjax) {
                        if (results[0].data && results[0].data.token) {
                            common.getUserInfo(results,_p)
                        } else {
                            _p.res.send(results);
                        }
                    } else if (_p.page) {
                        reObj.title = reObj.title?reObj.title: _p.title;
                        // reObj.title=_p.title;
                        reObj.data = results;
                        _p.res.render(_p.page, reObj);
                    } else {
                        return false;
                    }
                }
            }
        });
    },
    // 封装request请求
    request:function(config){
        let defaultOption = {
            method:config.method,
            url:config.url,
            // form:{},//post时参数
            // qs:{},//拼接到uri参数
            jar: true,//携带cookie
            timeout: 100000,
            // headers: {
            //     'access-token': _p.req.session.token || "",
            // },
            // 'content-type': 'text/html;charset=utf-8',
        }
        let option = config ? Object.assign(defaultOption,config) : defaultOption;
        return new Promise(function (resolve,reject) {
            // 计算接口请求耗时
            let requestStartTime = new Date().getTime()
            request(option,  function (err, resp, body) {
                // 计算接口请求耗时
                let requestEntTime = new Date().getTime()
                try {
                    if(typeof body === 'string'){
                        body = JSON.parse(body)
                    }
                }catch (e) {
                    console.log(e)
                }
                if(option.url.indexOf(common.envConfig.domain1) == -1 || process.env.NODE_ENV !== 'production'){
                    common.envConfig.debug && console.log(option.url);
                    console.log("===========请求耗时==============="+(requestEntTime-requestStartTime)+"ms")
                    common.envConfig.debug && console.log(option.qs||option.form);
                    common.envConfig.debug && console.log(body);
                }
                // if(err){
                //     reject(err);
                // }else{
                //     resolve({err, resp, body});
                // }
                resolve({err, resp, body});
            })
        })
    },
    // 封装get请求
    get:function(url,params){
        let option = {
                method:"get",
                url:url,
                qs:params?params:""
            }
       return common.request(option)
    },
    // 封装post请求
    post:function(url,params){
        let option = {
            method:"post",
            url:url,
            form:params?params:""
        }
        return common.request(option)
    },
    pageTitle: function (module) {
        let title = "";
        switch (module) {
            case "ticket":
                title = "景区";
                break;
            case "hotel":
                title = "酒店";
                break;
            case "route":
                title = "跟团游";
                break;
            case "combo":
                title = "套票";
                break;
            case "zyx":
                title = "自由行";
                break;
            case "repast":
                title = "餐饮";
                break;
            case "goods":
                title = "商品";
                break;
            case "raiders":
                title = "攻略";
                break;
            case "guide":
                title = "导游";
                break;
            case "order":
                title = "订单";
                break;
            case "qr":
                title = "门票";
                break;
            case "integral":
                title = "积分";
                break;
            case "car":
                title = "租车";
                break;
            case "refund":
                title = "退单";
                break;

        }
        return title;
    },
    detailSeo:function(module){
        let title = "";
        switch (module) {
            case "commentList":
                title = "蜈支洲岛最新评论列表_三亚蜈支洲岛旅游区";
                break;
            case "hotel":
                title = "酒店预订_三亚蜈支洲岛旅游区";
                break;
            case "repast":
                title = "餐饮预订_三亚蜈支洲岛旅游区";
                break;
            case "strategy":
                title = "蜈支洲岛旅游攻略_三亚蜈支洲岛旅游区";
                break;
        }
        return title;
    },
    is_weixn: function (req) {
        let ua = req.headers["user-agent"].toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    // 时间戳产生函数
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + '';
    },
    // 随机字符串产生函数
    createNonceStr : function() {
        return Math.random().toString(36).substr(2, 15);
    },
    // 计算签名
    calcSignature : function (ticket, noncestr, ts, url) {
        let str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
        let shaObj = new jsSHA("SHA-1", "TEXT");
        shaObj.update(str);
        return shaObj.getHash('HEX');
    },
    // 微信分享
    wxShare:function (req, res, next) {
        //微信分享
        let iswx = common.is_weixn(req);
        if(req.headers['x-requested-with'] === 'XMLHttpRequest' || !iswx){
            // 如果为ajax请求 或不是微信
            res.locals.wxShare = {
                iswx:iswx
            };
            return next();
        }
        if(!req.session.cachedSignatures){
            // 如果不存在签名缓存
            req.session.cachedSignatures = {}
        }
        let cachedSignatures = req.session.cachedSignatures;
        let expireTime = 7200 - 100;
        let appObj = envConfig.wx;
        let _url = req.protocol + 's://' + req.hostname + req.originalUrl.split('#')[0];
        let signatureObj = cachedSignatures[_url];
        // 如果缓存中已存在签名，则直接返回签名
        if (signatureObj && signatureObj.timestamp) {
            let t = common.createTimeStamp() - signatureObj.timestamp;
            // 未过期，并且访问的是同一个地址
            // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
            if (t < expireTime && signatureObj.url === _url) {
                res.locals.wxShare = {
                    nonceStr: signatureObj.nonceStr,
                    timestamp: signatureObj.timestamp,
                    appid: signatureObj.appid,
                    signature: signatureObj.signature,
                    url: signatureObj.url,
                    iswx: iswx
                };
                return next();
            }
            // 此处可能需要清理缓存当中已过期的数据
        }
        try{
            function getAccessToken(appId,appSecret){
                let tokenurl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;
                return common.get(tokenurl)
                // return needle("get",tokenurl);
            }
            function getTicket(access_token){
                // needle 请求有问题，needle插件有问题，换成fetch
                let ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
                return common.get(ticketUrl)
                // return needle("get",ticketUrl)
            }

            getAccessToken(appObj.appId,appObj.appSecret)
                .then(response=>{
                    return getTicket(response.body.access_token)
                })
                .then(result=>{
                    let appid = appObj.appId;
                    let ts = common.createTimeStamp();
                    let nonceStr = common.createNonceStr();
                    let ticket = result.body.ticket;
                    let signature = common.calcSignature(ticket, nonceStr, ts, _url);
                    req.session.cachedSignatures[_url] = {
                        nonceStr: nonceStr,
                        appid: appid,
                        timestamp: ts,
                        signature: signature,
                        url: _url
                    };
                    res.locals.wxShare = {
                        nonceStr: nonceStr,
                        timestamp: ts,
                        appid: appid,
                        signature: signature,
                        url: _url,
                        iswx: iswx
                    };
                    return next();
                })
        } catch(err){
            console.log('err', err);
            return res.redirect('/error')
        }
    },
    // 获取用户信息
    getUserInfo:function (results,_p) {
        _p.req.session.token = results[0].data.token;
        common.commonRequest({
            url: [{
                urlArr: ['member', 'info'],
                parameter: {leaguerId: results[0].data.leaguerId },
                method: 'get'
            }],
            req: _p.req,
            res: _p.res,
            isAjax: true,
            callBack:function(results, reObj,res, handTag){
                handTag.tag = false
                if (results[0].status == 200) {
                    _p.req.session.member = results[0].data;
                    _p.res.send([{ status: 200}]);
                }
                else {
                    _p.res.send(results);
                }
            }
        });
    },
    isLogin:function (req, res, next) {
        if(req.session.member && req.session.member.leaguerId && !req.session.member.id){
            req.session.member.id = req.session.member.leaguerId
        }
        // 全渠道参数进入，判断是否要重新登陆，promoterId和之前登陆不一样时，重新登陆
        let isReLogin = false
        // if(req.method=="GET" && req.query.promoterId && req.session.promoterId!==req.query.promoterId){
        //     isReLogin = true
        // }
        if (!req.session.member || !req.session.member.leaguerId || !req.session.member.id || isReLogin) {
            // 判断是get请求，还是post请求
            if(req.method=="POST"){
                return res.send([{status:400,message:"登陆过期，请重新登录"}])
            }else{
                req.session.curUrl = req.originalUrl
                return res.redirect('/login')
                // return res.redirect('/login?redir='+req.originalUrl)
            }
        } else {
            if(next){
                next();
            }
        }
    },
    getPageMeta:function (req, res, next) {
        if(req.method!="GET" || req.session.pageMeta){
            return next()
        }
        let url = common.gul(['main', 'index', 'allInfo'])
        let params = private.getParam({
            parameter: {modelCode:"wapmeta"}
        })
        common.get(url,params).then(response=>{
            if(response.body && response.body.status == 200){
                req.session.pageMeta = response.body.data
            }else{
                req.session.pageMeta = {}
            }
            next()
        })
    },
    setPageMeta:function (module,req) {
        let {title,keywords,description,titleIcon} =
            req.session.pageMeta[module] && req.session.pageMeta[module][0]?
            req.session.pageMeta[module][0]:{}

        // 以下是默认标题设置
        // let commonTitle = "三亚蜈支洲岛旅游区"
        // let defaultTitle = ''
        // switch (module) {
        //     case "indexmeta":
        //         defaultTitle = commonTitle+'_海南三亚海岛旅游潜水娱乐极限玩家推荐目的地'
        //         break;
        //     case "ticketOrderMeta":
        //         defaultTitle = '门票船预订_'+commonTitle
        //         break;
        //     case "viewIntroMeta":
        //         defaultTitle =  '蜈支洲岛景点介绍_'+commonTitle
        //         break;
        //     case "hotelMeta":
        //         defaultTitle = '海南三亚酒店预订_'+commonTitle
        //         break;
        //     case "hotelDetailMeta":
        //         defaultTitle = '酒店详情_'+commonTitle
        //         break;
        //     case "repastMeta":
        //         defaultTitle = '海南三亚餐饮预订_'+commonTitle
        //         break;
        //     case "strategyMeta":
        //         defaultTitle = '蜈支洲岛旅游攻略_'+commonTitle
        //         break;
        //
        // }
        // title = title?title:defaultTitle;
        // keywords = keywords?keywords:defaultTitle;
        // description = description?description:defaultTitle;
        // titleIcon = titleIcon?titleIcon:'/favicon.ico';
        return {keywords,description};
    },
    // 渲染jade
    jade(path,data){
        let html=''
        path = 'views/'+path+'.jade'
        let fn = ''
        if(common.viewCase[path]){
            // 如果已经缓存了编译函数
            fn = common.viewCase[path]
        }else{
            fn  = jade.compileFile(path);
            common.viewCase[path] = fn
        }

        html =fn(data)
        return html
    },
    // 合并配置参数
    mergeEnvConfig(projectNameCode){
        let envConfig1 = configLite({
            filename: process.env.NODE_ENV,
            config_basedir: __dirname,
            config_dir: 'config/'+projectNameCode
        });
        // Object.assign和并对象时，第一个参数（原对象）会被改变，因此不想改变原对象时，第一个参数传{}
        common.envConfig = Object.assign({},envConfig,envConfig1)
        return common.envConfig
    }
};

exports.common = common;
