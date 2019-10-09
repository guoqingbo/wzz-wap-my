var express = require('express');
var router = express.Router();
var common = require('./common/index').common;

// 微信分享
router.use(common.wxShare)

// 获取自定义标题
router.use(common.getPageMeta)

// 全渠道扫码进入(需要登录)
router.use(function (req, res, next) {
    if(/(^\/login)|(^\/horization)|(^\/weixinProxy)/.test(req.originalUrl)){
         next()
    }
    else if(req.method=="GET"){
        if(req.query.promoterId && req.session.promoterId!==req.query.promoterId){
            let {channelId='',promoterId='',teamBatchNo='',promoteSrcCode=''} = req.query;
            let promoter = '?channelId='+channelId+'&promoterId='+promoterId+'&teamBatchNo='+teamBatchNo+'&promoteSrcCode='+promoteSrcCode
            // req.session.promoterId = req.query.promoterId
            req.session.curUrl = req.originalUrl
            return res.redirect('/login'+promoter)
        }else{
            next()
        }
    }else{
        next()
    }
})

// main
require('./main').mainRouter(router,common);
// member
require('./member').mainRouter(router,common);
// list
require('./list').mainRouter(router,common);
// detail
require('./detail').mainRouter(router,common);
// order
require('./order').mainRouter(router,common);
// cart
require('./cart').mainRouter(router,common);
// pay
require('./pay').mainRouter(router,common);
//coupons
require('./coupons').mainRouter(router,common);
//myTrip
require('./myTrip').mainRouter(router,common);
//预约
require('./appoint').mainRouter(router,common);
//问卷调查
require('./question').mainRouter(router,common);
// 投诉建议
require('./complaint').mainRouter(router,common);
// 上传
require('./upload').mainRouter(router,common);
// 排队叫号
require('./queueCallNum').mainRouter(router,common);
// 微信授权代理
require('./weixinProxy').mainRouter(router,common);
// 组件模板
require('./demo').mainRouter(router,common);
module.exports = router;
