let  moment = require("moment")
exports.mainRouter = function (router, common) {
    // 获取证件类型
    function getCertType(req,res,next){
        if(req.session.certType){
            res.locals.certType = req.session.certType
            next()
            return
        }
        common.commonRequest({
            url: [{
                urlArr:['member','linkMan','getCertType']
            }],
            req: req,
            res: res,
            callBack:function(results, reObj, res, handTag){
                if(results[0].status == 200){
                    handTag.tag = 0
                    res.locals.certType = req.session.certType = results[0].data
                    next()
                }
            }
        });
    }
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
    router.get('/booking/order',common.isLogin,getCertType, function (req, res, next) {
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

    // 表单提交
    router.post('/booking/saveOrder', function (req, res, next) {
        let {channelId='',promoterId='',teamBatchNo='',promoteSrcCode=''} = JSON.parse(req.cookies.promoter || '{}')
        let parameter = req.body
        if (req.session.member) {
            parameter.leaguerId = req.session.member.id;
        }

        parameter.promoteSrcCode = promoteSrcCode;
        //线上channelId
        parameter.channelId= channelId;


        parameter.busiType = 'booking';
        parameter.accountType = 4;
        common.commonRequest({
            url: [{
                urlArr: ['order', 'saveOrder'],
                parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                req.session.orderinfo = results[0].data;
            }
        });
    });

    // 预约记录
    router.get('/booking/record',common.isLogin, function (req, res, next) {
        // res.render('booking/record',{title:'预约记录'});

        // let rateCode = req.query.rateCode
        // // findDate=req.query.date,
        common.commonRequest({
            url: [{
                urlArr: ['booking', 'order', 'getAppointment'],
                parameter: {buyerId: req.session.member.leaguerId}
            }],
            req: req,
            res: res,
            page: 'booking/record',
            title: '预约记录',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });

    });
    //预约记录
    router.post('/booking/getRecordList', function (req, res, next) {
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
                    let html = common.jade('booking/mixin/recordList', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages}])
                }
            }
        });

    });

    // 预售券预约
    router.get('/booking/appoint',common.isLogin, function (req, res, next) {
        // res.render('booking/appoint',{title:'预售券预约'});

        let orderNo = req.query.orderNo
        // findDate=req.query.date,
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter: {
                    orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'booking/appoint',
            title: '预售券预约',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){
                    reObj.day = moment().format('YYYY-MM-DD')
                }
            }
        });

    });
    // 表单提交
    router.post('/booking/saveAppoint', function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['booking','order' ,'appointment'],
                parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {

            }
        });
    });
};
