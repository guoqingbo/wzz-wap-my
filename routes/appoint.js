const jade = require("jade");
const async = require("async");
const multer = require('multer');
let upload = multer({});
let utils = {
    getHours:function () {
        // 半小时之前的时间
        let date = new Date()
        date.setMinutes(date.getMinutes() + 30);

        let hours = date.getHours()
        let minutes = date.getMinutes()
        hours = hours<10?"0"+hours:hours
        minutes = minutes<10?"0"+minutes:minutes
        return hours+":"+minutes
    }
}
exports.mainRouter = function (router, common) {
    // 项目预约(大屏滚动)
    router.get('/appoint/list', function (req, res, next) {
       // res.render('appoint/list',{title:'预约列表'});
       //  if(req.query.orderNo){
       //      return res.redirect("/appoint/addGameOrder?orderNo="+req.query.orderNo)
       //  }
       //  common.commonRequest({
       //      url: [{
       //          urlArr: ['appoint', 'list'],
       //          parameter:{ projectCode: req.query.screenCode },
       //          outApi: common.envConfig.domain1
       //      }],
       //      req: req,
       //      res: res,
       //          page: 'appoint/list',
       //          title: '预约列表',
       //          callBack: function (results, reObj, res, handTag) {
       //          console.log('大屏数据：',JSON.stringify(results));
       //          if(results[0].status == 200){
       //
       //          }
       //      }
       //  });
        res.render('appoint/list',{
            title: '预约列表'
        })

    });

    router.post('/appointGetList',function (req,res,next) {
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'getList'],
                parameter:{ screenCode: req.body.screenCode },
                outApi: common.envConfig.domain1,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                // console.log('大屏全部项目：');
                if(results[0].status == 200){

                }
            }
        });
    });
    router.post('/appointGetInfo',function (req,res,next) {
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'list'],
                parameter:{ projectCode: req.body.id },
                outApi: common.envConfig.domain1,
                method: 'get'
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                // console.log('项目数据：',JSON.stringify(results));
            }
        });
    });


    // 游玩项目列表(wap 游客预约)
    router.get('/appoint/gameList', function (req, res, next) {
        res.render('appoint/gameList',{title:'游玩项目'});
    });

    // 游玩项目列表(wap 游客预约)分页查询
    router.post('/appoint/gameList', function (req, res, next) {
        let orderNo = req.query.orderNo;
        let isAppoint = req.query.isAppoint;
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'gameList'],
                parameter:req.body,
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status===200){
                    handTag.tag = false
                    let renderObj = {
                        data:results[0].data,
                        method:"ajax",
                        orderNo,
                        isAppoint
                    }
                    let html = jade.renderFile('views/appoint/mixin/gameList.jade', renderObj);
                    res.send([{status:200,html,pages:results[0].pages}])
                }
            }
        });

    });

    // 身份证或扫码预约页面
    router.get('/appoint/gameDetail/:id',common.isLogin, function (req, res, next) {
        let projectId = req.params.id
        let leaguerId = req.session.member.id
        // res.render('appoint/gameDetail',{title:'预约',projectId});
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'myTripList', 'leaguerTicket'],
                parameter:{leaguerCode: leaguerId, projectId},
                outApi:common.envConfig.domain1,
                method:"get"
            },{
                urlArr: ['myTrip', 'myTripList', 'getProjectTime'],
                parameter:{projectId},
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            page: 'appoint/gameDetail',
            title: '预约',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){
                    reObj.projectId=projectId
                    reObj.nowTime=utils.getHours()
                }
            }
        });

    });

    // 获取票型
    router.post('/appoint/saveLeaguerProject',common.isLogin, function (req, res, next) {
        let parameter = req.body
        parameter.leaguerCode = req.session.member.id
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'saveLeaguerProject'],
                parameter,
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status===200){
                    handTag.tag = false
                    let renderObj = {
                        data:results[0].data,
                        method:"ajax",
                    }
                    let html = jade.renderFile('views/appoint/mixin/gameDetail.jade', renderObj);
                    res.send([{status:200,html}])
                }
            }
        });
    });

    //提交照片识别
    router.post('/appoint/disPhoto',upload.any(),function (req, res, next) {
        let image = req.files[0].buffer.toString('base64');
        async.waterfall([
            function (cb) {
                let  params={
                    'grant_type': 'client_credentials',
                    'client_id': 'tG13Z8Px6FClmzMYw2PYZd1z',
                    'client_secret': 'N8rzh1U47NxfxpqPCytCdvv3h3asB11r'
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
                    image,
                };
                common.post(url,params).then(response=>{
                    cb(null, response.body);
                })
            }], function (err, results) {
            res.send(results);
        })

    });

    // 根据二维码返回的票型码获取票型
    router.post('/appoint/ticketInfo',common.isLogin, function (req, res, next) {
        let parameter = req.body
        parameter.leaguerCode = req.session.member.id
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'ticketInfo'],
                parameter,
                method:"get",
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status===200){
                    handTag.tag = false
                    let renderObj = {
                        data:results[0].data,
                        method:"ajax",
                    }
                    let html = jade.renderFile('views/appoint/mixin/gameDetail.jade', renderObj);
                    res.send([{status:200,html}])
                }
            }
        });
    });

    // 预约提交
    router.post('/appoint/saveProjects',common.isLogin, function (req, res, next) {
        let parameter = req.body
        parameter.leaguerCode = req.session.member.id
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'myTripList', 'saveProjects'],
                parameter,
                method: 'post',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function(results, reObj, res, handTag){

            }
        })
    });

    // 取消预约
    router.post('/appoint/cancel', function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'cancel'],
                parameter,
                method: 'get',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function(results, reObj, res, handTag){
                if(results[0].status == 200){

                }
            }
        });

    });

    // 通过订单预约
    router.get('/appoint/addGameOrder',common.isLogin, function (req, res, next) {
        let orderNo = req.query.orderNo
        let projectId = req.query.projectId
        let leaguerId = req.session.member.id
        // res.render('appoint/addGameOrder',{title:'预约'});
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order','detail'],
                parameter:{
                    orderNo,
                    leaguerId,
                },
            },{
                urlArr: ['myTrip', 'myTripList', 'getProjectTime'],
                parameter:{projectId},
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            page: 'appoint/addGameOrder',
            title: '预约',
            callBack: function (results, reObj, res, handTag){
                if(results[0].status == 200){
                    reObj.projectId = projectId;
                    reObj.nowTime=utils.getHours()
                    reObj.orderNo=orderNo
                }
            }
        });

    });

    // 通过订单查看预约
    router.get('/appoint/lookGameOrder',common.isLogin, function (req, res, next) {
        // res.render('appoint/lookGameOrder',{title:'预约'});
        var orderNo = req.query.orderNo;
        var projectId = req.query.projectId;
        var leaguerId = req.session.member.id;
        common.commonRequest({
            url: [{
                urlArr: ['member', 'order','detail'],
                parameter:{
                    orderNo,
                    leaguerId,
                },
            }],
            req: req,
            res: res,
            // page: 'appoint/lookGameOrder',
            // title: '预约',
            callBack: function (results, reObj, res, handTag){
                if(results[0].status==200){
                    handTag.tag = false;
                    let params = {
                        ticketNo:results[0].data.checkCode,
                        projectId
                    };
                    // let params = {
                    //     ticketNo:"ET190402000001084895",
                    //     projectId:"2"
                    // }
                    if(results[0].data.checkCode){
                        let url = common.gul(["appoint","orderBookInfo"],common.envConfig.domain1)
                        common.get(url,params).then(response=>{
                            // 项目不可预约
                            let flag = false
                            results.push(response.body)
                            if(results[1].success===false){
                                flag = true
                                // res.render('appoint/lookGameOrder',{flag:'false',title:"预约",orderNo:orderNo,projectId:projectId})
                            }
                            // else{
                            //     res.render('appoint/lookGameOrder',{data:results,title:"预约",orderNo:orderNo,projectId:projectId})
                            // }
                            res.render('appoint/lookGameOrder',{flag,data:results,title:"预约",orderNo:orderNo,projectId:projectId})
                        })
                    }else{
                        res.render('appoint/lookGameOrder',{flag:'false',title:"预约",orderNo:orderNo,projectId:projectId})
                    }

                }
            }
        });

    });

    // 个人中心排队查看入口
    router.get('/appoint/queue', function (req, res, next) {
       res.render('appoint/queue',{title:'排队查看'})
    });

    // 扫码（纸质票）排队查看列表
    router.post('/appoint/queueList', function (req, res, next) {
        let ticketNo = req.body.ticketNo
        // ticketNo = 'FT190903000001086867'
        // res.render('appoint/queueList',{title:'排队情况'});
        let url = common.gul(['appoint', 'ticketQueue'],common.envConfig.domain1)
        let params = {ticketNo}
        common.get(url,params).then(data=>{
            let {err,resp,body} = data
            // let renderObj = {
            //             data:[{currentNo:'123',projectName:'项目地方',queueUpNo:'123',num:1},{currentNo:'123',projectName:'项目地方',queueUpNo:'123',num:0}],
            //             method:"ajax",
            //         }
            // let html = jade.renderFile('views/appoint/mixin/queue.jade', renderObj);
            // res.send([{status:200,html}])
            if(body && body.status===200){
                let renderObj = {
                    data:body.data,
                    method:"ajax",
                }
                let html = jade.renderFile('views/appoint/mixin/queue.jade', renderObj);
                res.send([{status:200,html}])
            }else{
                res.send([body])
            }
        })

        // common.commonRequest({
        //     url: [{
        //         urlArr: ['appoint', 'ticketQueue'],
        //         parameter:{ticketNo},
        //         outApi:common.envConfig.domain1,
        //         method:'get'
        //     }],
        //     req: req,
        //     res: res,
        //     isAjax: true,
        //     callBack: function (results, reObj, res, handTag){
        //         if(results[0].status==200){
        //
        //         }
        //     }
        // });

    });

    // 手机取号
    router.get('/appoint/takeNum', function (req, res, next) {
        let projectId  = req.query.projectId || ''
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'getAllProject'],
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            page: 'appoint/takeNum',
            title: '手机取号',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){
                    reObj.projectId = projectId
                }
            }
        });
        // res.render('appoint/takeNum',{title:'手机取号'})
    });

    // 排号成功
    router.get('/appoint/takeNumSuccess', common.isLogin,function (req, res, next) {
        // res.render('appoint/takeNumSuccess',{title:'排号成功',data:[{data:{}}]})
        // return
        let {projectId,ticketNo} = req.query
        let leaguerId = req.session.member.id
        // projectId = 4
        // ticketNo = 'FT190903000001086867'
        common.commonRequest({
            url: [{
                urlArr: ['appoint','listForQueueWap'],
                outApi:common.envConfig.domain1,
                parameter:{
                    projectId,
                    ticketNo,
                    leaguerId,
                },
            }],
            req: req,
            res: res,
            page: 'appoint/takeNumSuccess',
            title: '排号成功',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){
                    reObj.projectId = projectId
                }
            }
        });
    });

    // 检查排号是否成功
    router.post('/appoint/listForQueueWap', function (req, res, next) {
        let {projectId,ticketNo} = req.body
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'listForQueueWap'],
                parameter:{projectId,ticketNo},
                method: 'get',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function(results, reObj, res, handTag){
                if(results[0].status == 200){

                }
            }
        });

    });

    // 取消排号
    router.post('/appoint/cancleQueueWap', function (req, res, next) {
        let {id} = req.body
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'cancleQueueWap'],
                parameter:{id},
                method: 'get',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function(results, reObj, res, handTag){
                if(results[0].status == 200){

                }
            }
        });

    });

    // 排队预约 手机端
    router.get('/appoint/queueIndex', function (req, res, next) {
        // res.render('appoint/queueIndex',{title:'排队预约',data:[{data:{}}]})
        common.commonRequest({
            url: [{
                urlArr: ['appoint','queueIndex'],
                outApi:common.envConfig.domain1,
                method:'POST'
            }],
            req: req,
            res: res,
            page: 'appoint/queueIndex',
            title: '排队预约',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });
    });
    // 去预约
    router.get('/appoint/goAppoint', function (req, res, next) {
        // res.render('appoint/goAppoint',{title:'预约',data:[{data:{}}]})
        common.commonRequest({
            url: [{
                urlArr: ['appoint','projectTypeList'],
                outApi:common.envConfig.domain1,
                method:"POST"
            }],
            req: req,
            res: res,
            page: 'appoint/goAppoint',
            title: '预约',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });
    });
    // 获取预约项目列表
    router.post('/appoint/goAppointList', function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'projectmanageList'],
                parameter,
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status===200){
                    handTag.tag = false
                    let renderObj = {
                        data:results[0].data.rows,
                        method:"ajax",
                    }
                    let html = common.jade('appoint/mixin/goAppointList', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages,bookInformation:results[0].bookInformation}])
                }
            }
        });
    });
    // 我的预约
    router.get('/appoint/myAppoint',common.isLogin,function (req, res, next) {
        // res.render('appoint/myAppoint',{title:'我的预约',data:[{data:{}}]})
        // return
        let leaguerId = req.session.member.id
        leaguerId=1
        common.commonRequest({
            url: [{
                urlArr: ['appoint','onlineMyOrder'],
                outApi:common.envConfig.domain1,
                parameter:{leaguerId},
                method:"POST"
            }],
            req: req,
            res: res,
            page: 'appoint/myAppoint',
            title: '我的预约',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });
    });
    // 我的排队
    router.get('/appoint/myQueue', function (req, res, next) {
        // res.render('appoint/myQueue',{title:'我的排队',data:[{data:{}}]})
        let leaguerId = req.session.member.id
        common.commonRequest({
            url: [{
                urlArr: ['appoint','onlineMyWait'],
                outApi:common.envConfig.domain1,
                parameter:{leaguerId},
                method:"POST"
            }],
            req: req,
            res: res,
            page: 'appoint/myQueue',
            title: '我的排队',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status==200){

                }
            }
        });
    });

};
