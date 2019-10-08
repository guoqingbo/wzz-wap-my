exports.mainRouter = function (router, common) {
    // 投诉建议
    router.get('/complaint/:module',common.isLogin, function (req, res, next) {
        var module = req.params.module,
            title = "投诉建议";
        res.render('complaint/'+module, {
            module: module,
            title:title,
        });
    });

    router.post('/complaint/:module', function (req, res, next) {
        let module = req.params.module,
            method = 'post',
            urlArrm;
        switch (module) {
            case 'suggest':
                urlArrm = ['complaint', 'suggest'];
                break;
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
            callBack:function(results, reObj, res, handTag){
                if(results[0].status == 200){

                }
            }
        });
    });
};
