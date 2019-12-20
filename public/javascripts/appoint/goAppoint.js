$(function () {
    var  bookInformation=''
    // 翻页
    var dropBox = $(".project-box"),
        filterObj = { currPage: 1, pageSize: 8}; // 定义一个对象用于存储筛选条件,默认筛选为翻页第一页

    var dropload = dropBox.dropload({
        scrollArea: window,
        loadDownFn: filterFn
    });
    // 筛选构造DOM
    function filterFn(dropload, startPage) {
        filterObj.type = $(".appoint-type-item.active").data('key')
        filterObj.name = $('.search-input').val()||''
        $.ajax({
            type: 'POST',
            url: '/appoint/goAppointList',
            data: filterObj,
            dataType: 'json',
            success: function (data) {
                if (data[0].status == 200) {
                    if (startPage) {
                        dropBox.find('ul').html(data[0].html);
                    } else {
                        dropBox.find('ul').append(data[0].html);
                    }
                    bookInformation = data[0].bookInformation
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
    // tab ajax请求
    $(".appoint-type-item").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $(this).addClass('active').siblings().removeClass('active')

        dropload.unlock();
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })
    $(".search-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        dropload.unlock();
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })
    // 预订须知
    $(".project-list").on("click",".project-item-more ",function (e) {
        e.preventDefault()
        e.stopPropagation()
        layer.open({
            title:'预订须知',
            anim:'up',
            content: bookInformation,
            className:'my-layer',
            // skin:'footer'
        })

    })
})
