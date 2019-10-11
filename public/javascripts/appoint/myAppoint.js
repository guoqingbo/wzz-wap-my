$(function () {
    // 取消预约
    $("body").on("click",".cancel-appont-btn",function (e) {
        var params = {
            ticketNo:$(this).data("ticketno"),
            projectCode:projectId
        }
        $.post("/appoint/cancel",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                if(data[0].status == 200){
                    window.location.reload()
                }
            })
            .error(function (error) {
                console.log(error)
            })
    })
})
