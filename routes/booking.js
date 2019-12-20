exports.mainRouter = function (router, common) {

    // 预售券列表
    router.get('/booking/list', function (req, res, next) {
        // res.render('booking/list',{title:'预售券列表'});
        common.commonRequest({
            url: [{
                urlArr: ['booking','list','getLabel'],
                parameter:{
                    businessType:'booking'
                }
                // method:"POST"
            }],
            req: req,
            res: res,
            page: 'booking/list',
            title: '预售券列表',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });

    });
    // 预售券列表
    router.post('/booking/getList', function (req, res, next) {
        // res.render('booking/lookOrder',{title:'查看订单'});
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['booking', 'list','pagelist'],
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
                    let html = common.jade('booking/mixin/list', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages}])
                }
            }
        });

    });

    // 预售券详情
    router.get('/booking/detail', function (req, res, next) {
        // res.render('booking/list',{title:'预售券列表'});

        let rateCode = req.query.rateCode
        // findDate=req.query.date,
        common.commonRequest({
            url: [{
                urlArr: ['booking', 'detail', 'main'],
                parameter: {goodsCode: rateCode}
            },{
                urlArr: ['main', 'comment', 'info'],
                parameter: {
                    modelCode: rateCode
                }
            }],
            req: req,
            res: res,
            page: 'booking/detail',
            title: '预售券详情',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });

    });
    // 预售券订单
    router.get('/booking/order',common.isLogin, function (req, res, next) {
        // res.render('booking/order',{title:'预售券订单'});

        let rateCode = req.query.rateCode
        // findDate=req.query.date,
        common.commonRequest({
            url: [{
                urlArr: ['booking', 'detail', 'main'],
                parameter: {goodsCode: rateCode}
            }],
            req: req,
            res: res,
            page: 'booking/order',
            title: '预售券下单',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });

    });

    // 确认发货
    router.post('/booking/changeFlag', function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['booking', 'changeFlag'],
                parameter,
                // method: 'get'
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
};
