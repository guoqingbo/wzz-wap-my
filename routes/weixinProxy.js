exports.mainRouter = function (router, common) {
    // 获取微信授权code
    router.get('/weixinProxy/getCode', function (req, res, next) {
        // redirectUri 需要用encodeURIComponent编码，是要跳转回去的地址
        let redirectUri = req.query.redirectUri
        //获取code
        let redirect = common.getUrl({
            urlArr: ['main', 'wechat', 'Authorization'],
            parameter: {
                appid: common.envConfig.wx.appId,
                redirect_uri:  encodeURIComponent('https://' + req.headers.host + '/weixinProxy/redirect?redirectUri='+redirectUri),
                response_type: 'code',
                scope: 'snsapi_userinfo'
            },
            outApi: true  //外网接口判断 {true:是}
        }) + '#wechat_redirect'
        res.redirect(redirect)
    });
    // 获取微信授权code后返回原地址
    router.get('/weixinProxy/redirect', function (req, res, next) {
        let redirectUri = encodeURI(req.query.redirectUri)
        if(/\?/.test(redirectUri)){
            // 如果url有参数
            redirectUri+='&code='+req.query.code
        }else{
            redirectUri+='?code='+req.query.code
        }
        res.redirect(redirectUri);
    });

    // 微信支付
    router.get('/weixinProxy/wxPay', function (req, res, next) {
        let item = JSON.parse(req.query.item||'{}')
        res.render('wxProxyPayCall',{item})
    });
};
