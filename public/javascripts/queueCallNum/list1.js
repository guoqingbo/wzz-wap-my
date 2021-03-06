$(function () {
    function resetFont() {
        // 响应式布局
        var winWidth = $(window).width();
        $("html").css("fontSize", (winWidth / 1920) * 100 + "px");
    }
    resetFont()


    function query(name){
        // 获取get参数
        var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg)
        if(r){
            return r[2]
        }else{
            return  ''
        }
    }
    var time = null
    var screenCode = query("screenCode")
    function getQueueList() {
        var params = {screenCode: screenCode}
        $.post("/queueCallNum/list1",params)
            .done(function (res) {
                if(res[0].status == 200){
                    // 更新页面
                    $(".project-list").html(res[0].html)
                }
                // 两秒后刷新页面
                if(time){
                    clearTimeout(time)
                }
                time = setTimeout(function () {
                    getQueueList()
                },5000)
            })
    }
    if(screenCode){
        getQueueList()
    }
})
