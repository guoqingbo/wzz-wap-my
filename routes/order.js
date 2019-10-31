var async = require('async'),
    // needle = require('needle'),
    moment = require('moment');

exports.mainRouter = function (router, common) {

    // 订单页面
    router.get('/order/:module/:id', common.isLogin, function (req, res, next) {
        var module = req.params.module,
            handObj = { rateCode: req.params.id };

        if (module === 'traffic') {
            handObj.begin = req.query.begin;
        } else if (module === 'hotel') {
            handObj.beginDate = req.query.beginDate;
            handObj.endDate = req.query.endDate;
        } else if (module === 'combo' || module === 'shop' || module === 'car' || module === 'guide') {
            handObj.goodsCode = req.params.id;
            handObj.rateCode = req.query.rateCode;
        }
        if (module === 'ticket'  || module === 'combo') {
            handObj.parkId = req.query.parkId || '';
            handObj.date = req.query.date || '';
        }

        // handObj.corpCode = "cgb2cfxs";
        handObj.corpCode = common.envConfig.corpCode
        handObj.wayType ="2";
        async.waterfall(
            [function (cb) {
                var _u = common.gul([module, 'order', 'main']);
                common.request({
                    method:"get",
                    url:_u,
                    qs:handObj,//参数
                    headers: {
                        'access-token': req.session.token || "",
                    },
                    'content-type': 'text/html;charset=utf-8',
                }).then(response=>{
                    let {err, resp, body} = response
                    if (!err && resp.statusCode === 200) {
                        var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                        if (res1.status != 200) {
                            handleError(res1, req, res);
                        } else {
                            cb(null, res1);
                            //修改订单页面的预订须知
                            // 如果门票有预订须知就显示门票的，没有就显示景区的
                            if (res1.data.orderNotice){
                                req.session.orderNoticeByTicket = res1.data.orderNotice;
                            }
                            if (res1.data.ticketOrderNotice){
                                req.session.orderNoticeByTicket = res1.data.ticketOrderNotice;
                            }

                        }
                    } else {
                        handleError(resp, req, res);
                    }
                })
                // needle.request("get", _u, handObj, _o, function (err, resp, body) {
                //     console.log( _u);
                //     console.log( handObj);
                //     console.log( _o);
                //     if (!err && resp.statusCode === 200) {
                //         var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                //         if (res1.status != 200) {
                //             handleError(res1, req, res);
                //         } else {
                //             cb(null, res1);
                //             console.log('==============================res1=====================================');
                //             console.log(res1.data);
                //
                //             //修改订单页面的预订须知
                //             if (typeof res1.data.orderNotice !== 'undefined')
                //                 req.session.orderNoticeByTicket = res1.data.orderNotice;
                //         }
                //     } else {
                //         handleError(resp, req, res);
                //     }
                // });
            }, function (result, cb) {

                var _u = module === 'shop'
                    ? common.gul(['shop', 'order', 'getStock'])
                    : common.gul(['main', 'ratecode', 'stockprices'])

                    , _u1 = common.gul(['main', 'ratecode', 'ruleBuy']);

                var nowDate = moment().format('YYYY-MM-DD');
                var endDate = moment().add(3, 'months').format('YYYY-MM-DD');
                var params = module === 'shop'
                    ? { modelCode: result.data.modelCode, corpCode: common.envConfig.corpCode,wayType:"2"  }
                    : { rateCode: result.data.rateCode, corpCode: common.envConfig.corpCode,wayType:"2" , beginDate:nowDate, endDate:endDate};
                var funArry = [function (callBack) {
                    common.request({
                        method:"get",
                        url:_u,
                        qs:params,//参数
                        headers: {
                            'access-token': req.session.token || "",
                        },
                        'content-type': 'text/html;charset=utf-8',
                    }).then(response=>{
                        let {err, resp, body} = response
                        if (!err && resp.statusCode === 200) {
                            var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                            if (res2.status != 200) {
                                res.redirect('/error');
                            } else {
                                callBack(null, res2);
                            }
                        } else {
                            res.redirect('/error');
                        }
                    })
                    // needle.request("get", _u, params, _o, function (err, resp, body) {
                    //     console.log(  JSON.stringify(params));
                    //     console.log(_u);
                    //     if (!err && resp.statusCode === 200) {
                    //         var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                    //         console.log('++++++++++++++++++++++++++++++++++日历库存+++++++++++++++++++++++++++++++++++++');
                    //         console.log( JSON.stringify(res2));
                    //
                    //         if (res2.status != 200) {
                    //             res.redirect('/error');
                    //         } else {
                    //             callBack(null, res2);
                    //         }
                    //     } else {
                    //         res.redirect('/error');
                    //     }
                    // });
                }];
                if (result.data.ruleBuyCode) {
                    funArry.push(function (callBack) {
                        common.request({
                            method:"get",
                            url:_u1,
                            qs:{ ruleBuyCode: result.data.ruleBuyCode, corpCode: common.envConfig.corpCode,wayType:"2" },//参数
                            headers: {
                                'access-token': req.session.token || "",
                            },
                            'content-type': 'text/html;charset=utf-8',
                        }).then(response=>{
                            let {err, resp, body} = response
                            if (!err && resp.statusCode === 200) {
                                var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                                if (res2.status != 200) {
                                    res.redirect('/error');
                                } else {
                                    callBack(null, res2);
                                }
                            } else {
                                res.redirect('/error');
                            }
                        })
                        // needle.request("get", _u1, { ruleBuyCode: result.data.ruleBuyCode, corpCode: "cgb2cfxs",wayType:"2" }, _o, function (err, resp, body) {
                        //     if (!err && resp.statusCode === 200) {
                        //         var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                        //         console.log('++++++++++++++++++++++++++++++++++购买规则+++++++++++++++++++++++++++++++++++++');
                        //         console.log(res2);
                        //         if (res2.status != 200) {
                        //             res.redirect('/error');
                        //         } else {
                        //             callBack(null, res2);
                        //         }
                        //     } else {
                        //         res.redirect('/error');
                        //     }
                        // });
                    });
                }

                if (module === 'shop') {
                    var _u2 = common.gul(['shop', 'order', 'listPoint']);
                    funArry.push(function (callBack) {
                        common.request({
                            method:"get",
                            url:_u2,
                            qs:{ modelCode: result.data.modelCode, corpCode: common.envConfig.corpCode ,wayType:"2" },//参数
                            headers: {
                                'access-token': req.session.token || "",
                            },
                            'content-type': 'text/html;charset=utf-8',
                        }).then(response=>{
                            let {err, resp, body} = response
                            if (!err && resp.statusCode === 200) {
                                var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                                if (res2.status !== 200 && res2.status !== 402) {
                                    res.redirect('/error');
                                } else {
                                    callBack(null, res2);
                                }
                            } else {
                                res.redirect('/error');
                            }
                        })
                        // needle.request("get", _u2, { modelCode: result.data.modelCode, corpCode: "cgb2cfxs" ,wayType:"2" }, _o, function (err, resp, body) {
                        //     if (!err && resp.statusCode === 200) {
                        //         var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                        //         console.log('++++++++++++++++++++++++++++++++++获取自提点+++++++++++++++++++++++++++++++++++++');
                        //         console.log(res2);
                        //         if (res2.status !== 200 && res2.status !== 402) {
                        //             res.redirect('/error');
                        //         } else {
                        //             callBack(null, res2);
                        //         }
                        //     } else {
                        //         res.redirect('/error');
                        //     }
                        // });
                    });
                }

                async.parallel(funArry, function (err, results) {
                    results.splice(0, 0, result);
                    cb(null, results);
                });
            }], function (err, results) {
                var reObj = {}, userInfo = null;
                reObj.module = module;
                // 用户新增联系人或者用户会员信息
                userInfo = req.session.linkManInfo || req.session.member;
                reObj.det_url=req.session.preUrl;
                //优惠券登录成功时返回的地址
                reObj.cbUrl=req.originalUrl;
                if (module === 'hotel') {
                    reObj.beginDate = req.session.beginDate;
                    reObj.endDate = req.session.endDate;
                    reObj.numDays = req.session.numDays;
                    reObj.productCode = req.query.productCode;
                } else if (module === 'traffic') {
                    reObj.begin = req.query.begin;
                } else if (module === 'ticket' || module === 'route' || module === 'combo') {
                    reObj.parkId = req.query.parkId;
                    reObj.date = req.query.date;
                    reObj.classifyId = req.query.classifyId;
                    reObj.productCode = req.query.productCode;
                }else if(module === 'repast' ){
                    reObj.productCode = req.query.productCode;
                }
                res.render("order", { title: common.pageTitle(module) + '三亚蜈支洲岛旅游区', data: results, reObj: reObj, userInfo: userInfo,leaguerId : JSON.stringify(req.session.member.leaguerId) });
            });
    });

    // 门票提交订单
    router.get('/order/ticket', common.isLogin, function (req, res, next) {
        // common.commonRequest({
        //     url:[{
        //         urlArr:['member','linkMan','list']
        //     }],
        //     title:'提交订单',
        //     page: 'order/ticket',
        //     req: req,
        //     res: res,
        //     callBack: function (results, reObj, res, handTag) {
        //         reObj.is_weixn = common.is_weixn(req);
        //     }
        // })
        let is_weixn = common.is_weixn(req);
        res.render('order/ticket',{title:'提交订单',is_weixn})
    });

    // 省市区获取
    router.get('/order/getAdress', common.isLogin, function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['shop', 'order', 'address'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    //获取邮费信息
    router.get('/order/getPostage', common.isLogin, function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['shop', 'order', 'getPostage'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true
        });
    });

    // 购物车表单提交
    router.post('/order/saveCartOrder',common.isLogin, function (req, res, next) {
        let {channelId='',promoterId='',teamBatchNo='',promoteSrcCode=''} = JSON.parse(req.cookies.promoter || '{}')
        let parameter = req.body
        parameter.leaguerId = req.session.member.id
        // parameter.cartOrderDtos = JSON.parse(parameter.cartOrderDtos)

        // parameter.teamBatchNo= teamBatchNo;
        // 全渠道订单来源标识
        parameter.promoteSrcCode= promoteSrcCode;
        // 全渠道订单来源
        parameter.channelId= channelId;
        parameter.accountType = 4;
       common.commonRequest({
            url: [{
                urlArr: ['order', 'saveCartOrder'],
                parameter: parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                req.session.orderinfo = results[0].data;
            }
        });
    });

    // 其它优惠项目推荐
    router.post('/order/getRecomentList', function (req, res, next) {
        let {rateCodes,orderSum,pageSize,currPage} = req.body
        // orderSum = 200
        common.commonRequest({
            url: [{
                urlArr: ['ticket', 'order', 'matchGoods'],
                parameter: {
                    rateCodes,
                    orderSum,
                    pageSize,
                    currPage
                },
                method:'GET'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {
                if(results[0].status == 200){
                    handTag.tag = false
                    let renderObj = {
                        method:"ajax",
                        data:results[0].data.rows,
                        // ticketType:results[0].classifyKindsVos
                    }
                    let html = common.jade('order/mixin/recomentList', renderObj);
                    res.send([{status:200,html,pages:results[0].data.pages}])
                }
            }
        });
    });

    // 表单提交
    router.post('/order/:module', function (req, res, next) {
        let {channelId='',promoterId='',teamBatchNo='',promoteSrcCode=''} = JSON.parse(req.cookies.promoter || '{}')
        var module = req.params.module,
            parameter = req.query,
            urlArr = module === 'addCart' ? ['cart', 'list', 'add'] : ['order', 'saveOrder'];
        //全员营销
        // var promoteCode = req.query.promoteCode;
        // parameter.promoteCode = promoteCode;
        for (var key in parameter) {
            if (Array.isArray(parameter[key])) {
                parameter[key] = parameter[key].join(',');
            }
        }

        if (req.query.paramExtension && req.query.paramExtension == 0) {
            var d2 = req.query.address2.split(',')[0] || '',
                d3 = req.query.address3.split(',')[0] || '';

            req.query.paramExtension = 0 + ',' + d2 + ',' + d3 + ',' + req.query.street;
            delete req.query.address;
            delete req.query.address1;
            delete req.query.address2;
            delete req.query.address3;
            delete req.query.street;
        } else if (req.query.paramExtension && req.query.paramExtension == 1) {
            req.query.paramExtension = 1 + ',' + req.query.address;
            delete req.query.address;
            delete req.query.address1;
            delete req.query.address2;
            delete req.query.address3;
            delete req.query.street;
        }
        if (req.session.member) {
            parameter.leaguerId = req.session.member.id;
        }
        if (module === 'ticket' || module === 'combo') {
            parameter.paramExtension = req.query.parkId || '';
            delete req.query.parkId;
        }
        // parameter.teamBatchNo = teamBatchNo
        parameter.promoteSrcCode = promoteSrcCode;
        //线上channelId
        parameter.channelId= channelId;
        var busiTypeName;
        // busiType Name
        switch(module){
            case 'ticket':  // 门票
                busiTypeName = 'park';
                break;
            case 'hotel':   // 酒店
                busiTypeName = 'hotel';
                break;
            case 'combo':   // 套票
                busiTypeName = 'combo';
                break;
            case 'company':     // 租车公司
                busiTypeName = 'company';
                break;
            case 'repast':  // 餐馆
                busiTypeName = 'eatery';
                break;
            case 'shop':    // 商户
                busiTypeName = 'shop';
                break;
            case 'route':   // 跟团游
                busiTypeName = 'route';
                break;
            case 'car':     // 包车
                busiTypeName = 'company';
                break;
            case 'guide':     // 导游
                busiTypeName = 'guide';
                break;
            case 'zyx':     // 自由行
                busiTypeName = 'zyx';
                break;
            default:
                busiTypeName = ''
        }

        parameter.busiType = busiTypeName;
        parameter.accountType = 4;
        common.commonRequest({
            url: [{
                urlArr: urlArr,
                parameter: parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reqs, resp, handTag) {

                req.session.orderinfo = results[0].data;
                // var loginId = req.session.member ? req.session.member.id : (req.session.loginId || results[0].datas.id);

                // handTag.tag = 0;
                // req.session.loginId = loginId;
                // res.send(results);
            }
        });
        // async.waterfall([function (cb){
        //     common.commonRequest({
        //         url: [{
        //             urlArr: ['main','login','creat'],
        //             parameter: {mobile: req.query.mobile}
        //         }],
        //         req: req,
        //         res: res,
        //         isAjax: true,
        //         callBack: function (results,reqs,resp,handTag){
        //             var loginId = req.session.member ? req.session.member.id : (req.session.loginId || results[0].datas.id);

        //             handTag.tag = 0;
        //             req.session.loginId = loginId;
        //             cb(null,loginId);
        //         }
        //     });
        // },function (result,cb){
        //     parameter.loginId = result;
        //     common.commonRequest({
        //         url: [{
        //             urlArr: urlArr,
        //             parameter: parameter
        //         }],
        //         req: req,
        //         res: res,
        //         isAjax: true,
        //         callBack: function (results,reqs,resp,handTag){
        //             handTag.tag = 0;
        //             cb(null,results);
        //         }
        //     });
        // }],function (err,results){
        //     res.send(results);
        // });

    });

    // 订单详细页
    router.get('/orderDetail/:page', common.isLogin, function (req, res, next) {
        var page = req.params.page;
        let title = '预定须知'
        res.render('order/' + page, { data: page === 'orderNotice' ? req.session.orderNoticeByTicket : req.session[page], title });
    });
};

function handleError(data, req, res) {
    switch (data.status) {
        case 400:
            req.session.curUrl = req.originalUrl;
            res.redirect('/login');
            break;
        case 402:
            console.log("接口 402！");
            req.flash('message', data.message);
            res.redirect('/error');
            break;
        case 404:
            console.log("接口 404！");
            res.redirect('/error');
            break;
        default:
            res.redirect('/error');
            break;
    }
}
