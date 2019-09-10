exports.mainRouter = function (router, common) {
    // 问卷页面
    router.get('/question/list', function (req, res, next) {
       // res.render('question/list',{title:'问卷调查'});
        common.commonRequest({
            url: [{
                urlArr: ['question', 'list'],
            }],
            req: req,
            res: res,
            page: 'question/list',
            title: '问卷调查',
            callBack: function (result, reObj) {
                if(result[0].status == 200){
                }
            }
        });

    });
    router.get('/question/detail/:id', function (req, res, next) {
        // res.render('question/detail',{title:'问卷调查'});
        common.commonRequest({
            url: [{
                urlArr: ['question', 'detail'],
                parameter: {
                    id:req.params.id
                }
            }],
            req: req,
            res: res,
            page: 'question/detail',
            title: '问卷调查',
            callBack: function (result, reObj) {
                if(result[0].status == 200){
                }
            }
        });

    });
    // 提交问卷
    router.post('/question/save', function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['question', 'save'],
                parameter:req.body,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (result, reObj) {
                  if(result[0].status == 200){

                  }
            }
        });

    });
};
