$(function () {
    // 更新票型列表
    // var searchName = getQueryVariable('searchName')||''
    // var date = $(".calendar-day-item.active").data("today")
    // updateTicketDom({name:searchName,date:date})
    var classifyId = getQueryVariable('classifyId')||''
    var typeSwiper = new Swiper('#swiperType', {
        slidesPerView: 5,
        spaceBetween: 5,
        initialSlide:$(".ticket-type-slide[data-classifyid="+classifyId+"]").data('index')
    });
    // 跳转到搜索页
    $("input[name='searchName']").focus(function(e) {
        e.preventDefault()
        e.stopPropagation()
        // 禁止弹出键盘
        document.activeElement.blur();
        window.location.href = "/detail/search"
    })
    // 日历点击
    $("body").on("click",'.calendar-day-item',function (e) {
        $(this).addClass('active').siblings().removeClass('active')
        var date = $(this).data('today')
        updateTicketDom({date:date})
    })
    // 弹出日历
    $(".calendar-btn").click(function () {
        $("#ticketcalendar").addClass('show');
        $("#mask").show();
    });
    // 日历
    $("#ticketcalendar").calendar({
        multipleMonth: 4,
        click: function (date) {
            // 转换日期
            var day = getDay(new Date(date[0]))

            // 如果选择的日期，在快捷日期里存在，则快捷日期，改为选中状态，否则更新最后一个日期
           if($(".calendar-day-item[data-today="+day.today+"]").length){
               // 添加样式
               $(".calendar-day-item[data-today="+day.today+"]").addClass('active').siblings().removeClass('active')
           }else{
               // 更新最后一个日期
               var lastEle = $(".calendar-day-item").eq(3)
               lastEle.attr('data-today',day.today)
               lastEle.find('.calendar-day-value').text(day.date)
               lastEle.find('.calendar-week').text(day.week)
               // 添加样式
               lastEle.addClass('active').siblings().removeClass('active')
           }


            // 更新列表
            updateTicketDom({date:date[0]})
            // 隐藏日历
            $("#ticketcalendar").removeClass('show');
            $('.mask').hide()

        }
    });
    // 点击蒙层
    $('.mask').click(function () {
        $('#mask').hide();
        $("#ticketcalendar").removeClass('show');
        $('.video-pop-box').hide()

        var bottom =  -$('.shop-car-box').height()
        $('.shop-car-box').removeClass('show')
        $('.shop-car-box').animate({
            bottom:bottom
        });

        $(".ticket-detail-box").removeClass('show')

        $(".buy-ticket-layer").hide()
    });
    // 更新列表
    function updateTicketDom(params) {
        console.log(params)
        // 更新票型列表
        $.ajax({
            type: "POST",
            url: "/detail/getTicketList",
            data: params,
            success: function (data) {
                if(data[0].status == 200){
                    $(".ticket-list-box").html(data[0].html)
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
    // 获取星期
    function getDay(date){
        if(!date){
            date = new Date();
        }
        let weekObj = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        let dayObj = {};
        dayObj.year = date.getFullYear();
        dayObj.month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
        dayObj.day = (date.getDate())<10?"0"+(date.getDate()):(date.getDate());
        dayObj.week = weekObj[date.getDay()];
        dayObj.today = dayObj.year+'-'+ dayObj.month+'-'+ dayObj.day;
        dayObj.date = dayObj.month+"月"+dayObj.day+"日";
        return dayObj
    }
    // 票型点击
    $(".ticket-type-slide").click(function (e) {
        $(this).addClass('active').siblings().removeClass('active')
        var classifyId = $(this).data('classifyid')
        var scrollTop = $('.ticket-type[data-classifyid='+classifyId+']').offset().top-$('#swiperType').height()
        // 兼容写法
        $('html,body').animate({
            scrollTop: scrollTop+"px"
        });

    })
    // 滚动到某一位置不动
    var offset = $('#swiperType').offset();
    $(window).scroll(function () {
        //检查对象的顶部是否在游览器可见的范围内
        var scrollTop = $(window).scrollTop();
        if (offset.top < scrollTop){
            $('#swiperType').addClass('fixed');
        }
        else{
            $('#swiperType').removeClass('fixed')
        }
    });
    // 点击购物车
    $(".shop-car-nav").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var bottom =  -$('.shop-car-box').height()
        if($('.shop-car-box').hasClass('show')){
            $('.shop-car-box').removeClass('show')
            $("#mask").hide()
        }else{
            // 生成购物车
            createShopCar()
            $('.shop-car-box').addClass('show')

            bottom =  $(".footer-shop-box").height()
            $('.shop-car-box').css({
                bottom:-$('.shop-car-box').height()
            })
            $("#mask").show()
        }
        $('.shop-car-box').animate({
            bottom:bottom
        });
    })

    // 生成购物车
    function createShopCar(){
        var shopData = []
        $(".ticket-list-box .ticket-type-item").each(function () {
            // 购买数量
            var buyNum = $(this).find(".buy-num").text()
            if(buyNum>0){
                var item = $(this).data("item")
                // 加入购物车
                item.buyNum = buyNum
                shopData.push(item)
            }

        })
        // 生成html(使用jade模板编译的模板js,gulp自动编译，放入dist/templates)
        var html = ticketTemplate({data:shopData,render:true,mixin:'shopCarList'})
        $(".shop-car-list").html(html)
    }

    // 票型列表数量加减
    $('.ticket-list-box').on("click",'.sub-icon,.add-icon',function (e) {
        var productEle = $(this).parents('.ticket-type-item')
        var buyNumEle = productEle.find('.buy-num')

        // 订单信息
        var item = productEle.data("item")

        var buyNum = Number(buyNumEle.text())
        var maxNum = productEle.find(".add-icon").data("maxorder")

        if($(this).hasClass('sub-icon')){
            buyNum--
            // 如果是-
        }else{
            // 如果是+
            buyNum++
            // item.bookRemind = '自定义测试数据'
            if(buyNum==1 && item.bookRemind){
                // 加入购物车时，判断是否弹出购票提示
                $(".mask").show()
                $(".buy-ticket-layer").data("id",item.id)
                $(".buy-ticket-layer").show()
                $(".buy-ticket-remind").html(item.bookRemind)
                return
            }
        }
        if(buyNum<=0){
            buyNum = 0
        }
        if(maxNum && buyNum>maxNum){
            buyNum = maxNum
        }
        buyNumEle.text(buyNum)

        // 计算价格和数量
        computePrice()
    })

    // 购物车数量加减
    $('.shop-car-list').on("click",'.sub-icon,.add-icon',function (e) {
        var productEle = $(this).parents('.ticket-type-item')
        var buyNumEle = productEle.find('.buy-num')

        // 对应的列表票型
        var id = productEle.data("item").id
        var productTypeEle = $('.ticket-list-box').find('.ticket-type-item[data-id='+id+']')
        var buyNumTypeEle = productTypeEle.find('.buy-num')


        var buyNum = Number(buyNumEle.text())
        var maxNum = productTypeEle.find(".add-icon").data("maxorder")

        if($(this).hasClass('sub-icon')){
            buyNum--
            // 如果是-
        }else{
            // 如果是+
            buyNum++
        }
        if(buyNum<=0){
            buyNum = 0
            productEle.remove()
        }
        if(buyNum>maxNum){
            buyNum = maxNum
        }
        buyNumEle.text(buyNum)
        buyNumTypeEle.text(buyNum)
        // 计算价格和数量
        computePrice()
    })

    // 计算价格
    function computePrice() {
        var totalPrice = 0
        var shopNum = 0
       $(".ticket-list-box .ticket-type-item").each(function () {
           // 单价
           var priceUnit = $(this).find(".price-num").text()

           // 购买数量
           var buyNum = $(this).find(".buy-num").text()

           totalPrice+=Number(buyNum*priceUnit)
           shopNum+=Number(buyNum)
       })
        // 总价
        $(".total-price-value").text(totalPrice.toFixed(2))
        // 数量
        $(".ticket-shop-num").text(shopNum)
        if(shopNum<=0){
            // 预定按钮置灰
            $(".pay-btn").attr('disabled','disabled')
        }else{
            $(".pay-btn").removeAttr('disabled','disabled')
        }
        return totalPrice
    }

    // 查看详情
    $("body").on("click",".look-detail",function () {
        var sitem = $(this).parents('.ticket-type-item').data("item")
        // 生成详情html
        var html = ticketTemplate({data:sitem,render:true,mixin:'lookTicketDetail'})
        $(".ticket-detail-box").html(html)
        $("#mask").show()
        $(".ticket-detail-box").addClass('show')
        $(".ticket-detail-content").on('touchstart touchmove touchend',function (e) {
            e.stopPropagation()
            // e.preventDefault()
        })
        $(".ticket-detail-content").uniqueScroll()
    })
    $("body").on("click",".ticket-close",function () {
        $(".ticket-detail-box").removeClass('show');
        $("#mask").hide();
    });

    // 视频弹框
    $("body").on('click','.video-intro',function (e) {
        e.preventDefault()
        e.stopPropagation()
        var video = $(this).data("video")
        // $('.video-pop-box video').empty()
        // $('.video-pop-box video').append($("<source src="+ video +">"));
        // 不动态创建video的话，自动播放不起作用
        $('.video-pop-box video').remove()
        var videoEle = '<video controls="controls" style="width: 100%;object-fit: fill;height:8rem" src='+video+'></video>'
        $('.video-pop-box').append(videoEle)
        // $('.video-pop-box video source').attr('src',video)
        $('.video-pop-box').show()
        $('.video-pop-box video').trigger('play');
        $('.mask').show()
    })
    // 关闭视频
    $("body").on('click','.close-icon',function (e) {
        e.preventDefault()
        e.stopPropagation()
        $('.video-pop-box video').attr('src','')
        $('.video-pop-box').hide()
        $('.mask').hide()
    })
    // 预订
    $(".pay-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        // 获取购物车信息
        var shopData = []
        var day = $(".calendar-day-item.active").data('today')
        var money = $(".total-price-value").text()
        $(".ticket-list-box .ticket-type-item").each(function () {
            // 购买数量
            var buyNum = $(this).find(".buy-num").text()
            if(buyNum>0){
                var item = $(this).data("item")
                // 加入购物车
                item.buyNum = buyNum
                shopData.push(item)
            }

        })
        sessionStorage.setItem('shopData',JSON.stringify({list:shopData,day:day,money:money}))
        window.location.href = '/order/ticket'
    })
    // 清空购物车
    $(".clear-shop-car").click(function (e) {
        $(".ticket-list-box .ticket-type-item").each(function () {
            $(this).find(".buy-num").text(0)
        })
        // 重建购物车
        createShopCar()
        // 计算价格
        computePrice()
    })


    // 初始化票型位置
    if(classifyId>=0){
        $(".ticket-type-slide[data-classifyid="+classifyId+"]").addClass('active').siblings().removeClass('active')
        $(".ticket-type-slide.active").trigger('click')
    }
    // 产看详情弹框，阻止父级滚动
    $(".ticket-detail-box").uniqueScroll()
    // $(".ticket-detail-box").scroll(function (e) {
    //     $(".ticket-detail-content").uniqueScroll()
    // })

    // 购票提醒-我已了解
    $("#checkedBtn").click(function () {
        if($(".checked-icon").hasClass('active')){
            $(".checked-icon").removeClass('active')
            $(".buy-ticket-confirm").attr('disabled','disabled')
        }else{
            $(".checked-icon").addClass('active')
            $(".buy-ticket-confirm").removeAttr('disabled')
        }
    })
    // 购票提醒-确认
    $(".buy-ticket-confirm").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        // 加入购物车
        var id =  $(".buy-ticket-layer").data("id")
        var buyNumEle = $('.ticket-type-item[data-id='+id+']').find('.buy-num')
        buyNumEle.text(1)
        // 计算价格和数量
        computePrice()

        // 购票提醒-关闭
        closeTicketBox()

    })
    // 购票提醒-取消
    $(".buy-ticket-cancel").click(function (e) {
        e.preventDefault()
        e.stopPropagation()

        // 购票提醒-关闭
        closeTicketBox()
    })
    // 购票提醒-关闭
    function closeTicketBox() {
        $(".mask").hide()
        $(".buy-ticket-layer").hide()
        $(".checked-icon").removeClass('active')
        $(".buy-ticket-confirm").attr('disabled','disabled')
    }
})
