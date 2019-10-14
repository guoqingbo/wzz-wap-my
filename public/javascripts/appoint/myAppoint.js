$(function () {
    // 取消预约
    $("body").on("click",".cancel-appont-btn",function (e) {
        var params = {
            ticketNo:$(this).data("ticketno"),
            projectCode:$(this).data("projectcode")
        }
        $.post("/appoint/cancel",params)
            .done(function (data) {
                if(data[0].status == 200){
                    new ErrLayer({message: data[0].message})
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
