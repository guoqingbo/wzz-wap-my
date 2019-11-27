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
        filterObj.searchParam = $("input[name=keyword]").val()||'',
        $.ajax({
            type: 'POST',
            url: '/supplier/getOrderList',
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
    // function getOrderList(){
    //     var params = {
    //         searchParam:$("input[name=keyword]").val()||'',
    //     }
    //     // if(!params.searchParam){
    //     //     new ErrLayer({message: '手机号或姓名不能为空!'})
    //     //     return
    //     // }
    //     $.post("/supplier/getOrderList",params)
    //         .success(function (data) {
    //             if(data[0].status===200){
    //                 $(".supplier-order-list").html(data[0].html)
    //             }else{
    //                 new ErrLayer({message: data[0].message})
    //             }
    //         })
    //         .error(function (error) {
    //             console.log(error)
    //         })
    // }
    // getOrderList()
    function unLockDropload() {
        dropload.resetload();
        dropload.unlock();
        dropload.noData(false);
        dropload.isData = true;

    }
    // 搜索
    $(".search-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        unLockDropload()
        filterObj.currPage = 1
        filterFn(dropload, 1)
    })
    // 确认发货
    var orderDetailNo = ''
    $(" .order-box").on('click','.confirm-send-btn',function (e) {
        e.preventDefault()
        e.stopPropagation()
        orderDetailNo = $(this).data('orderdetailno')
        $(".confirm-send-box").show()
        $(".mask").show()
    })
    // 确认发货
    $(".confirm-save-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var params = {
            orderDetailNo:orderDetailNo,
            expressNo:$("input[name=expressNo]").val(),
            expressType:$("select[name=expressType]").val(),
        }
        if(!params.expressNo){
            $(".error-expressNo").show()
            return
        }else{
            $(".error-expressNo").hide()
        }
        $.post("/supplier/checkGoods",params)
            .success(function (data) {
                $(".confirm-send-box").hide()
                $(".mask").hide()
                if(data[0].status===200){
                    new ErrLayer({message: data[0].message})
                    setTimeout(function () {
                        window.location.reload()
                    },500)
                }else{
                    new ErrLayer({message: data[0].message})
                }
            })
            .error(function (error) {
                console.log(error)
            })
    })

    $(".mask,.cancel-btn").click(function (e) {
        $(".confirm-send-box").hide()
        $(".mask").hide()
    })
    $(" .order-box").on('click','.scan-code-btn',function () {
        new TipLayer({
            message: '确认要核销',
            confirmType: 'confirm',
            confirmCallBack: function () {
                var orderDetailNo = $('.scan-code-btn').data('orderdetailno')
                checkOrderH5(orderDetailNo)
            }
        })
    })
    // 核销
    function checkOrderH5(orderDetailNo){
        if(orderDetailNo){
            var params = {
                orderDetailNo:orderDetailNo,
            }
            $.post("/supplier/checkOrderH5",params)
                .success(function (data) {
                    if(data[0].status===200){
                        new ErrLayer({message: data[0].message||'核销成功'})
                        setTimeout(function () {
                            window.location.reload()
                        },500)
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
