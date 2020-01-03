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
    // domain:'http://192.168.201.129:8080',// 测试tesb
    domain: "http://wzz.sendinfo.com.cn",// 测试
    domain1:"http://192.168.200.72:8080", //预约测试
    domain2:"http://acd.sendinfo.com.cn", // 全渠道测试
    ticketPark:"park2018091313465343855",// 测试
    wx:{
        appId : 'wx37b45b55a30c1726',//测试环境
        appSecret : 'e7560178d2dcfc37e0c9d14eb8ae9a49',//测试环境
        // WXPAYTYPE : 32, //32:微信公众号支付 34:智游宝微信公众号支付
        // userType : 'C'
    },
    alipay:{
        appId : '2021001103646267',//测试环境
        openAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
        url:'https://openapi.alipay.com/gateway.do',
        private:'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuiyiwQvkpg1+roQRVycarzNR5v+N9Q4r+Wf1X1ij+P2rD4HVdX7MET6ktbymdW5hSW4IuF4/aGBZ8K/f+tA2xUSNQEhjwiDst30sZ8H3WYZ+QLAnb7Ktxtb995vv7US0HFlY0bGqJNwZCB+U3k/IZmkSguT/726Z5A1VSUqXe5LsCxYhQQl5m7uG+m3ceopW+rFwoD1aK17Ushg3wGsF6e73K4z6opA7OvDU8Xy1YkPKNT1uLvg9djKzUUrT3kKn9m1ei83cdhmhGgAzdx8lOeKv7GUlsiN67QzIdNkBVRGAtcHJwDjh1OHypb0Oiy+W/0LCpuGatmV6sjdSypk/XAgMBAAECggEAeyUXWfSGknFr6E08H8KydreXGSb3O4OR5w5ancQtO+RGUVhltbE1Pk9tzu5k7+6Vs1V4rUhWZ8si4gyrdXpXRsk2HuIF0n5rMlweQnjYb46E41UOx6lc9GcEabG0CoYlPKDXxTjQmWrG8YNchy/MWZ/r13Gb4PgBpdNiOSiyemS/P9YJ8+Ghq5XpM2/rG7ssPLEGR55MCjI2Y5s42ALbyAnxpzl0y+5FMHDiC8wkuidU/X00IwmC9cbitOnaA2P+dzBUbUvKIQp8NQzZt/pxGOJSGiItsRk8JJ1OsWBCNiSOZ02mDX+T/vkmdmHIZTT3C7ktTr9CBZKW4kd4A+T0EQKBgQDi0PyGrBeaIxDe5BlHz5Cn6Pq0IT6mS/tMyNRSLL2K76YKsgUwhutFbfnb1UhIC1agACfbnKp3PU3jU071FmyzJP24fE8/z6GgfioCXIxljizMZc2Ab72lwg/YOw55948O8PfSHhe3WCaxBPBDZBkNuOxOsBvH62GA2aJWQsrM4wKBgQDFAGF5Q8+U8V0SNFxjns5iDygW3X+DXQXXGYdMdcxjeOAqWTI7rdA2EWicGoGrzuqIvSIWSKCC1hQFHJ9YHgJvgO8k8FC/9uN6WcPQ4CZsF8yxX1ib2KVeH+pT2xi04/GYs/u8X4eQuT/2aN2pNFweGuOUaePtS75H5lnvkE63fQKBgQCvtLe7V/tcs4dxM4CGCbyE5s231v0idD/zpqwcEH6w759QL8Inao09lsl1TA8XiHkNr7EwxnejsYDx9mp3IG0KhkBqtxnpU95gZvwCIlG8plv7520/7tAaZXBC0NURFP7k0zUXt6olpQssHKhHfHaQE84z0udiguxglbfVXR6fgwKBgGI3eGFe/4VAeKh01oMMT9TvvYr4z3QM0raVEbF7IXWOdCRo5/R9CcuLDl6VkIS52pBlyzLU7sGMPdr2lDL4czpoS9JcxcWPL4Z2bnwa5M0LaJAd+y1n67prqwY3u6+j3XXGdgFKl2n+Efel/K05X5vayA/cYziRhMKQA9K+XaB5AoGAFcMdZtsQL0l3eihD/xK6DxHe/Aem4h+vLXBkKK15Dx+eGM5Ss7MnZktFXcv9K7ox2jPzzn07Hi1XIiCPg5IkCUivrHwNk53iKohTS1eP8ySelRtGkHAmdFAWokrdgOx9sn42ZUSTf95216SlYEXrwit8bFM3CCekBvdiUeAqmwI='
    },
    // weixinProxy:'https://wzzfxswap1.sendinfo.com.cn',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'https'
};
