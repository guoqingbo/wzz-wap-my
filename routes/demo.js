
exports.mainRouter = function(router,common){
    router.get('/demo', function(req, res) {
        res.render('demo/index')
    });
};
