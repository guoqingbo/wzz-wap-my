$(function () {
    // 点击扫描二维码
    $(".scan-code-btn").click(function () {
        if(typeof wxShare == 'undefined'){
            return new ErrLayer({message: "请使用微信浏览器扫码"})
        }
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {// 当needResult 为 1 时，扫码返回的结果
               // window.location.href = "/appoint/queueList?ticketNo="+res.resultStr
                getQueueList(res.resultStr)
            }
        });
    })
    // 获取排队数据
    function getQueueList(ticketNo) {
        var url = "/appoint/queueList"
        var params = {
            ticketNo:ticketNo
        }
        $.post(url,params).done(function (res) {
            if(res[0].status == 200){
                $('.scan-code-result').html(res[0].html)
                $('.scan-code-box').hide()
                $('.scan-code-result').show()
            }else{
                $('.scan-code-box').show()
                $('.scan-code-result').hide()
                new ErrLayer({
                    message:res[0].message
                });
            }
        })
    }
    // getQueueList(19019042614000007)
})
