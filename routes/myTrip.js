let async = require('async');
// let needle = require('needle');
// let qs = require('querystring');

exports.mainRouter = function (router, common, requireLogin ) {

    // 我的行程
    router.get('/myTrip',common.isLogin, function (req, res, next) {
       //res.render('myTrip',{title:'行程规划'});
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'myTripList', 'list'],
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            page: 'myTrip',
            title: '行程规划',
            callBack: function (result, reObj) {
                reObj.leaguerId=req.session.member.id;
                reObj.ticketPark = common.envConfig.ticketPark
            }
        });

    });

    // 规划行程
    router.post('/projectPlan', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'projectPlan'],
                parameter:{
                    user_id:req.session.member.id,
                    user_name:req.session.member.loginName,
                    userPickJson:req.body.userPickJson,
                    leaguer_code:req.session.member.id
                },
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {
                reObj.projectPlan="projectPlan";
            }
        });

    });

    // 我的行程
    router.post('/myPlanList', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'myPlanList'],
                parameter:req.body,
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {
            }
        });

    });

    // 叫号
    router.get('/callNum', function (req, res, next) {
        let screenCode=req.query.screenCode;
        res.render('callNum',{title:'叫号',screenCode:screenCode});

    });
   // 叫号
    router.post('/callNum', function (req, res, next) {
       //res.render('callNum',{title:'叫号'});
       let screenCode=req.body.screenCode;
       common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'screenCode'],
                parameter:{
                    screenCode:screenCode
                },
                method: 'get',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {
            }
        });

    });

    // 导游导览
    router.get('/myGuide', common.isLogin,function (req, res, next) {
        let projectId=req.query.projectId;
       common.commonRequest({
             url: [{
                 urlArr: ['myTrip', 'myTripList', 'getProjectTime'],
                 parameter:{
                     projectId:projectId
                 },
                 outApi:common.envConfig.domain1
             }],
             req: req,
             res: res,
             page: 'myGuide',
             title: '导游导览',
             callBack: function (result, reObj) {
                 reObj.leaguerId=req.session.member.id;
             }
         });
    });

    // 导游导览
    router.post('/leaguerTicket', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'myTripList', 'leaguerTicket'],
                parameter:req.body,
                outApi:common.envConfig.domain1,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {

            }
        });

    });

    //提交照片识别
    router.post('/disPhoto', function (req, res, next) {
        async.waterfall([
            function (cb) {
                //测试
                // let  params={
                //     'grant_type': 'client_credentials',
                //     'client_id': 'tG13Z8Px6FClmzMYw2PYZd1z',
                //     'client_secret': 'N8rzh1U47NxfxpqPCytCdvv3h3asB11r'
                // };
                //正式
                var  params={
                    'grant_type':common.envConfig.idCard.grant_type,
                    'client_id': common.envConfig.idCard.client_id,
                    'client_secret': common.envConfig.idCard.client_secret
                };
                common.post("https://aip.baidubce.com/oauth/2.0/token",params)
                    .then(response=>{
                        cb(null,response.body);
                    })

            },
            function (result, cb) {
                let url="https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token="+result.access_token;
                let params={
                    id_card_side:'front',
                    detect_direction:true,
                    detect_risk:false,
                    image:req.body.image
                };
                common.post(url,params).then(response=>{
                    cb(null, response.body);
                })
            }], function (err, results) {
            res.send(results);
        })

    });

    // 排队过号
    router.post('/saveProjects', function (req, res, next) {
        let projectDetailId=req.body.projectDetailId,
            projectinfoId=req.body.projectinfoId,
            leaguerCode=req.body.leaguerCode,
            ticketNo=req.body.ticketNo;
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'myTripList', 'saveProjects'],
                parameter:{
                    projectDetailId:projectDetailId,
                    projectinfoId:projectinfoId,
                    ticketNo:ticketNo,
                    leaguerCode:leaguerCode
                },
                method: 'post',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {

            }
        });

    });

    // 票型
    router.post('/saveLeaguerProject', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'saveLeaguerProject'],
                parameter:req.body,
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (result, reObj) {

            }
        });
    });

    //
};
