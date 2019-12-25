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
        // openAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm'
        url:'https://openapi.alipay.com/gateway.do',
        private:'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPyNk59U+jQgpdOxfYCcqpWe8eE9BsQhlJYq7ScO9Gz71HEjGeZ15NiJRSsKiPArhJcyJHdfqpcy8QzQDDQeEXp87gGRFJxp8snBQGxW5rA+EtbckcHhPeneVxJMDle2mPuOPYmiWNZH7Ia4Uitb2oe0mC6FyLsNcwAcqHUW7lh65LSugqAts7huO2R1B/u3bvq9P4//Bljhmz0yTkH7Srvwg8IbYuXi+xvgkBM5stemzriZYksZ7RTB5EhebJL0GdPC2ZDCrus8odiX+M3SlTkW0Z5I8dLRr7B+PemVrtKKXuEk53OK5F4j6dzrmsqXvgAaoD00QKjVdDRpihwQd3AgMBAAECggEAUtNoDrL5BRptzfbUbWZ2j8d2ruTLExGgb12hRyg3LZtNdTtNyenRsOgUSO3qqzbt4aGpBXE4y5PGcO8mmVPBzlakHQNTqiP4XUIrZxsj2BGMDRdI2iGZYIukN+DsHUVSMbBXz9Y7+48AWYNWVgBLGFqspfQkG3PrAYSGnhySvTTferV3v85Is/Rc5f6Xj90H4pIuyOWDAra6/bKXw3KOHzC93fDFeN6LKkfr2iTOPp4grQ7egpnHsNHa1o/TH6jlWR7LfOdmP24TBZWgptGWkMteT/TiTq3bDKx6Sk9bSmUjv5mb1ElGPZFK9D/9+ZaY2LQ46PJm/NP/S6stwV79wQKBgQD2a7TC/B2D8zoo42oT0uWINFAZcYLxtOTbYVaDksJYK2su7qvgtTx8xxs7IWO2LVbLA7QXLA88+OJu/hRhW6UFRixxMSt0CTr9eKGO0A1Us/P3kcsP5P4bE4rO+d4q+eEOUxJajwycF6PNdFG6rfxw68LrIEaDoyc48d03SaeotQKBgQCVX74qBqIRqoKJ7fcFkaA6W3yYHVk368fNEzHkfbl3EkOz4T5CjmyWz2HTqjW3hFBWljFQof89luyP6qLuL4+Eo9mCmxGuAexVKd2JXQwsRfukG9oCscEGj0iFha0ZURKocdfJEI2J+EUAqrBaxeaVkIBgMI+Eyipqs9s9IRzm+wKBgEenoCOGzkpdQs86+dCT5dzKYXRUlqAUWuwUDOUrmsmqrnsyOdaYvOMHvrpeBjGmU3OrOwX18ORo9ucRiPmafYzgD/JGOv195aJpHol5pDa6MToPMf4IN3/GGfn/nIPgr3nL3C1rJV6KXT5UEaP4Dc0EMWTPuNF0cuZTJmF6UH91AoGAbl/CuncQRpGBx72IrBrBFJ4JYLU++a1Fg+lNEpM7+hoK4N3tDW0EHCO9G5RIAQTKAFEWu4gYfEALKQStw+Zs3Aveaz1+QN+26+71fcy9c/F6UfcqjpceFGTHp7HxCCX57XHBixaqH2rOQgHeMhTNn3KZCXqYcfyYfyPLOk4/dwUCgYEA4Hd5O/tSmpkgPpcoZDEGjxoPkf8SUyc7VV6aWcfZOSqFF+pRosEEnwQzHf6pacKZsOr6AYZ0dIoIQwuuFg6gxsEhMoNTJ+uW2+Jvr0XZHPIMAaaRWNxoY3CwLpu1q0t6CgJ4cTmsuCJp5fzFACPVQe5KM8OT9A61+ESVOdS70Fw='
    },
    // weixinProxy:'https://wzzfxswap1.sendinfo.com.cn',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'http'
};
