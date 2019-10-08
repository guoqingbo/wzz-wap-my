const async = require('async');
const userType = 'C'; //用户类型c端
const WXPAYTYPE = 32; //32:微信公众号支付 34:智游宝微信公众号支付 33:小程序支付
// const needle = require('needle');
// const iconv = require('iconv-lite');

exports.mainRouter = function (router, common) {
    // 支付确认页面
    router.get('/pay/:module/:orderId', common.isLogin, function (req, res, next) {
        let module = req.params.module,
            orderNo = req.params.orderId;
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order', 'detail'],
                parameter: {
                    orderNo: orderNo,
                    leaguerId: req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'pay',
            title: '支付确认页',
            callBack: function (results, reObj) {
                reObj.module = module;
                reObj.orderNo = orderNo;
                reObj.is_weixn = common.is_weixn(req);
                req.session.orderDetail=results[0].data.orderDetails[0];
            }
        });
    });

    // 去支付
    router.get('/pay/:module', function (req, res, next) {
        let orderNo = req.query.orderNo||"",
            payOrderNo = req.query.payOrderNo,
            paySum = req.query.paySum,
            payType = req.query.payType,
            orderInfo = req.query.orderInfo;

        let redirectUrl = common.envConfig.protocol+"://" + req.headers.host + "/payPlat/result";
        if (common.is_weixn(req)) {
            return next();
        }

        //附加参数
        let params = {
            redirectUrl: redirectUrl,
            operateId: req.session.member.id,
            orderInfo: orderInfo,
            distributorCode:common.envConfig.corpCode
        };
        // 银联直付
        if(payType == '42'){
            let {amount,orderNo,payType} = req.query
            params.orderNo = orderNo
            params.amount = amount
            params.payType = payType
        }

        // 请求支付宝配置
        common.commonRequest({
            url: [{
                urlArr: ['main', 'pay', 'main'],
                parameter: {
                    orderNo: orderNo,
                    userType: userType,
                    payType: payType||22, //支付宝支付
                    paySum: paySum,
                    payOrderNo: payOrderNo,
                    extendParamJson: JSON.stringify(params)
                }
            }],
            req: req,
            res: res,
            page: common.is_weixn(req) ? 'pay/wxpay' : 'pay/payAlipay',
            title: '支付宝支付'
        });
    }, function (req, res, next) {

        // 配置微信授权
        // 缓存缺少openid，重新授权登录
        let wxTokenObj = req.session.wxTokenObj;
        // 不存在微信授权缓存 不存在openid
        if(!wxTokenObj || !wxTokenObj.openid){
            // 缓存当前地址
            req.session.curUrl = req.originalUrl;
            return res.redirect('/login')
        // 如果超过过期时间，去刷新token
        }else if(wxTokenObj.expires_Time <= +new Date()) {
            // 缓存当前地址
            req.session.curUrl = req.originalUrl;
            // 跳转到刷新token路由
            return res.redirect('/refreshToken');
        }
        // 使用缓存openid 去支付接口
        let {orderNo, orderInfo, payOrderNo, paySum ,payType } = req.query;
        let member = req.session.member;
        req.session.orderNo = orderNo||'';
        //微信支付附加参数
        let params = {
            openId: wxTokenObj.openid,
            operateId: member.id,
            orderInfo: orderInfo,
            distributorCode:common.envConfig.corpCode
        };
        // 银联直付
        if(payType == '41'){
            let redirectUrl = common.envConfig.protocol+"://" + req.headers.host + "/yinlian/result";
            let {amount} = req.query
            params.orderNo = orderNo
            params.amount = amount
            params.payType = payType
            params.redirectUrl = redirectUrl
            params.subFlag = 'F'
            // 如果是蜈支洲官网
            let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode
            if(projectNameCode == 'official'){
                params.subFlag = 'T'
            }

        }
        let renderPage = '';
        switch (WXPAYTYPE) {
            case 32:
            case 33:
                renderPage = 'wxpay';
                break;
            case 34:
                renderPage = 'pay/wxpay';
        }
        if(WXPAYTYPE!="33") {
            //发送支付请求
            let urlArr = ['main', 'pay', 'main']
            if(orderNo){
                urlArr = ['main', 'pay', 'toPayByOrderNo']
            }
            common.commonRequest({
                url: [{
                    urlArr,
                    parameter: {
                        orderNo: orderNo,
                        userType: userType,
                        payType: payType||WXPAYTYPE, //微信支付类型
                        paySum: paySum,
                        payOrderNo: payOrderNo,
                        extendParamJson: JSON.stringify(params)
                    }
                }],
                page: renderPage,
                req: req,
                res: res,
                callBack: function (results, reObj, resp, handTag) {

                    if(payType == 41){
                        // 银联支付
                        handTag.tag = 0
                        res.redirect(results[0].data)
                    }
                    //小程序支付需要的参数(只有蜈支洲官网有)
                    req.session.xcxPay = {
                        orderNo: orderNo,
                        userType: userType,
                        payType: 33,
                        paySum: paySum,
                        payOrderNo: payOrderNo,
                        openId: wxTokenObj.openid,
                        operateId: member.id,
                        orderInfo: orderInfo,
                        distributorCode:common.envConfig.corpCode,
                        token: req.session.token,
                    };
                    switch (WXPAYTYPE) {
                        case 32:
                        case 33:
                            reObj.item = JSON.parse(results[0].data);
                            reObj.xcxInfo= req.session.xcxPay;
                            // let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode
                            // 如果存在微信授权支付代理
                            if(common.envConfig.weixinProxy){
                                handTag.tag = 0
                                let proxyPayUrl = common.envConfig.weixinProxy+'/weixinProxy/wxPay'
                                // 拼接参数
                                let item = JSON.parse(results[0].data)
                                item.redirectSuccess = common.envConfig.protocol+"://" + req.headers.host + "/payPlat/Notify/1";
                                item.redirectError = common.envConfig.protocol+"://" + req.headers.host + "/payPlat/Notify/0";
                                proxyPayUrl+='?item='+JSON.stringify(item)
                                res.redirect(proxyPayUrl)
                            }
                            break;
                        case 34:
                            reObj.item = results[0].data;
                            break;
                    }
                }
            });
        }else{
            //小程序支付需要的参数(只有蜈支洲官网有)
            req.session.xcxPay = {
                orderNo: orderNo,
                userType: userType,
                payType: 33,
                paySum: paySum,
                payOrderNo: payOrderNo,
                openId: wxTokenObj.openid,
                operateId: member.id,
                orderInfo: orderInfo,
                distributorCode:common.envConfig.corpCode,
                token: req.session.token,
            };
            res.render("wxpay", { xcxInfo: req.session.xcxPay, item:{} })
        }
    });

    // 授权access_token
    router.get('/horization', function (req, res, next) {
        let funArray = [];
        let {channelId='',promoterId='',teamBatchNo=''} = req.query
        // 获取微信accessToken | openid, 获取后存入缓存wxTokenObj
        let getaccessToken = function (cb) {
            common.commonRequest({
                url: [{
                    urlArr: ['main', 'wechat', 'accessToken'],
                    parameter: {
                        appid: common.envConfig.wx.appId,
                        secret: common.envConfig.wx.appSecret,
                        code: req.query.code,
                        grant_type: 'authorization_code'
                    },
                    outApi: true, //外网接口判断 {true:是}
                    noLocal: true
                }],
                req: req,
                res: res,
                callBack: function (results, reqs, resp, handTag) {
                    if(!results[0].openid) {
                        cb(null, new Error('微信授权失败'));
                        return
                    }
                    handTag.tag = 0;
                    // 缓存授权信息
                    req.session.wxTokenObj = {
                        access_token : results[0].access_token,
                        refresh_token: results[0].refresh_token,
                        openid: results[0].openid,
                        expires_in: results[0].expires_in,
                        expires_Time: new Date().getTime() + (results[0].expires_in * 1000) - 1000 // 过期时间： 当前时间 + 超时时间（减去1秒，防止延迟）
                    };
                    // 必须要加不加报错
                    cb(null,results);
                }
            });
        };

        // 获取微信用户信息 params: accessToken | openid
        let wxGetUserInfo = (results,cb)=>{
            let result = req.session.wxTokenObj;
            let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + result.access_token + '&openid=' + result.openid + '&lang=zh_CN';
            common.get(url).then(response=>{
                let {body} = response
                body.access_token =  result.access_token;
                cb(null, body);
            })
        };

        // 后台登录接口
        let wxlogin = function (result, cb) {
            common.commonRequest({
                url: [{
                    urlArr: ['main', 'index', 'wxlogin'],
                    parameter: {
                        accessToken: result.access_token,
                        openid: result.openid,
                        nickName: result.nickname,
                        imgUrl: result.headimgurl,
                        sex: result.sex,
                        channelId,
                        promoterId,
                        teamBatchNo
                    },
                }],
                req: req,
                res: res,
                callBack: function (results, reqs, resp, handTag) {
                    handTag.tag = 0;
                    cb(null,results);
                }
            });
        };

        // let refreshToken = function (cb) {
        //     let wxTokenObj = req.session.wxTokenObj;
        //     let url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + common.envConfig.wx.appId + '&grant_type=refresh_token&refresh_token=' + wxTokenObj.refresh_token;
        //     common.get(url).then(response=>{
        //         let result = response.body;
        //         req.session.wxTokenObj = {
        //             access_token : result.access_token,
        //             refresh_token: result.refresh_token,
        //             openid: result.openid,
        //             expires_in: result.expires_in,
        //             scope: result.scope,
        //             expires_Time: new Date().getTime() + (result.expires_in * 1000) - 1000 // 过期时间： 当前时间 + 超时时间（减去1秒，防止延迟）
        //         };
        //         cb(null);
        //     })
        // };

        // // 不存在微信授权数据, 再次查询
        // if(!req.session.wxTokenObj) {
        //     funArray.push(getaccessToken);
        // // token已经过期,刷新token
        // }else if(req.session.wxTokenObj.expires_Time <= +new Date()) {
        //     funArray.push(refreshToken);
        // }
        funArray.push(getaccessToken);
        funArray.push(wxGetUserInfo);
        funArray.push(wxlogin);

        async.waterfall(funArray, function (err, results) {
            if (err) {
                res.redirect('/error');
                return;
            }
            req.session.promoterId = promoterId;
            req.session.leaguerId = results[0].data.leaguerId;
            req.session.member = results[0].data;
            req.session.member.id = req.session.leaguerId
            req.session.token = results[0].data.token;
            let redirectUrl = req.session.urla || req.session.curUrl || req.query.curUrl || "/main";
            res.redirect(redirectUrl);
        });
    });


    //微信中转
    router.get('/wechatTransfer', function (req, res, next) {
        //获取code
        let redirect = common.getUrl({
            urlArr: ['main', 'wechat', 'Authorization'],
            parameter: {
                appid:req.query.appid,
                redirect_uri: encodeURIComponent('https://' + req.headers.host + '/wechatTransferUrl?states='+encodeURIComponent(req.query.redirect_uri)),
                response_type: 'code',
                scope: 'snsapi_userinfo'
            },
            outApi: true  //外网接口判断 {true:是}
        }) + '#wechat_redirect';
        res.redirect(redirect)
    });
    //微信中转
    router.get('/wechatTransferUrl', function (req, res, next) {
        if(req.query.states.indexOf("orderNo")!= -1  ){
            res.redirect(encodeURI(req.query.states)+'&code='+req.query.code);
        }else{
            res.redirect(req.query.states+'?code='+req.query.code);
        }
    });

    // 支付宝同步回调
    router.get('/payPlat/result', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main', 'pay', 'result'],
                parameter: {
                    outTradeNo: req.query.out_trade_no
                }
            }],
            req: req,
            res: res,
            page: 'payResult',
            title: '支付结果',
            callBack: function (results, reObj, resp, handTag) {
                reObj.backDetailUrl = req.session.backDetailUrl;
            }
        });
    });

    //微信智游宝支付回调
    router.post('/zybpay/result', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main', 'wechat', 'wxPayResult'],
                parameter: req.body
            }],
            req: req,
            res: res,
            page: 'payResult',
            title: '支付结果'
        });
    })

    // 微信支付回调
    router.get('/payPlat/Notify/:result', function (req, res, next) {
        let orderNo = req.session.orderNo
        let leaguerId = req.session.member.id
        if(orderNo && leaguerId){
            common.commonRequest({
                url: [{
                    urlArr: ['member', 'order', 'detail'],
                    parameter: {
                        orderNo: req.session.orderNo,
                        leaguerId: req.session.member.id
                    }
                }],
                req: req,
                res: res,
                page: 'payResult',
                title: '支付结果',
                callBack: function (results, reObj, resp, handTag) {
                    if (Number(req.params.result) === 1) {
                        results[0].flag = 'success';
                    } else {
                        results[0].flag = 'error';
                    }
                    reObj.orderNo = req.session.orderNo
                    reObj.backDetailUrl = req.session.backDetailUrl;
                }
            });
        }else{
            res.redirect('/list/order')
        }
    });

    // 银联支付回掉(该地址作为参数传入)
    router.get('/yinlian/result', function (req, res, next) {
        let orderNo = req.session.orderNo
        let leaguerId = req.session.member.id

        // 银联支付
        let payStatus = req.query.status
        if(orderNo && leaguerId){
            common.commonRequest({
                url: [{
                    urlArr: ['member', 'order', 'detail'],
                    parameter: {
                        orderNo,
                        leaguerId
                    }
                }],
                req: req,
                res: res,
                page: 'payResult',
                title: '支付结果',
                callBack: function (results, reObj, resp, handTag) {
                    // payStatus存在则说明是银联支付
                    if(payStatus == 'TRADE_SUCCESS'){
                        results[0].flag = 'success';
                    }else{
                        results[0].flag = 'error';
                    }
                    reObj.orderNo = req.session.orderNo
                    reObj.backDetailUrl = req.session.backDetailUrl;
                }
            });
        }else{
            if(payStatus == 'TRADE_SUCCESS'){
                // 支付成功
                res.redirect('/list/order')
            }else{
                // 支付失败
                res.render('payResult',{data:[{flag:'error',data:{}}]})
            }
        }
    });

    // 微信刷新token
    router.get('/refreshToken', function (req, res, next) {
        let wxTokenObj = req.session.wxTokenObj;
        let url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + common.envConfig.wx.appId + '&grant_type=refresh_token&refresh_token=' + wxTokenObj.refresh_token;
        common.get(url).then(response=>{
            let result = response.body;
            req.session.wxTokenObj = {
                access_token : result.access_token,
                refresh_token: result.refresh_token,
                openid: result.openid,
                expires_in: result.expires_in,
                scope: result.scope,
                expires_Time: new Date().getTime() + (result.expires_in * 1000) - 1000 // 过期时间： 当前时间 + 超时时间（减去1秒，防止延迟）
            };
            res.redirect(req.session.curUrl)
        })
    })
};
