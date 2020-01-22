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
    domain2:"http://oc.wuzhizhou.com", // 全渠道正式
    // domain:'https://wzz.sendinfo.com.cn',
    ticketPark:"park2018092911074546610",//正式
    wx:{
        appId : 'wx16130af4fd102a02',//正式环境
        appSecret : 'a9559a5099714abeeb5f22084aec12a8',//正式环境
        // WXPAYTYPE :32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    alipay:{
        appId : '2015121600988747',
        openAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
        url:'https://openapi.alipay.com/gateway.do',
        private:'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALM51lg08myVa2Jm0Zr/bKDFi+vWpzZWC53/GmnTTwzLh07Gfe1quXQbX+iRctdNAwq3H/13R2SwmBMvjLKYzzgw8ELiVwi/A3rbJhXB8sFzCIkdfkx7KM6jtmTa9R8K4qvbdmVe+LPQ8AAWc0dUNC376vm6D0HNhJmJa7/+3soTAgMBAAECgYEAqikJdmmemLUsZRqVewFzExk7hUghLZd4JCOl4j97V/yMlKAjwxuGw9ORtW8Sh5NYhf3jY3Sx1clMOTr17ELkyS9vH0dqIxOpyOSGaWvrJLr1OVDHWFwDkwRc1iSrWB2vzv/FErXyRS15ZkPOHTK65Ux79JuI9MFbBKjOsbNBiQECQQDh1KS5d1ZUowgXkvnx7cFdqYBjaEYme4Zq+z4RlmOooLHswk+a0ewq9gDUDZ3BPfEs7WF5TeO7kt61HCWd7gzTAkEAyytSwj/FpYdTfncqHum8fktXiD4gUb9uH2/blEf+PKlbjNDTVzvS8oAKxkJGeTsLg3i5GGuoO7J1xHUEMt0FwQJAL80C0P8hluirXdIOddcNhvXJ50C7GIos+ZgUm0Rp89eP0b2PfAXTJ4TKyBfZvH2P/yJ/7109RwbffRZoH/WzYQJARvXov+PaOohbhy5DzexBY7MY7YMVcrfz1JMTFGVYzQMx8Kr3Rd6lPQGvwbNgPfN7f/3oWDkx1zfrniRoxQMhgQJADkunWbH5u8mJpm7YzRGy3SkWFBKhP0CJcDHjiIBdwQjCN71xY7Tri0VZdl9GBiwerDO6YpQcjFhhHNgb7v2Lyw=='
    },
    // weixinProxy:'https://wap.wuzhizhou.com',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'https'
}
