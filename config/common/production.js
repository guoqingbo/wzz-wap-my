module.exports = {
    redis: {
        host: "sendinfo.redis.com",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    debug:true,
    idCard:{
        grant_type:'client_credentials',
        client_id: 'QmovrRYcGfmU9Ngq1Sg5QFxt',
        client_secret: 'LeWZ9YEjvXGaPD8fEZyLEAT6aXA9p6tB'
    },
    domain: "http://b2b.wuzhizhou.com",//正式环境api
    domain1:"http://coach.wuzhizhou.com", //预约正式
    // domain:'https://wzz.sendinfo.com.cn',
    ticketPark:"park2018092911074546610",//正式
    wx:{
        appId : 'wx16130af4fd102a02',//正式环境
        appSecret : 'a9559a5099714abeeb5f22084aec12a8',//正式环境
        // WXPAYTYPE :32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    alipay:{
        appId : '2019111869287081',//测试环境
    },
    // weixinProxy:'https://wap.wuzhizhou.com',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'https'
}
