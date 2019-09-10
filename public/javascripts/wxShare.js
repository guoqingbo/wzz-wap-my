$(function () {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxShare.appid, // 必填，公众号的唯一标识
        timestamp: wxShare.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxShare.nonceStr, // 必填，生成签名的随机串
        signature: wxShare.signature,// 必填，签名，见附录1
        jsApiList: [
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareQZone",
            "scanQRCode" //扫二维码
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.error(function(res){
        alert("错误信息== " + res.errMsg);
    });

    var shareObj = {
        title: $('title').text(),
        desc: $('title').text(),
        link: location.href.split('#')[0],
        imgUrl: $('body').find('img').eq(0).attr('src')
    };

    if(location.pathname.indexOf('detail') > -1 ){
        shareObj.imgUrl = $('#home_swiper').find('img').eq(0).attr('src')
        // shareObj.title = '票务预订_三亚蜈支洲岛旅游区'
        // shareObj.desc = '票务预订_三亚蜈支洲岛旅游区';
        // shareObj.title = $('title').text()
        // shareObj.desc = $('title').text()
    }
    // else if(location.pathname.indexOf('/product/ticket') > -1 ){
    //     shareObj.title = '票务预订_三亚蜈支洲岛旅游区'
    //     shareObj.desc = '票务预订_三亚蜈支洲岛旅游区';
    //     shareObj.imgUrl = 'https://wzzfxswap.sendinfo.com.cn/images/index/body-img3.png';
    // }
    else if(location.pathname === '/' || location.pathname.indexOf('list') !== -1 ){
        shareObj.imgUrl = $('#banner_swiper').find('img').eq(0).attr('src')
    }
    else{
        // shareObj.title = '票务预订_三亚蜈支洲岛旅游区'
        // shareObj.desc = '票务预订_三亚蜈支洲岛旅游区';
        shareObj.imgUrl = 'https://wap.wuzhizhou.com/images/index/body-img3.png';
    }
    if(!shareObj.imgUrl){
        shareObj.imgUrl ='https://wap.wuzhizhou.com/images/index/body-img3.png';
    }
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({
            title: shareObj.desc,
            desc: shareObj.desc,
            link: shareObj.link,
            imgUrl: shareObj.imgUrl,
            function (res) {
                alert('用户点击发送给朋友');
            }
        });

        wx.updateTimelineShareData({
            title: shareObj.desc, // 分享标题
            desc: shareObj.desc,
            link: shareObj.link,
            imgUrl: shareObj.imgUrl,
            function (res) {
                alert('分享成功');
            }
        });
        // ================================================================== 以上1.4，以下即将废弃
        wx.onMenuShareTimeline({ //分享朋友圈
            title: shareObj.desc, // 分享标题
            desc: shareObj.desc,
            link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
            }
        });

        wx.onMenuShareAppMessage({
            title: shareObj.desc, // 分享标题
            desc: shareObj.desc, // 分享描述
            link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareObj.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户点击了分享后执行的回调函数
            }
        });

        wx.onMenuShareQQ({
            // title: '', // 分享标题
            desc: shareObj.desc, // 分享描述
            link: shareObj.link, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({
            // title: '', // 分享标题
            desc: shareObj.desc, // 分享描述
            link: shareObj.link, // 分享链接
            imgUrl: shareObj.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
})
