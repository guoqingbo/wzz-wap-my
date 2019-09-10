module.exports = {
    redis: {
        host: "sendinfo.redis.com",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    domain: "http://b2b.wuzhizhou.com",//电商正式环境api
    ticketPark:"park2018092911074546610",
    domain1:"http://coach.wuzhizhou.com", //预约
    wx:{
        appId : 'wx16130af4fd102a02',//正式环境
        appSecret : 'a9559a5099714abeeb5f22084aec12a8',//正式环境
        // WXPAYTYPE :32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    debug:true,
    corpCode:'cgb2cfxs',
}
