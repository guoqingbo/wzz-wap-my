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
        // filterObj.name = $("input[name=keyword]").val()||''
        filterObj.labelId = $(".appoint-type-item.active").data('labelid')
        $.ajax({
            type: 'POST',
            url: '/booking/getList',
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

    // tab ajax请求
    $(".appoint-type-item").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $(this).addClass('active').siblings().removeClass('active')

        dropload.unlock();
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })
})
