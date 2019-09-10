$(function () {
    // 取消预约
    $("body").on("click",".cancel-appont-btn",function (e) {
        var projectId = $("input[name='projectId']").val();
        var orderNo = $("input[name='orderNo']").val();
        var params = {
            ticketNo:$(this).data("ticketno"),
            projectCode:$(this).data("projectid")
        }
        $.post("/appoint/cancel",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                if(data[0].status == 200){
                    //window.location.reload()
                    window.location.href='/appoint/addGameOrder?orderNo='+orderNo+'&projectId='+projectId;
                }
            })
            .error(function (error) {
                console.log(error)
            })
    })
})
