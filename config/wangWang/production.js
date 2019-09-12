module.exports = {
    port: 4016,
    redis: {
        host: "sendinfo.redis.com",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    domain: "http://b2b.wuzhizhou.com",//正式环境api
    // domain:'https://wzz.sendinfo.com.cn',
    ticketPark:"park2018092911074546610",
    wx:{
        appId : 'wxbef85c08b933e746',//正式环境
        appSecret : 'c875a9c976e4c1540273550249b9382c',//正式环境
        WXPAYTYPE :32, //32:微信公众号支付 34:智游宝微信公众号支付
        userType : 'C'
    },
    corpCode:'scb2cfxs',
    protocol:'http',
}
