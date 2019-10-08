var express = require('express');
var router = express.Router();
var common = require('./common/index').common;

// 微信分享
router.use(common.wxShare)

// 获取自定义标题
router.use(common.getPageMeta)

// 全渠道扫码进入(需要登录)
// router.use(function (req, res, next) {
//     if(req.method=="GET"){
//         if(req.query.promoterId){
//             // 全渠道参数
//             req.session.channelId=req.query.channelId||"";
//             req.session.promoterId=req.query.promoterId||"";
//             req.session.teamBatchNo=req.query.teamBatchNo||"";
//             req.session.promoteSrcCode=req.query.promoteSrcCode||"";
//         }
//     }
//     next()
// })

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

module.exports = router;
