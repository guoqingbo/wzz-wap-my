exports.mainRouter = function (router, common) {
    function isLogin(req, res, next){
        if(!req.session.supplier){
            if(req.method=="POST" || req.headers['x-requested-with']=='XMLHttpRequest'){
                return res.send([{status:400,message:"请重新登录"}])
            }else{
                res.redirect('/supplier/login?redir='+encodeURIComponent(req.originalUrl))
            }
        }else {
            next()
        }
    }

    // 供应商登陆
    router.get('/supplier/login', function (req, res, next) {
       res.render('supplier/login',{title:'登陆',redir:req.query.redir||''});
       //  common.commonRequest({
       //      url: [{
       //          urlArr: ['myTrip', 'myTripList', 'list'],
       //          outApi:common.envConfig.domain1
       //      }],
       //      req: req,
       //      res: res,
       //      page: 'myTrip',
       //      title: '行程规划',
       //      callBack: function (result, reObj) {
       //          reObj.leaguerId=req.session.member.id;
       //          reObj.ticketPark = common.envConfig.ticketPark
       //      }
       //  });

    });
    // 供应商账号密码登陆
    router.post('/supplier/login', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['supplier', 'login'],
                parameter: req.body,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    handTag.tag = 0
                    req.session.supplier = {
                        corpCode:results[0].data.corpCode,
                        userId:results[0].data.userId,
                        token:results[0].data.token
                    }
                    res.send(results)
                }
            }
        });
    });
    // 扫码核销
    router.get('/supplier/scanCode', isLogin,function (req, res, next) {
        res.render('supplier/scanCode',{title:'扫码核销'});
        //  common.commonRequest({
        //      url: [{
        //          urlArr: ['myTrip', 'myTripList', 'list'],
        //          outApi:common.envConfig.domain1
        //      }],
        //      req: req,
        //      res: res,
        //      page: 'myTrip',
        //      title: '行程规划',
        //      callBack: function (result, reObj) {
        //          reObj.leaguerId=req.session.member.id;
        //          reObj.ticketPark = common.envConfig.ticketPark
        //      }
        //  });

    });
    // 扫码核销
    router.post('/supplier/checkOrderH5', isLogin,function (req, res, next) {
        let parameter = req.body
        parameter.corpCode = req.session.supplier.corpCode
        common.commonRequest({
            url: [{
                urlArr: ['supplier', 'checkOrderH5'],
                parameter,
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){

                }
            }
        });
    });
    // 快速查单
    router.get('/supplier/lookOrder',isLogin, function (req, res, next) {
        // res.render('supplier/lookOrder',{title:'查看订单'});
         common.commonRequest({
             url: [{
                 urlArr: ['supplier', 'expressType'],
             }],
             req: req,
             res: res,
             page: 'supplier/lookOrder',
             title: '查看订单',
             callBack: function (result, reObj) {
                if(result[0].status == 200){

                }
             }
         });

    });
    // 快速查单
    router.post('/supplier/getOrderList',isLogin, function (req, res, next) {
        // res.render('supplier/lookOrder',{title:'查看订单'});
        let parameter = req.body
        parameter.corpCode = req.session.supplier.corpCode
        common.commonRequest({
            url: [{
                urlArr: ['supplier', 'searchOrderDetail'],
                parameter,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    handTag.tag = 0
                    let renderObj = {
                        data:results[0].data.rows,
                        method:"ajax",
                    }
                    let html = common.jade('supplier/mixin/orderList', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages}])
                }
            }
        });

    });
    // 确认发货
    router.post('/supplier/checkGoods',isLogin, function (req, res, next) {
        let parameter = req.body
        parameter.corpCode = req.session.supplier.corpCode
        common.commonRequest({
            url: [{
                urlArr: ['supplier', 'checkGoods'],
                parameter,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){

                }
            }
        });

    });
    // 我的
    router.get('/supplier/personCenter',isLogin, function (req, res, next) {
        res.render('supplier/personCenter',{title:'个人中心'});
        //  common.commonRequest({
        //      url: [{
        //          urlArr: ['myTrip', 'myTripList', 'list'],
        //          outApi:common.envConfig.domain1
        //      }],
        //      req: req,
        //      res: res,
        //      page: 'myTrip',
        //      title: '行程规划',
        //      callBack: function (result, reObj) {
        //          reObj.leaguerId=req.session.member.id;
        //          reObj.ticketPark = common.envConfig.ticketPark
        //      }
        //  });

    });
    // 退出登录
    router.post('/supplier/loginOut', function (req, res, next) {
        // res.render('supplier/lookOrder',{title:'查看订单'});
        delete req.session.supplier
        res.send([{status:200,message: '成功退出'}])
    });
};
