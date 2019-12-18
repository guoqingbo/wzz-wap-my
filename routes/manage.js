// let moment = require('moment');
let utils = {
    getDay(date){
        if(!date){
            date = new Date();
        }
        let weekObj = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        let dayObj = {};
        dayObj.year = date.getFullYear();
        dayObj.month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
        dayObj.day = (date.getDate())<10?"0"+(date.getDate()):(date.getDate());
        dayObj.week = weekObj[date.getDay()];
        dayObj.today = dayObj.year+'-'+ dayObj.month+'-'+ dayObj.day;
        return dayObj
    },
    getDayList(common,req){
        let dayList = []
        let date = new Date();
        for(let i=0;i<5;i++){
            if(i>0){
                date.setTime(date.getTime()+1000*60*60*24)
            }
            let day = utils.getDay(date)
            let dayObj = {
                day:day.month+"月"+day.day+"日",
                week:day.week,
                today:day.today
            }
            dayList.push(dayObj)
        }
        return dayList
    },
}
exports.mainRouter = function (router, common) {
    function isLogin(req, res, next){
        if(!req.session.manage){
            if(req.method=="POST" || req.headers['x-requested-with']=='XMLHttpRequest'){
                return res.send([{status:400,message:"请重新登录"}])
            }else{
                res.redirect('/manage/login?redir='+encodeURIComponent(req.originalUrl))
            }
        }else {
            next()
        }
    }

    // 供应商登陆
    router.get('/manage/login', function (req, res, next) {
       res.render('manage/login',{title:'登陆',redir:req.query.redir||''});
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
    router.post('/manage/login', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['manage', 'login'],
                parameter: req.body,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    handTag.tag = 0
                    req.session.manage = {
                        corpCode:results[0].data.corpCode,
                        userId:results[0].data.userId,
                        token:results[0].data.token
                    }
                    res.send(results)
                }
            }
        });
    });
    // 票型列表
    router.get('/manage/ticket',isLogin, function (req, res, next) {
        let dayList = utils.getDayList(common,req);
        res.render('manage/ticket',{title:'票型管理',dayList});

    });
    // 票型列表
    router.post('/manage/getTicketList',isLogin, function (req, res, next) {
        // res.render('manage/lookOrder',{title:'查看订单'});
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['manage', 'rateCodeList'],
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
                    let html = common.jade('manage/mixin/ticket', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages}])
                }
            }
        });

    });
    // 确认发货
    router.post('/manage/changeFlag',isLogin, function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['manage', 'changeFlag'],
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

    // 退出登录
    router.post('/manage/loginOut', function (req, res, next) {
        // res.render('manage/lookOrder',{title:'查看订单'});
        delete req.session.manage
        res.send([{status:200,message: '成功退出'}])
    });
};
