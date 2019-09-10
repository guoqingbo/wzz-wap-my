$(function () {
    var tot1 =null
    // 点击扫描二维码
    $(".scan-code-btn").click(function (e) {
        e.stopPropagation()
        e.preventDefault()
        // window.location.href = '/appoint/takeNumSuccess'
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
        var projectId = $(".cancel-btn").data('projectid')
        if(!ticketNo){
            new ErrLayer({
                message:'票型码不存在'
            });
            return
        }
        if(!projectId){
            new ErrLayer({
                message:'未选择项目'
            });
            return
        }
        window.location.href = '/appoint/takeNumSuccess?ticketNo='+ticketNo+'&projectId='+projectId
        // var url = "/appoint/listForQueueWap"
        // var params = {
        //     ticketNo:ticketNo,
        //     projectId:projectId
        // }
        // alert('/appoint/takeNumSuccess?ticketNo='+ticketNo+'&projectId='+projectId)
        // $.post(url,params).done(function (res) {
        //     if(res[0].status == 200){
        //         window.location.href = '/appoint/takeNumSuccess?ticketNo='+ticketNo+'&projectId='+projectId
        //     }else{
        //         new ErrLayer({
        //             message:res[0].message
        //         });
        //     }
        // })
    }
    // 取消叫号
    $(".cancel-btn").click(function () {
        var url = "/appoint/cancleQueueWap"
        var params = {
            id:$(this).data("id")
        }
        if(!params.id){
            new ErrLayer({
                message:'队伍不存在'
            });
            return
        }
        $.post(url,params).done(function (res) {
            if(res[0].status == 200){
                new ErrLayer({
                    message:'取消成功'
                });
            }else{
                new ErrLayer({
                    message:res[0].message
                });
            }
            if(tot1){
                clearTimeout(tot1)
            }
            tot1 = setTimeout(function () {
                var projectId = $(".cancel-btn").data('projectid')
                window.location.href = '/appoint/takeNum?projectId='+projectId
            },1000)
        })
    })

})
