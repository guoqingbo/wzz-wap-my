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
        appId : '2021001103646267',//测试环境
        openAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
        url:'https://openapi.alipay.com/gateway.do',
        private:'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHmd2B2Ahph79io/XAUkpSxlWkCuVFawYz2e4xe/ULOmEw90BNOknLvvAqdEjmv0UeX6B+dAzWNWe8zrjDFhsX4lJmfHvg9HtufY8b4tUziG83u26Jum+COM7Fz5sjTZQPFzlbnIt5WtxaKOhzMJM8MoMLTrnk2S6GYYqAgJVlcRGvpnhMpkt/8B8eWvzMvNwbpxmR8CAoaMVt+Ev24eNG5UR+RazWXuLl7+m4HR7KBK+RpNnYZK724p8UivJkbKaH5duIL0eAeJ3AXTqLMgPICFc3DDBakYpal+rM3SUrqkVNvn9Pt8QIG4xlh87vGeOCqVtcW3d8rH1vjAmw8oefAgMBAAECggEANzYS1pdbdXxsFIGlwhS/ZkyS+iPljgoxkFMfhM5vy46NnB5P9CHTgj3QE7kdJbajMebFtjcSMvWzs1CIMgaCKYtg+ZGd7s4co7RD3JrTLBRVFGAgdbuPQ3pV1nzdMdaYfjx6gi6PK24vYhZd7ujMSipW6Pe5ANDc/KIifofcTFzRl6LevKk6DGCKuGPhB5D68Hl/vg4QzExw46ttWQZw9WAjRGOAOLjdMMW2LIefNH2VopGuxuRRnoeVtP6diUu+qaJievEWelrJ4ObXjzJ9vpXeYWU2zHm8YKCWzKUk0I+/7GtznTbUNlsLjRWZtm3smg8TS3BUIUVOIXa9JkfugQKBgQC8JsVlfnG5pbPLXx9mj05OMHWmH0KeqT8J9fHIkFivnazfSJKE9fEcghhliVsCJpu9RUYwWUa1bKR4kNpBbxANtB5Qs8vR/hh1AT4RWRpjnZ/18wxMw047mrKEVDajiR4smbWIFZ9bxM9kB3dX15weoXNe0/vmCC34pcYLbhJwUQKBgQC4f+UeUo+vO33Xjm7hddy+VYa33/2urguihiT5K1NEDIZAjnkgd9irZYp4JlY9/DPG0WJfHsQYcWcOVSNeuLeCBO2IUpHhFHUSQwKHWTcVi2xwPSw12czV7BhKhbyigYoO1tjhp10zN5moMYnHwX8Lc51k7Vd5pa1hYTs+B+Hs7wKBgHb3FMztvD6j9SDcDmCsr9hkb58QGPF1FfTYW35zNoAj9FBh9LK5RzC9WWuqA69CdiqgiJa9fCXugbfx7u58qOvhPWHNrUwjm5cvp+0UJ8lguumqOda3jtnFIKbnEH0qj7enoM5gzZgawv7+cYlLPN1pPCdzZcy200pqluRXPrVhAoGAA2rrFZq16qsRc7LBvw9t3WC8NB/EFT5IHOSbPrpcun/45K0+9SkDLHmfDQa4xkErvF0Yk2aAf2tqW0ucch6913y74bCV3zN/z6zKGTO/33hLs/COJxk3wCa1dHvxuJjps8irD9MH2PEIuaLhSH//GHk1yy7SVgCJq6ofbNC8kKUCgYEAt1TCEBpgAK0JTdDtMb1WrKj5KquqjwHhoyD2n68vMvjTAGQYHsxnzcZbhUWIWq9+VEWn4AasnN6x9ve6NHUD60KGHVP0eMd3nVklVecxOChuXByerCiQ1FBHoYlMqdbnf0a6CZeasi3hLGd+rQNsK/mXLhE7NNJih1Qp911IW5c='
    },
    // weixinProxy:'https://wap.wuzhizhou.com',// 微信授权支付代理
    corpCode:'cgb2cfxs',
    protocol:'https'
}
