exports.mainRouter = function (router, common) {

    // 供应商登陆
    router.get('/supplier/login', function (req, res, next) {
       res.render('supplier/login',{title:'登陆'});
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
        res.send([{status:200}])
        // common.commonRequest({
        //     url: [{
        //         urlArr: ['member', 'login', 'leaguerMobileLogin'],
        //         parameter: req.body,
        //         method: 'get'
        //     }],
        //     req: req,
        //     res: res,
        //     isAjax: true,
        //     callBack: function (results, reqs, resp, handTag) {
        //         if(results[0].status == 200){
        //             // let promoter = JSON.parse(req.cookies.promoter || '{}')
        //             // req.session.promoterId = promoter.promoterId
        //         }
        //     }
        // });
    });
    // 扫码核销
    router.get('/supplier/scanCode', function (req, res, next) {
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

};
