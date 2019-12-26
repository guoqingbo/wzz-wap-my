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
    // domain: "http://b2b.wuzhizhou.com",//正式环境api
    // ticketPark:"park2018092911074546610",//正式
    // domain1:"http://coach.wuzhizhou.com", //预约正式
    // domain:'http://192.168.66.110:8080',
    // domain:'http://192.168.201.129:8080',// 测试tesb
    domain: "http://wzz.sendinfo.com.cn",// 测试
    ticketPark:"park2018091313465343855", //测试
    domain1:"http://192.168.200.72:8080", //预约测试
    domain2:"http://acd.sendinfo.com.cn", // 全渠道测试
    wx:{
        appId : 'wx4855f46c05a8d2b8',//我的测试环境
        appSecret : 'bc3e19c589440fe94a2aed85031806ad',//我的测试环境
        // appId : 'wx37b45b55a30c1726',//测试环境
        // appSecret : 'e7560178d2dcfc37e0c9d14eb8ae9a49',//测试环境
        // WXPAYTYPE : 32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    alipay:{
        // appId : '2016080700188711',//测试环境
        appId : '2017110609768371',//测试环境
        // url:'https://openapi.alipaydev.com/gateway.do',
        // openAuth:'https://openauth.alipaydev.com/oauth2/appToAppAuth.htm',
        openAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
        url:'https://openapi.alipay.com/gateway.do',
    },
    // weixinProxy:'https://wzzfxswap1.sendinfo.com.cn',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'http'
};
