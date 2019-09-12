module.exports = {
    redis: {
        host: "192.168.200.50",
        //host: "sendinfo.redis.com",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    // domain: "http://b2b.wuzhizhou.com",//正式环境api
    // ticketPark:"park2018092911074546610",
    // domain: "https://wzz.sendinfo.com.cn",// 测试
    domain: "http://wzz.sendinfo.com.cn",// 测试
    ticketPark:"park2018091313465343855", //测试
    wx:{
        appId : 'wx37b45b55a30c1726',//测试环境
        appSecret : 'e7560178d2dcfc37e0c9d14eb8ae9a49',//测试环境
        WXPAYTYPE : 32, //32:微信公众号支付 34:智游宝微信公众号支付
        userType : 'C'
    },
    corpCode:'scb2cfxs',
    protocol:'http',
};
