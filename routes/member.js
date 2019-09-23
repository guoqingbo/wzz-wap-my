// var async = require('async'),
//     needle = require('needle');
exports.mainRouter = function (router,common){
    // 个人中心
    router.get('/member', common.isLogin, function (req,res,next){
        var meb_flag;
        if(common.is_weixn(req)){
            meb_flag=1;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: { leaguerId: req.session.member.id}
            }],
            req: req,
            res: res,
            page: 'member',
            title: '个人中心',
            callBack:function(results, reObj, res, handTag){
                req.session.member = results[0].data;
                reObj.module = 'member';
                reObj.mebFlag= meb_flag;
            }
        });
    });

    // 用户中心
    router.get('/member/user', common.isLogin, function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: {leaguerId: req.session.member.id}
            }],
            req: req,
            res: res,
            page: 'member/user/index',
            title: '用户中心',
            callBack: function (results, reObj, res, handTag){
                let userInfo = results[0].data;
                reObj.module = 'member';
                for (key in userInfo){
                    req.session.member[key] = userInfo[key];
                }
            }
        });
    });

    // 修改用户信息
    router.get('/member/user/:modify', common.isLogin, function (req,res,next){
        res.render('member/user/modify',{title:'修改信息',modify:req.params.modify,data:req.session.member, module: 'member'});
    });

    //打开修改密码页面
    router.get('/member/changePassword', common.isLogin, function (req,res,next){
        res.render('member/user/changePassword',{ module: 'member',leaguerId:req.session.member.id,loginName:req.session.member.loginName});
    });

    //修改用户密码
    router.post('/member/leaguerFixPwd',function (req,res,next){
        if(req.body.newPass === req.body.loginPass) {
            return res.send([{status: '400', message: '不能与旧密码相同'}])
        }
        req.body.loginName = req.session.member.loginName;
        common.commonRequest({
            url: [{
                urlArr: ['member','leaguerFixPwd'],
                parameter: req.body,
                method: "get"
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

     // 提交用户修改
    router.post('/member/modify',function (req,res,next){
        req.query.loginId = req.session.member.id;
        common.commonRequest({
            url: [{
                urlArr: ['member','modify'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results){
                for (key in req.query){
                    req.session.member[key] = req.query[key];
                }
            }
        });
    });


    // 订单详情
    router.get('/member/order/:orderNo', common.isLogin, function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter: {
                    orderNo: req.params.orderNo,
                    leaguerId:req.session.member.id
                    // orderNo: '19019091119000028',
                    // leaguerId:'15138'
                }
            }],
            req: req,
            res: res,
            page: 'member/order/detail',
            title: '订单详情_三亚蜈支洲岛旅游区',
            callBack: function (results,reObj,resp,handTag){
                if(results[0].status==200){
                    if(results[0].data.orderInfo){
                        reObj.title = results[0].data.orderInfo+"__三亚蜈支洲岛旅游区"
                    }

                    req.session.orderinfo=results[0].data;
                    let ticketNo=results[0].data.checkCode
                    // let isAppoint = "F"
                    // reObj.isAppoint=isAppoint
                    if(ticketNo){
                        handTag.tag = false
                        let params = {
                            ticketNo,
                        }
                        // 判断该订单是否已经预约
                        let url = common.gul(["appoint","isAppoint"],common.envConfig.domain1)
                        common.get(url,params).then(response=>{
                            let isAppoint = ''
                            if(response && response.body){
                                isAppoint = response.body.status
                            }
                            res.render('member/order/detail',{data:results,isAppoint,title:"订单详情"})
                        })
                    }

                }
            }
        });
    });
    // 退单详情
    router.get('/member/refundDetail/:orderNo', common.isLogin, function (req,res,next){
        let refundNo=req.query.refundNo;
        common.commonRequest({
            url: [{
                urlArr: ['member','order','refundDetail'],
                parameter: {
                    orderNo: req.params.orderNo,
                    refundNo:refundNo,
                    leaguerId:req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'member/order/refundDetail',
            title: '订单详情',
            callBack: function (results,reqs,resp,handTag){
                req.session.orderinfo=results[0].data;
            }
        });
    });

    // 订单评论页
    router.get('/member/comment/:module', common.isLogin, function (req,res,next){
        res.render('member/order/comment',{title:'订单评论',module:req.params.module,orderNo:req.query.orderNo,modelCode:req.query.modelCode});
    });

    // 提交评论
    router.post('/member/comment',function (req,res,next){
        req.body.leaguerId = req.session.member.id;
        req.body.leaguerName = req.session.member.realName ? req.session.member.realName : req.session.member.loginName;
        common.commonRequest({
            url: [{
                urlArr: ['main','comment','add'],
                parameter: req.body
            }],
            isAjax: true,
            req: req,
            res: res
        });
    });

    // 退款页面
    router.get('/member/refund/:module', common.isLogin, function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter: {
                    orderNo: req.query.orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            req: req,
            res: res,
            page: 'member/order/refund',
            title: '订单退款',
            callBack: function (results, reObj, resp, handTag){
                reObj.module = req.params.module
            }
        });
    });

    // 提交退款
    router.post('/member/refund/:module',function (req,res,next){
        let params = {};
        params.leaguerId =  req.session.member.id;
        params.orderNo =  req.body.orderNo;
        params.reason =  req.body.reason;
        params.refundDetailJson =  req.body.refundDetailJson;
       /* if(req.body.isRealName === 'true'){
            params.refundDetailJson.orderDetaimModelId = req.body.idNo.join(',');
        }*/
        common.commonRequest({
            url: [{
                urlArr: ['member','order','refund'],
                parameter: params
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (results, resObj) {
            }
        });
    });

    //退款金额接口
    router.post('/member/refundSum',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','order','getRefundSum'],
                parameter: req.body
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (results, resObj) {

            }
        });
    });

    //取消订单
    router.post('/member/cancle/:orderNo',function (req, res, next) {
        common.commonRequest({
            url:[{
                urlArr:['member','order','cancel'],
                parameter:{
                    orderNo:req.params.orderNo,
                    leaguerId:req.session.member.id
                }
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });

    //删除订单
    router.post('/member/remove/:orderNo',function (req, res, next) {
        common.commonRequest({
            url:[{
                urlArr:['member','order','remove'],
                parameter:{orderId:req.params.orderId}
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });

    // 确认收货
    router.post('/receivedGoods/:orderNo', function (req, res) {
        let orderNo = req.params.orderNo;
        let leaguerId = req.session.member.leaguerId;
        common.commonRequest({
            url:[{
                urlArr:['member','order','receivedGoods'],
                parameter:{
                    orderNo,
                    leaguerId
                },
                method: 'get'
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });

    // 个人中心获取常用常用联系人信息
    router.get('/member/linkMan/list', common.isLogin, function(req,res,next){
        common.commonRequest({
            url:[{
                urlArr:['member','linkMan','list']
            }],
            page: 'member/linkMan/list',
            title: '常用游玩人',
            req: req,
            res: res,
            callBack: function (result, reObj) {
                reObj.originalUrl = req.query.originalUrl || ''
                reObj.comefrom =  req.query.comefrom || ''
            }
        })
    });

    // 个人中心新增常用常用联系人信息
    router.get('/member/linkMan/add', common.isLogin, function(req,res,next){
        res.render('member/linkMan/add',{title:'新增游玩人'});
    }).post('/member/linkMan/add',function(req,res,next){
        req.body.auto="F";
        common.commonRequest({
            url:[{
                urlArr:['member','linkMan','add'],
                parameter: req.body
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (result, reObj) {
                req.session.linkManInfo = req.body
            }
        })
    });

    // 个人中心修改常用常用联系人信息
    router.get('/member/linkMan/modify', common.isLogin, function(req,res,next){
        res.render('member/linkMan/modify',{title:'修改游玩人',data:req.query});
    }).post('/member/linkMan/modify',function(req,res,next){
        common.commonRequest({
        url:[{
            urlArr:['member','linkMan','modify'],
            parameter: req.body
        }],
        isAjax: true,
        req: req,
        res: res
    })
    });

    //个人中心删除常用常用联系人信息
    router.post('/member/linkMan/del', function(req,res,next){
        common.commonRequest({
            url:[{
                urlArr:['member','linkMan','del'],
                parameter: req.query
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });

    // 下单页面获取常用联系人信息
    router.get('/member/linkMan', common.isLogin, function(req,res,next){
        common.commonRequest({
            url:[{
                urlArr:['member','linkMan','list']
            }],
            isAjax: true,
            req: req,
            res: res
        })
    });

    // 申请售后页面
    router.get('/member/saleAfter/:orderNo', common.isLogin, function(req,res,next){
        let orderNo = req.params.orderNo
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
            page: "member/saleAfter/index",
            title: '售后申请',
            callBack: function (results, reObj, resp, handTag){
                if(results[0].status==200){
                    reObj.orderNo = orderNo
                    if(results[0].data.orderType=='combo'){
                        reObj.max = results[0].data.amount
                    }else{
                        reObj.max = results[0].data.orderDetails[0].checkAmount
                    }
                }
            }
        });
    });
    // 提交申请
    router.post('/member/saleAfterConfirm',function (req, res, next) {
        let parameter = req.body
        common.commonRequest({
            url:[{
                urlArr:['member','order','applyOrder'],
                parameter
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (results,reObj,resp,handTag) {
                if(results[0].status == 200){

                }
            }
        })
    });
}
