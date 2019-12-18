$(function () {
    // 翻页
    var dropBox = $(" .order-box"),
        filterObj = { currPage: 1, pageSize: 8}; // 定义一个对象用于存储筛选条件,默认筛选为翻页第一页

    var dropload = dropBox.dropload({
        scrollArea: window,
        loadDownFn: filterFn
    });
    // 筛选构造DOM
    function filterFn(dropload, startPage) {
        filterObj.name = $("input[name=keyword]").val()||''
        filterObj.date = $(".calendar-day-item.active").data('today')
        $.ajax({
            type: 'POST',
            url: '/manage/getTicketList',
            data: filterObj,
            dataType: 'json',
            success: function (data) {
                if (data[0].status == 200) {
                    if (startPage) {
                        dropBox.find('ul').html(data[0].html);
                    } else {
                        dropBox.find('ul').append(data[0].html);
                    }
                    filterObj.currPage += 1;
                    if (filterObj.currPage > data[0].pages) {
                        dropload.lock();
                        dropload.noData();
                    }
                } else {
                    dropload.lock();
                    dropload.noData();
                    new ErrLayer({message:data[0].message})
                }
                // 每次数据加载完，必须重置
                dropload.resetload();
            },
            error: function (xhr, type) {
                dropload.lock();
                dropload.noData();
                // 即使加载出错，也得重置
                dropload.resetload();
            }
        });
    }

    // 搜索
    $(".search-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()

        dropload.unlock();
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })

    // 日历点击
    $("body").on("click",'.calendar-day-item',function (e) {
        $(this).addClass('active').siblings().removeClass('active')
        dropload.unlock();
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })
    // 上架下架
    $(" .order-box").on('click','.enabled-btn',function () {
        var enabled = $(this).data("enabled")
        var message = '确认上架？'
        var flag = 'T'
        if(enabled == "T"){
            message = '确认下架？'
            flag = "F"
        }
        new TipLayer({
            message: message,
            confirmType: 'confirm',
            confirmCallBack: function () {
                var rateCode = $('.enabled-btn').data('ratecode')
                changeFlag(rateCode,flag)
            }
        })
    })

    function changeFlag(rateCode,flag){
        if(rateCode){
            var params = {
                rateCode:rateCode,
                date:$(".calendar-day-item.active").data('today'),
                flag:flag
            }
            $.post("/manage/changeFlag",params)
                .success(function (data) {
                    if(data[0].status===200){
                        new ErrLayer({message: data[0].message||'操作成功'})
                        window.location.reload()
                    }else{
                        new ErrLayer({message: data[0].message})
                    }
                })
                .error(function (error) {
                    console.log(error)
                })
        }else{
            new ErrLayer({message: "未获取子订单编号"})
        }
    }
})
