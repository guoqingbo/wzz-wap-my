$(function () {
    // 取消预约
    $("body").on("click",".cancel-appont-btn",function (e) {
        var params = {
            ticketNo:$(this).data("ticketno"),
            projectCode:$(this).data("projectcode")
        }
        $.post("/appoint/cancel",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                if(data[0].status == 200){
                    layer.open({
                        content: '操作成功'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function () {
                        window.location.reload()
                    },2000)
                }
            })
            .error(function (error) {
                console.log(error)
            })
    })
})
