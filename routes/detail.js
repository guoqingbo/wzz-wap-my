let moment = require('moment');
let utils = {
    getTicketTitle(classifyId){
        let title = ''
        switch (classifyId) {
            case "0":
                title='门票船预订_三亚蜈支洲岛旅游区';
                break;
            case "1":
                title='潜水类预订_三亚蜈支洲岛旅游区';
                break;
            case "2":
                title='海上娱乐预订_三亚蜈支洲岛旅游区';
                break;
            case "3":
                title='套票预订_三亚蜈支洲岛旅游区';
                break;
            case "4":
                title='陆地玩乐预订_三亚蜈支洲岛旅游区';
                break;
            default:
                title='票务预订_三亚蜈支洲岛旅游区';
                break;
        }
        return {title}
    },
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
    getDayList(req){
        let dayList = []
        let date = new Date();
        // 如果是门店终端，开始日期从第二天开始
        let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode
        if(projectNameCode == 'storeTerminal'){
            date.setTime(date.getTime()+1000*60*60*24)
        }

        for(let i=0;i<4;i++){
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

    // 门票详情页(带购物车)
    router.get('/detail/ticket/:productCode', function (req, res, next) {
        req.session.preUrl = req.originalUrl;
        let module = 'ticket'
        let productCode = req.params.productCode
        let date = req.query.date
        if(!date){
            // 如果是门店终端，开始日期从第二天开始
            let projectNameCode =  process.env.projectNameCode || req.session.projectNameCode
            if(projectNameCode == 'storeTerminal'){
                date = moment().add(1, 'days').format("YYYY-MM-DD")
            }else{
                date = moment().format("YYYY-MM-DD")
            }
        }
        let searchName = req.query.searchName||''
            classifyId = req.query.classifyId ||'',
            handArr = [{
                urlArr: [module, 'detail', 'main'],
                parameter: {goodsCode: productCode}
            },{
                urlArr: ['main', 'comment', 'parkCommentInfo'],
                parameter: {
                    businessType:'park',
                }
            },{
                urlArr:["ticket", "detail","classifyParkTicket"],
                parameter:{
                    goodsCode:common.envConfig.ticketPark,
                    date,
                    name:searchName,
                    // classifyId,
                    flag:'T',
                }
            }];
        common.commonRequest({
            url: handArr,
            req: req,
            res: res,
            page: 'detail/ticket',
            title:common.pageTitle(module) + '详情',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status == 200){
                    reObj.module = module;
                    reObj.productCode = productCode;
                    reObj.searchName = req.query.searchName
                    if(module==='ticket'){
                        let pageMeta = common.setPageMeta("ticketOrderMeta",req)
                        Object.assign(reObj, pageMeta);
                        let {title} = utils.getTicketTitle(req.query.classifyId)
                        reObj.title = title
                        reObj.dayList = utils.getDayList(req);

                        req.session.content = results[0].data.content;
                        req.session.orderNotice = results[0].data.orderNotice;

                        reObj.classifyId = classifyId;
                        // reObj.date = date;
                    }

                }
            }
        });
    });
    // 获取票型列表
    router.post('/detail/getTicketList', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr:["ticket", "detail","classifyParkTicket"],
                parameter:{
                    goodsCode:common.envConfig.ticketPark,
                    date:req.body.date,
                    name:req.body.name,
                    classifyId:'',
                    flag:'T',
                },
                method:'get'
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status == 200){
                    handTag.tag = false
                    let renderObj = {
                        method:"ajax",
                        data:results[0].data,
                        // ticketType:results[0].classifyKindsVos
                    }
                    let html = common.jade('detail/mixin/ticketTypeList', renderObj);
                    res.send([{status:200,html}])
                }

            }
        });
    });
    // 详情页
    router.get('/detail/:module/:productCode', function (req, res, next) {
        req.session.preUrl = req.originalUrl;
        var module = req.params.module,
            productCode = req.params.productCode,
            rateCode = req.query.rateCode ? req.query.rateCode : '',
            // findDate=req.query.date,
            handArr = [{
                urlArr: ['main', 'detailimgs'],
                parameter: {modelCode: productCode}
            }, {
                urlArr: [module, 'detail', 'main'],
                parameter: {goodsCode: productCode}
            },
            ];
        if (module === "ticket"){
            // 查询评论数和评分，临时性改法
            handArr.push({
                urlArr: ['main', 'comment', 'parkCommentInfo'],
                parameter: {
                    businessType:'park',
                }
            })
        }else{
            handArr.push({
                urlArr: ['main', 'comment', 'info'],
                parameter: {
                    modelCode: productCode
                }
            })
        }
        if (module === 'combo' || module === 'shop' || module === 'car' || module === 'guide') {
            handArr[1].parameter.rateCode = req.query.rateCode
        }
        if (module === "ticket" || module === "repast" || module === "route") {
            var nowDate = req.query.date || moment().format('YYYY-MM-DD');
            handArr.push({
                urlArr: [module, 'detail', 'productItems'],
                parameter: {
                    goodsCode: productCode,
                    // corpCode: 'cgb2cfxs',
                    date: nowDate,
                    classifyId: req.query.classifyId ||'',
                    name:req.query.searchName||''
                }
            });
        }
        if (module === 'strategy'||module === 'newsTop') {
            handArr = [{
                urlArr: [module, 'detail', 'main'],
                parameter: {
                    modelCode: productCode
                }
            }
            ];
        }

        if (module === 'qr') {
            req.session.backDetailUrl = req.originalUrl;
            handArr = [{
                urlArr: ['qr', 'detail', 'main'],
                parameter: {
                    currPage: 1,
                    pageSize: 100,
                    modelCode: productCode
                }
            }
            ];
        }

        common.commonRequest({
            url: handArr,
            req: req,
            res: res,
            page: 'detail',
            title:module==="qr"? "蜈支洲旅游":common.pageTitle(module) + '详情',
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status == 200){
                    reObj.module = module;
                    reObj.productCode = productCode;
                    reObj.rateCode = rateCode;
                    reObj.searchName = req.query.searchName
                    // reObj.findData =findDate;
                    if(module==="newsTop"){
                        reObj.title=results[0].data.name+ '_公告_三亚蜈支洲岛旅游区'
                    }else if(module==='strategy'){
                        reObj.title=results[0].data.name+ '_三亚蜈支洲岛旅游区'
                    }else if(module==='hotel') {
                        reObj.title=results[1].data.aliasName + '_三亚蜈支洲岛旅游区';
                        let pageMeta = common.setPageMeta("hotelDetailMeta",req)
                        Object.assign(reObj, pageMeta);
                    }else{
                        if(module==='ticket'){
                            let pageMeta = common.setPageMeta("ticketOrderMeta",req)
                            Object.assign(reObj, pageMeta);
                            let {title} = utils.getTicketTitle(req.query.classifyId)
                            reObj.title = title
                            // switch (req.query.classifyId) {
                            //     case "0":
                            //         reObj.title='门票船预订_三亚蜈支洲岛旅游区';
                            //         break;
                            //     case "1":
                            //         reObj.title='潜水类预订_三亚蜈支洲岛旅游区';
                            //         break;
                            //     case "2":
                            //         reObj.title='海上娱乐预订_三亚蜈支洲岛旅游区';
                            //         break;
                            //     case "3":
                            //         reObj.title='套票预订_三亚蜈支洲岛旅游区';
                            //         break;
                            //     case "4":
                            //         reObj.title='陆地玩乐预订_三亚蜈支洲岛旅游区';
                            //         break;
                            //     default:
                            //         reObj.title='票务预订_三亚蜈支洲岛旅游区';
                            //         break;
                            // }
                        }else{
                            reObj.title=results[1].data.aliasName + '_三亚蜈支洲岛旅游区';
                        }
                    }
                    if (module !== 'guide' && module !== 'strategy' && module !== 'qr'&& module !== 'newsTop') {
                        req.session.location = {
                            location: results[1].data?results[1].data.latitudeLongitude:"",
                            address: results[1].data?results[1].data.addr:""
                        };

                        req.session.content = results[1].data.content;
                        req.session.orderNotice = results[1].data.orderNotice;

                        if (module === 'hotel') {
                            reObj.beginDate = req.session.beginDate;
                            reObj.endDate = req.session.endDate;
                        }

                        // if (module !== 'hotel' && module !== "combo" && module !== "shop" && module !== "car" && module !== "guide") {
                        //     req.session.productItems = results[2].data.productItems;
                        // }
                    }
                    if (module === 'qr') {
                        if (results[0].data.rows.length > 0)
                            req.session.orderNotice = results[0].data.rows[0].ydxz;
                    }
                    if (module === 'ticket') {
                        reObj.classifyId = req.query.classifyId;
                        reObj.date = nowDate;
                    }
                }
            }
        });
    });

    //房型列表
    router.get('/detail/roomItems', function (req, res, next) {
        req.session.beginDate = req.query.beginDate;
        req.session.endDate = req.query.endDate;
        req.session.numDays = req.query.numDays;
        delete req.query.numDays;
        //req.query.corpCode="cgb2cfxs";
        common.commonRequest({
            url: [{
                urlArr: ['hotel', 'detail', 'productItems'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status == 200){
                    let {beginDate,endDate,goodsCode} = req.query
                    req.session.productItems = results[0].datas;
                    handTag.tag = false
                    let renderObj = {
                        method:"ajax",
                        data:results[0].data,
                        beginDate,
                        endDate,
                        productCode:goodsCode
                    }
                    let html = common.jade('detail/mixin/roomList', renderObj);
                    res.send([{status:200,html}])
                }

            }
        });
    });

    //房型图片
    router.get('/detail/picture', function (req, res, next) {

        common.commonRequest({
            url: [{
                urlArr: ['main', 'detailimgs'],
                parameter: req.query
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results, reObj) {
                // req.session.productItems = results[0].datas;
            }
        });
    });

    // 跳转到搜索页面
    router.get('/detail/search', function (req, res, next) {

        // let {title} = utils.getTicketTitle(req.query.classifyId)
        let title =  '票务预订_搜索_三亚蜈支洲岛旅游区'
        // res.render('detail/search',{title,productcode:common.envConfig.ticketPark})
        common.commonRequest({
            url: [{
                urlArr: ['ticket', 'detail','getHotSearch'],
            }],
            req: req,
            res: res,
            page:'detail/search',
            title,
            callBack: function (results, reObj) {
                if(results[0].status == 200){
                    reObj.productcode=common.envConfig.ticketPark
                }
            }
        });
    });

    // 详情详细页
    router.get('/detail/:page', function (req, res, next) {
        let page = req.params.page;
        let title = ''
        let pageMeta = common.setPageMeta("viewIntroMeta",req)
        res.render('detail/' + page, {
            title,
            data: page === 'productItems' ? req.session.content : req.session[page],
            ...pageMeta,
        });
    });

    //视频介绍
    router.get('/audioDetail', function (req, res, next) {
        var voice = req.query.voice;
        res.render('audioDetail', {voice:voice, title: '视频介绍'});
    });

    // 门票点击票型标题的详情页
    router.get('/product/:module/:rateCode', function (req, res, next) {
        var module = req.params.module,
            rateCode = req.params.rateCode,
            productCode = common.envConfig.ticketPark,
            parkId = req.query.parkId||1,
            nowDate = req.query.date || moment().format('YYYY-MM-DD'),
            handArr = [{
                urlArr: [module, 'order', 'main'],
                parameter: {
                    rateCode: rateCode,
                    parkId:parkId
                }
            }];



        common.commonRequest({
            url: handArr,
            req: req,
            res: res,
            page: 'product/detail',
            title: common.pageTitle(module) + '详情',
            callBack: function (results, reObj) {
                reObj.module = module;
                reObj.productCode = productCode;
                reObj.title=results[0].data.aliasName + '_三亚蜈支洲岛旅游区';
                if (module === 'ticket') {
                    reObj.classifyId = req.query.classifyId;
                    reObj.date = nowDate;
                }
            }
        });
        //res.render("product/detail",{title:"详情页"})
    });

};
