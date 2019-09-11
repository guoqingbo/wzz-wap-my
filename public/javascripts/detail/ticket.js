$(function () {
    // 更新票型列表
    // var searchName = getQueryVariable('searchName')||''
    // var date = $(".calendar-day-item.active").data("today")
    // updateTicketDom({name:searchName,date:date})

    var typeSwiper = new Swiper('#swiperType', {
        slidesPerView: 4,
        // spaceBetween: 30,
    });
    // 跳转到搜索页
    $("input[name='searchName']").focus(function(e) {
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
            var day = getDay(new Date(date))

           // 更新最后一个日期
            var lastEle = $(".calendar-day-item").eq(3)
            lastEle.attr('data-today',day.today)
            lastEle.find('.calendar-day-value').text(day.date)
            lastEle.find('.calendar-week').text(day.week)

            // 添加样式
            lastEle.addClass('active').siblings().removeClass('active')

            // 更新列表
            updateTicketDom({date:date})
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
    });
    // 更新列表
    function updateTicketDom(params) {
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
        console.log(shopData)
        var html = ticketTemplate({data:shopData,render:true,mixin:'shopCarList'})
        $(".shop-car-list").html(html)
    }

    // 票型列表数量加减
    $('.ticket-list-box').on("click",'.sub-icon,.add-icon',function (e) {
        var productEle = $(this).parents('.ticket-type-item')
        var buyNumEle = productEle.find('.buy-num')

        var buyNum = Number(buyNumEle.text())
        var maxNum = productEle.find(".add-icon").data("maxOrder")

        if($(this).hasClass('sub-icon')){
            buyNum--
            // 如果是-
        }else{
            // 如果是+
            buyNum++
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
        var maxNum = 100

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

    var classifyId = getQueryVariable('classifyId')||''
    if(classifyId>=0){
        $(".ticket-type-slide[data-classifyid="+classifyId+"]").addClass('active').siblings().removeClass('active')
        $(".ticket-type-slide.active").trigger('click')
    }
})
