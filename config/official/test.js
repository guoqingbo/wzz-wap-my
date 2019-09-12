module.exports = {
    port:'4029',
    redis: {
        host: "192.168.200.50",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    // domain: "http://b2b.wuzhizhou.com",//电商正式
    // ticketPark:"park2018092911074546610",//正式
    // domain1:"http://coach.wuzhizhou.com", //预约正式

    // domain:"http://192.168.66.239:8080",
    domain: "https://wzz.sendinfo.com.cn",// 电商测试
    ticketPark:"park2018091313465343855", //测试
    domain1:"http://192.168.200.72:8080", //预约测试


    wx:{
        appId : 'wx37b45b55a30c1726',//测试环境
        appSecret : 'e7560178d2dcfc37e0c9d14eb8ae9a49',//测试环境
        // WXPAYTYPE : 32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    debug:true,
    corpCode:'cgb2cfxs',
    protocol:'https'
};
