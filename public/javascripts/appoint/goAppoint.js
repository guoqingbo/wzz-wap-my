$(function () {
    // tab ajax请求
    $(".tabAjax-select-item").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $(this).addClass('active').siblings().removeClass('active')
        var selected = $(this).data('selected')
        $.ajax({
            type: "POST",
            url: "/xxxxz",
            data: {selected: selected},
            success: function (data) {
                if(data[0].status == 200){
                    $(".tab-content-box").html("请求成功")
                }else {
                    new ErrLayer({message: data[0].message} || '请求错误')
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    // 预定须知
    $(".project-item-more ").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        layer.open({
            title:'标题',
            anim:'up',
            content: '哈哈哈哈',
            className:'my-layer',
            // skin:'footer'
        })

    })
})
