exports.mainRouter = function (router, common) {
    // 列表页
    router.get('/list/:module', function (req, res, next) {
        let module = req.params.module;
        let title = common.pageTitle(module) + '_三亚蜈支洲岛旅游区';
        let businessType  =  module;
        switch (module) {
            case 'repast':
                businessType = 'eatery';
                break;
            case 'car':
                businessType = 'company';
                break;
            case 'ticket':
                businessType = 'park';
                break;
        }
        if (module === 'commentList'||module === 'strategy') {
            res.render('list', {
                module: module,
                title:common.detailSeo(module)
            });
            return;
        }
        if ( module === 'integral') {
            res.render('list', {
                title: title,
                module: module
            });
            return;
        }
        // if (module === 'order'|| module === 'refund') {
        if (module === 'order'|| module === 'refund') {
            if (!req.session.member||req.session.member.id==='') {
                res.redirect('/login');
                return;
            }
            let orderStatus = req.query.orderStatus || '';
            res.render('list', {
                title: title,
                module: module,
                orderStatus: orderStatus
            });
            return;
        }
        // if (module === 'order') {
        //     res.render('list', {
        //         module: module,
        //         title:title,
        //     });
        //     return;
        // }
        common.commonRequest({
            url: [{
                urlArr: ['main', 'search'],
                parameter: { businessType: businessType }
            }, {
                urlArr: ['main', 'sort'],
                parameter: { businessType: businessType }
            }],
            req: req,
            res: res,
            page: 'list',
            title: title,
            callBack: function (results, reObj) {
                if(module==="hotel" || module==="repast"||module==="strategy"||module==="shop"){
                    reObj.title=common.detailSeo(module) ;
                    let pageMeta = common.setPageMeta(module+"Meta",req)
                    Object.assign(reObj, pageMeta);
                }
                reObj.module = module;
                reObj.searchName = req.query.searchName || '';
            }
        });
    });

    // 下拉加载
    router.post('/list/:module', function (req, res, next) {
        let module = req.params.module,
            method = 'get',
            urlArrm;
        module= module.slice(0, module.length-1 );
        if(module==='integral'){
            method='post'
        }
        //choice url
        switch (module) {
            case 'order':
                urlArrm = ['member', 'order', 'pagelist'];
                if (req.query.orderStatue) req.session.orderStatus = req.body.orderStatus = req.query.orderStatue;
                req.body.buyerId = req.session.member.id;
                break;
            case 'refund':
                urlArrm = ['member', 'order', 'refundOrder'];
                if (req.query.orderStatue) req.session.orderStatus = req.body.orderStatus = req.query.orderStatue;
                req.body.buyerId = req.session.member.id;
                break;
            case 'commentList':
                if(req.query.type == 'park'){
                    urlArrm = ['main', 'comment', 'park'];
                }else{
                    urlArrm = ['main', 'comment', 'list'];
                }
                break;
            default:
                urlArrm = [module, 'list', 'pagelist'];
                break;
        }

        // Operating parameters
        switch (module){
            case 'combo':
                req.body.wayType = 'wap';
                break;
            case 'hotel':
                req.session.beginDate = req.body.beginDate;
                req.session.endDate = req.body.endDate;
                break;
            case 'strategy':
                req.body.modelCode = module;
                req.body.infoModelCode=module;
                // 攻略（汪汪商城，门店终端，珊瑚酒店）统一使用官网的分销渠道
                req.body.corpCode = 'cgb2cfxs'
                break;
            case 'integral':
                urlArrm = ['member', 'integral'];
                //req.body.modelCode = module;
                break;
            default:
                break;
        }

        for (key in req.query) {
            req.body[key] = req.query[key];
        }

        common.commonRequest({
            url: [{
                urlArr: urlArrm,
                parameter: req.body,
                method: method
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (results, reObj, res, handTag) {
              if(results[0].status === 200){
                  if(module == 'commentList'){
                      handTag.tag = false
                      let renderObj = {
                          module,
                          method:"ajax",
                          data:results[0].data.list.rows,
                      }
                      let html = common.jade('list/mixin/list', renderObj);
                      res.send([{status:200,html,pages:results[0].data.list.pages}])
                  }else if(module == 'strategy'){
                      handTag.tag = false
                      let renderObj = {
                          module,
                          method:"ajax",
                          data:results[0].data.rows,
                      }
                      let html = common.jade('list/mixin/list', renderObj);
                      res.send([{status:200,html,pages:results[0].data.pages}])
                  }
              }
            }
        });
    });
};
