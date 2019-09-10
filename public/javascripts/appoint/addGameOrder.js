$(function () {
    var projectId = $("input[name='projectId']").val()
    var ticketNo = getTicketNo()
    var orderNo = $("input[name='orderNo']").val()
    // 预约
    $(".appoint-btn").click(function(){
        if(ticketNo.length<=0){
            return new ErrLayer({message: "请选择票型"})
        }
        var params={
            projectDetailId:$(this).data("id"),
            projectinfoId:projectId,
            // ticketNo:ticketNo.join(","),
            ticketJson:JSON.stringify(ticketNo),
        };
        $.post("/appoint/saveProjects",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                setTimeout(function () {
                    //window.location.reload()
                    window.location.href="/appoint/lookGameOrder?orderNo="+orderNo+"&projectId="+projectId
                },1000)
                // if(data[0].status == 200){
                //     setTimeout(function(){
                //         window.location.href="/member/order/"+orderNo;
                //     },2000)
                // }
            })
            .error(function (error) {
                console.log(error)
            })
    });
    // 获取选择预约的票型
    function getTicketNo(){
        var ticketNo = []
        var ticketInfo = {
            ticketNo:$("input[name='ticketNo']").val(),
            ticketNum:$("input[name='ticketNum']").val()
        }
        ticketNo.push(ticketInfo)
        // ticketNo.push($("input[name='ticketNo']").val())
        return ticketNo
    }
})
