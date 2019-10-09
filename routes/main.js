let moment = require('moment');
let url = require("url");

let utils = {
    //  是否加载国庆风格
    isGuoQing(){
        let flag = false
        let nowDay = moment().format('YYYY-MM-DD hh:mm:ss')
        if(nowDay>='2019-09-30 23:59:59' && nowDay<='2019-10-07 23:59:59'){
            flag = true
        }else if(process.env.NODE_ENV !='production' && (nowDay>='09-24 23:59:59' && nowDay<='10-07 23:59:59')){
            // 非生产环境
            flag = true
        }
        return flag
    }
}
exports.mainRouter = function (router, common) {
    // 首页
    router.get(['/', '/main'], function (req, res, next) {
        console.log(req.query)
        // 全渠道扫码进入首页需要登录
        // if(req.query.promoterId){
        //     // 全渠道参数进入，判断是否要重新登陆，promoterId和之前登陆不一样时，重新登陆
        //     let isReLogin = false
        //     if(req.session.promoterId!==req.query.promoterId){
        //         isReLogin = true
        //     }
        //     // 全渠道参数
        //     // let promoter = req.query.promoter;
        //     // req.session.channelId=req.query.channelId||"";
        //     // req.session.promoterId=req.query.promoterId||"";
        //     // req.session.teamBatchNo=req.query.teamBatchNo||"";
        //     // req.session.promoteSrcCode=req.query.promoteSrcCode||"";
        //     if(isReLogin){
        //         req.session.curUrl = req.originalUrl
        //         return res.redirect('/login')
        //     }
        //     // common.isLogin(req, res)
        // }else{
        //     // 全渠道参数
        //     req.session.channelId="";
        //     req.session.promoterId="";
        //     req.session.teamBatchNo="";
        //     req.session.promoteSrcCode=""
        // }


        let title = ''
        // projectNameCode判断所属项目
        let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode


        if(projectNameCode=='official'){
            // 官网wap
            title = '三亚蜈支洲岛旅游区'
            page = 'main/official'
            modelCode = 'home_page'
        }else if(projectNameCode=='wangWang'){
            // 汪汪商城
            title = '汪汪旅游官网_海南三亚旅游潜水娱乐尽在汪汪旅游'
            page = 'main/wangWang'
            modelCode = 'home_page'
        }else if(projectNameCode=='coralHotel'){
            // 珊瑚酒店
            title = '珊瑚酒店'
            page = 'main/coralHotel'
            modelCode = 'home_page2'
        }else if(projectNameCode=='storeTerminal'){
            // 珊瑚酒店
            title = '门店终端分销商城'
            page = 'main/storeTerminal'
            modelCode = 'home_page'
        }
        common.commonRequest({
            url: [{
                urlArr: ['main', 'index', 'allInfo'],
                parameter: {
                    modelCode,
                }
            }],
            req: req,
            res: res,
            page,
            title,
            callBack: function (results, reObj,res, handTag) {
                if(results[0].status == 200){
                    let pageMeta = common.setPageMeta("indexmeta",req)
                    Object.assign(reObj, pageMeta);
                    reObj.module = 'index';
                    reObj.ticketPark = common.envConfig.ticketPark
                    reObj.isGuoQing = utils.isGuoQing()
                }
            }
        });

    });

    // 登陆页面
    router.get('/login', function (req, res, next) {
        let redir = req.query.redir || req.session.curUrl || './member'
        let promoter = ''
        let {channelId='',promoterId='',teamBatchNo=''} = url.parse(redir,true).query;
        if(promoterId){
            promoter = '?channelId='+channelId+'&promoterId='+promoterId+'&teamBatchNo='+teamBatchNo
        }
        if (common.is_weixn(req)) {
            // if(req.session.wxTokenObj && req.session.wxTokenObj.expires_Time <= +new Date()) {
            //     return res.redirect('/horization');
            // }
            let redirect = common.getUrl({
                urlArr: ['main', 'wechat', 'Authorization'],
                parameter: {
                    appid: common.envConfig.wx.appId,
                    redirect_uri: encodeURIComponent(common.envConfig.protocol+'://' + req.headers.host + '/horization/'+promoter),
                    response_type: 'code',
                    scope: 'snsapi_userinfo'
                },
                outApi: true  //外网接口判断 {true:是}
            }) + '#wechat_redirect'

            // 如果配置存在微信授权支付代理，使用蜈支洲wap官网的微信授权
            // let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode
            if(common.envConfig.weixinProxy){
                redirect = common.envConfig.weixinProxy+'/weixinProxy/getCode?redirectUri='+ encodeURIComponent('http://' + req.headers.host + '/horization/'+promoter)
            }
            res.redirect(redirect)
        } else {
            res.render('login', {
                title: '登录',
                redir,
            })
        }
    });

    //注册
    router.get('/register', function (req, res, next) {
        res.render('register', {title: '注册', redir: req.session.curUrl || './member'});
    });

    //查看用户协议
    router.get('/register/protocol', function (req, res, next) {
        res.render('member/register/registrationProtocol', {title: '注册协议'});
    });

    // 注册
    router.get('/signIn', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'register'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //登录
    router.post('/leaguerLogin', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'main'],
                parameter: req.body,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    req.session.promoterId = req.body.promoterId
                }
            }
        });
    });
    //手机号快捷登录
    router.post('/phoneNumberLogin', function (req, res, next) {
        req.body.channel = 'LOTSWAP';
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'leaguerMobileLogin'],
                parameter: req.body,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    req.session.promoterId = req.body.promoterId
                }
            }
        });
    });


    // 发送验证码
    router.post('/checkCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'sendCheckCode'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    // 注销用户
    router.get('/loginOut', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'logout']
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                req.session.destroy()
            }
        });
    });

    //忘记密码
    router.get('/forgetPassword', function (req, res, next) {
        res.render('pwd1', {title: '忘记密码'});
    });

    //核对验证码是否正确
    router.get('/checkPhoneCode', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'checkPhoneCode'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //打开重置密码页面
    router.get('/resetPassword', function (req, res, next) {
        res.render('pwd2', {title: '忘记密码', id: req.query.id});
    });

    //设置新密码
    router.get('/setNewPassword', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'resetPwd'],
                parameter: req.query,
                method:"POST"
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //无密登录
    router.get('/fastregByAccount', function (req, res, next) {
        req.query.channel = 'LOTSWAP';
        common.commonRequest({
            url: [{
                urlArr: ['member', 'login', 'fastregByAccount'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });


    //完善信息
    router.post('/phoneSave', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order', 'phoneSave'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if (results[0].status == 200) {
                    req.session.member.mobileAuth = 1;
                    req.session.member.mobile = req.body.phone;
                }
            }
        });
    });
    // 其它只通过链接访问的模块
    router.get('/other', function (req, res) {
        res.render('other', {title: '其它嵌入的模块'})
    });
    //错误处理
    router.get('/error', function (req, res, next) {
        res.render('error', {
            message: req.flash('message').toString()
        })
    });

    router.get('/404', function (req, res) {
        res.status(404);
        res.render('error404', {
            message: req.flash('message').toString()
        })
    });

};
