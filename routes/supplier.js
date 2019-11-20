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
};
