$(function () {
    // console.log(document.referrer)
    // if(window.name !== 'takeNum'){
    //     window.location.href = window.location.href
    //     window.name = 'takeNum'
    // }else{
    //     window.name = ''
    // }
    $('body').click(function (e) {
        $(".project-seletct").removeClass("show")
    })
    // 展示下拉
    $(".project-seletct-show").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        if($(".project-seletct").hasClass('show')){
            $(".project-seletct").removeClass("show")
        }else{
            $(".project-seletct").addClass("show")
        }
    })
    $(".project-option").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $(".project-seletct-text").text($(this).text())
        $(".queue-num").text($(this).data('waitnum'))
        $(this).addClass('selected').siblings('.project-option').removeClass('selected')
        $(".project-seletct").removeClass("show")
    })
    // 点击扫描二维码
    $(".scan-code-btn").click(function () {
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
        var projectId = $(".project-option.selected").data('projectid')
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
        var url = "/appoint/listForQueueWap"
        var params = {
            ticketNo:ticketNo,
            projectId:projectId
        }
        // alert('/appoint/takeNumSuccess?ticketNo='+ticketNo+'&projectId='+projectId)
        window.location.href = '/appoint/takeNumSuccess?ticketNo='+ticketNo+'&projectId='+projectId
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
    // getQueueList(19019042614000007)
})
