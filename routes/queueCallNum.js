const jade = require("jade");
let utils = {
    getCol(req,projectLength){
        // 获取游玩人数列数
        // 数组col中的数据表示每一个项目中人数的列数
        let col = []
        let defaltCol = [[5],[3,3],[2,2,2],[1,1,1,1],[1,1,1,1,1]]
        if(req.session.col){
            col = req.session.col.split(",")
            // col的设置和项目长度不一致时
            if(col.length!=projectLength){
                col = defaltCol[projectLength-1]
            }
        }else {
            // 如果没有col则取默认配置
            col = defaltCol[projectLength-1]
            // switch (projectLength) {
            //     case 1:
            //         col = [5] // 1个项目 每个项目5列
            //         break
            //     case 2:
            //         col = [3,3] // 2个项目 每个项目3列
            //         break
            //     case 3:
            //         col = [2,2,2]// 3个项目 每个项目2列
            //         break
            //     case 4:
            //         col = [1,1,1,1]// 4个项目 每个项目1列
            //         break
            //     case 5:
            //         col = [1,1,1,1,1]// 5个项目 每个项目1列
            //         break
            // }
        }
        return col
    },
    getProjectWidth(col){
        let projectWidth = []
        let totalCol =  eval(col.join("+"))
        col.forEach(ele=>{
            projectWidth.push(ele/totalCol*100+"%")
        })
        return projectWidth
    }
}
exports.mainRouter = function (router, common) {
    // 项目预约(大屏滚动)
    router.get('/queueCallNum/list', function (req, res, next) {
        req.session.col = req.query.col ||''

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
        res.render('queueCallNum/list',{
            title: '排队叫号'
        })

    });

    router.post('/queueCallNum/list',function (req,res,next) {
        // let url = common.gul(['myTrip', 'lineUp', 'screenCode'],common.envConfig.domain1)
        // let params = req.body
        // common.get(url,params).then(data=>{
        //     let {err,resp,body} = data
        //     if(body && body.status===200){
        //         let projectLength = body.data.length
        //         let renderObj = {
        //             data:body.data,
        //             method:"ajax",
        //             col:utils.getCol(req,projectLength),
        //         }
        //         let html = jade.renderFile('views/queueCallNum/mixin/queueList.jade', renderObj);
        //         res.send([{status:200,html}])
        //     }
        // })
        common.commonRequest({
            url: [{
                urlArr: ['myTrip', 'lineUp', 'screenCode'],
                parameter:req.body,
                method: 'get',
                outApi:common.envConfig.domain1
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results, reObj, res, handTag) {
                if(results[0].status===200){
                    let projectLength = results[0].data.length || 1
                    // 项目人员列数
                    let col = utils.getCol(req,projectLength)
                    // 根据项目人员列数计算项目宽度
                    let projectWidth = utils.getProjectWidth(col)
                    handTag.tag = false
                    let renderObj = {
                        data:results[0].data,
                        method:"ajax",
                        col,
                        projectWidth,
                    }
                    let html = jade.renderFile('views/queueCallNum/mixin/queueList.jade', renderObj);
                    res.send([{status:200,html}])
                }
            }
        });
    });

    // 项目预约(大屏滚动)
    router.get('/queueCallNum/list1', function (req, res, next) {
        res.render('queueCallNum/list1',{
            title: '排队叫号'
        })

    });
    router.post('/queueCallNum/list1',function (req,res,next) {
        common.commonRequest({
            url: [{
                urlArr: ['appoint', 'queuesNew'],
                parameter:req.body,
                method: 'get',
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
                    let html = common.jade('queueCallNum/mixin/queueList1', renderObj);
                    res.send([{status:200,html}])
                }
            }
        });
    });
};
