$(function () {

    // 微信扫一扫
    // wx.config({
    //     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: wxShare.appid, // 必填，公众号的唯一标识
    //     timestamp: wxShare.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: wxShare.nonceStr, // 必填，生成签名的随机串
    //     signature: wxShare.signature,// 必填，签名，见附录1
    //     jsApiList: [
    //         "scanQRCode" //扫二维码
    //     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });
    $(".scan-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        if(typeof wxShare == 'undefined'){
            return new ErrLayer({message: "请使用微信浏览器扫码"})
        }
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {// 当needResult 为 1 时，扫码返回的结果
                // 核销
                checkOrderH5(res)
            }
        });
    })
    function checkOrderH5(res){
        if(res){
            var str = res.resultStr
            var params = {
                orderDetailNo:str,
            }
            $.post("/supplier/checkOrderH5",params)
                .success(function (data) {
                    if(data[0].status===200){
                        new ErrLayer({message: data[0].message||'核销成功'})
                    }else{
                        new ErrLayer({message: data[0].message})
                    }
                })
                .error(function (error) {
                    console.log(error)
                })
        }else{
            new ErrLayer({message: "未获取扫码内容"})
        }
    }
})
