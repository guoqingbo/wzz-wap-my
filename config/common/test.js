module.exports = {
    redis: {
        host: "192.168.200.50",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    debug:true,
    idCard:{
        grant_type:'client_credentials',
        client_id: 'tG13Z8Px6FClmzMYw2PYZd1z',
        client_secret: 'N8rzh1U47NxfxpqPCytCdvv3h3asB11r'
    },
    // domain:'http://192.168.66.110:8080',
    domain: "http://wzz.sendinfo.com.cn",// 测试
    domain1:"http://192.168.200.72:8080", //预约测试
    ticketPark:"park2018091313465343855",// 测试
    wx:{
        appId : 'wx37b45b55a30c1726',//测试环境
        appSecret : 'e7560178d2dcfc37e0c9d14eb8ae9a49',//测试环境
        // WXPAYTYPE : 32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    // weixinProxy:'https://wzzfxswap1.sendinfo.com.cn',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'https'
};
