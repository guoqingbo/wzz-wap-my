$(function () {
    // var linkman =$("#linkManLayer").data("linkman")||[]
    var linkman =[]
    var shopInfo = {}
    var recomentInfo = {list:[]}
    var shopData = JSON.parse(sessionStorage.getItem('shopData') || '{}')
    // 初始化页面
    function initHtml() {
        // 生成票型列表
        var html = orderTemplate({data:{list:shopData.list},render:true,mixin:'shopCarList'})
        // 价格
        var totalPrice = Number(shopData.money)
        if(recomentInfo.list.length){
            html+=orderTemplate({data:{list:recomentInfo.list},render:true,mixin:'shopCarList'})
            totalPrice+=Number(recomentInfo.totalPrice)
        }
        $(".shop-car-list").html(html)

        // 游玩日期
        $('.play-day').text(shopData.day)

        // 总价
        $('.order-total-money-value').text(totalPrice.toFixed(2))
    }
    initHtml()

    $("#mask").click(function (e) {
        $(this).hide()
        $("#linkManLayer").removeClass("linkMan-layer-show");
        $(".pay-box").animate({
            bottom:-$(".pay-box").height()
        });
    })

    // 选择游玩人
    var parentEle = '' //
    $("body").on("click",".chose-play-person",function (e) {
        // 获取已经选择的游玩人
        var linkManChecked=[]

        if($(this).parents(".ticket-type-box").length){
            // 游玩人
            parentEle = $(this).parents(".ticket-type-box")
            parentEle.find(".person-selected-item").each(function (e) {
                var personItem = $(this).data("item")
                linkManChecked.push(personItem.id)
            })
        }else if($(this).parents(".take-ticket-box").length){
            // 取票人
            parentEle = $(this).parents(".take-ticket-box")
            parentEle.find(".take-person-item").each(function (e) {
                var personItem = $(this).data("item")
                linkManChecked.push(personItem.id)
            })
        }

        $.get('/member/linkMan',function (data) {
            $("#linkManLayer").addClass("linkMan-layer-show");
            $("#mask").show();
            linkman = data[0].data
            var html = orderTemplate({
                data:{
                    linkMan:linkman,
                    linkManChecked:linkManChecked
                },
                render:true,
                mixin:'linkManList'
            })
            $("#linkManLayer").html(html)
        })
    });

    // 游玩人
    $(".linkMan-layer").on('click', '.linkMan-check', function () {
        // 获取需要填写的取票人数量
        var allnum = 1
        // 已经选择的游玩人数量
        var tnum = $('.linkMan-list').find('.checkspan.checked').length;
        if(parentEle&&parentEle.length){
            allnum = Number(parentEle.find(".ticket-amount-value").text()||1)
        }
        if( $(this).find("span").hasClass('checked') ){
            $(this).find("span").removeClass("checked").find("i").removeClass("icon-checkmark");
        }else{
            if(allnum == 1){
                $(".linkMan-list").find('.checkspan').removeClass('checked');
                $(".linkMan-list").find('.checkspan').find("i").removeClass("icon-checkmark");
                $(this).find("span").addClass("checked").find("i").addClass("icon-checkmark");
            } else if( tnum < allnum ){
                $(this).find("span").addClass("checked").find("i").addClass("icon-checkmark");
            }
        }
    });
    $(".linkMan-layer").on('click', '#cancel',function () {
        $("#linkManLayer").removeClass('linkMan-layer-show');
        $("#mask").hide();
    });
    $(".linkMan-layer").on('click', '#enter',function () {
        $("#linkManLayer").removeClass('linkMan-layer-show');
        $("#mask").hide();
        // 获取选中的游客
        var selectedPerson = []
        $(".checkspan.checked").each(function () {
            var item = $(this).parents('.linkMan-item').data("item")
            selectedPerson.push(item)
        })
        // 填入对应的游客
        if(parentEle.find(".person-selected").length){
            // 门票游玩人
            var html = orderTemplate({
                data:selectedPerson,
                render:true,
                mixin:'ticketLinkMan'
            })
            parentEle.find(".person-selected").html(html)
        }else if(parentEle.find(".take-person-option").length){
            // 取票人
            var html = orderTemplate({
                data:selectedPerson,
                render:true,
                mixin:'takeTicketLinkMan'
            })
            parentEle.find(".take-person-option").html(html)
        }
    });
    // 删除
    $(".shop-car-list").on('click','.person-selected-delete',function (e) {
        $(this).parents('.person-selected-item').remove()
    })
    // 提交订单
    $(".submit-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        // 检测表单
        var message = ''
        // 获取所有的实名制票
        var checkPersonNum = false
        $(".ticket-type-box[data-real='T']").each(function () {
            // 购买数量
            var buyNum = $(this).find(".ticket-amount-value").text()
            // 已选实名制人数
            var personNum = $(this).find(".person-selected-item").length

            // 票型名称
            var ticketName = $(this).find(".ticket-name").text()

            if(personNum<buyNum){
                message =ticketName+ '游玩人与购买数量不一致'
                checkPersonNum = true
                return false
            }
        })
        if(checkPersonNum){
            console.log()
            // 检测实名制票，是否全部选择游玩人
            return new ErrLayer({message:message})
        }

        if($(".take-person-item").length<1){
            // 是否选择了取票人
            return new ErrLayer({message:'尚未选择取票人'})
        }
        // 提交订单
        var cartOrderDtos = [] //下单参数
        $(".ticket-type-box").each(function () {
            var realNames = []
            $(this).find(".person-selected-item").each(function () {
                var realNamesItem = {
                    idNo:$(this).find(".person-selected-icard").text(),
                    name:$(this).find(".person-selected-name").text(),
                }
                realNames.push(realNamesItem)
            })
            var orderItem = {
                amount:$(this).find(".ticket-amount-value").text(),
                begDate:$(".play-day").text(),
                endDate:$(".play-day").text(),
                bnsType:"park",
                rateCode:$(this).data("ratecode"),
                realNames:realNames
                // couponCheckCode:"",
                // couponCode:"",
            }
            cartOrderDtos.push(orderItem)
        })

        var params = {
            linkName:$(".take-ticket-box .take-person-name").text(),//取票人姓名
            linkMobile:$(".take-ticket-box .take-person-phone").text(),//取票人手机号
            linkIdcard:$(".take-ticket-box .person-selected-icard").text(),//取票人身份证
            cartOrderStr:JSON.stringify(cartOrderDtos),//下单参数
            paramExtension:"",//业务拓展参数
        }
        $.ajax({
            type: 'POST',
            url: '/order/saveCartOrder',
            data: params,
            success: function (data) {
                if (data[0].status === 200 ) {
                    // sessionStorage.shopInfo = JSON.stringify(data[0].data||{})
                    // window.location.href = '/pay/ticket/shopCar';
                    shopInfo = data[0].data
                    // 唤起支付弹框
                    showPayPop()
                } else if(data[0].status == 400){
                    window.location.href = '/login?redir='+window.location.href;
                } else {
                    new ErrLayer({message:data[0].message})
                }
            },
            error:function (err) {
                console.log(err)
            }
        });
    })

    // 唤起支付弹框
    function showPayPop() {
        // 支付总额
        $(".pay-amount-value").text(shopInfo.paySum)
        $(".pay-box").css({
            top:"unset",
            bottom:-$(".pay-box").height()
        })
        $(".pay-box").animate({
            bottom:0
        });
        $("#mask").show()
    }
    // 支付方式选择
    $(".pay-item").click(function (e) {
        $(this).addClass('active').siblings(".pay-item").removeClass('active')
    })
    // 去支付
    // 阻止多次点击去支付
    $('.to-pay-btn').click(function (e) {
        e.preventDefault();
        var paytype = $(".pay-item.active").data('paytype');
        var payUrl = '/pay/park?payOrderNo='+ shopInfo.payOrderNo +'&paySum='+shopInfo.paySum+'&payType='+ paytype;
        if(paytype == 42 || paytype == 41){
            // 如果是银联支付
            // payUrl +='&amount='+item.amount
        }
        var flag = $(this).data('flag');
        if(!flag){
            $(this).data('flag', true);
            window.location = payUrl;
        }
    });

    // 获取其他优惠项目
    var recomentListPages = 1
    var recomentListTotalPage = ''
    function getRecomentList(){
        var rateCodes = []
        for(var i=0;i<shopData.list.length;i++){
            rateCodes.push(shopData.list[i].rateCode)
        }
        $.ajax({
            type: 'POST',
            url: '/order/getRecomentList',
            data: {
                pageSize:3,
                currPage:recomentListPages,
                rateCodes:rateCodes.join(','),
                orderSum:shopData.money
            },
            success: function (data) {
                if (data[0].status === 200 ) {
                    $(".ticket-type-list").append(data[0].html)
                } else {
                    new ErrLayer({message:data[0].message})
                }
            },
            error:function (err) {
                console.log(err)
            }
        });
    }
    getRecomentList()
    // 其它优惠项目点击加载更多
    $(".show-more-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        recomentListPages++
        if(recomentListPages > recomentListTotalPage){
            $(this).attr('disabled','disabled')
            $(this).text('没有更多数据了')
        }else{
            getRecomentList()
        }
    })

    // 票型列表数量加减
    $('.ticket-type-list').on("click",'.sub-icon,.add-icon',function (e) {
        var productEle = $(this).parents('.ticket-type-item')
        var buyNumEle = productEle.find('.buy-num')
        console.log(buyNumEle)
        // 订单信息
        // var item = productEle.data("item")

        var buyNum = Number(buyNumEle.text())
        var maxNum = productEle.find(".add-icon").data("maxorder")

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
    // 计算价格
    function computePrice() {
        var totalPrice = 0
        var shopNum = 0
        var list = []
        $(".ticket-type-list .ticket-type-item").each(function () {
            // 单价
            var priceUnit = $(this).find(".price-num").text()

            // 购买数量
            var buyNum = $(this).find(".buy-num").text()
            if(buyNum>0){
                var item = $(this).data('item')
                item.buyNum = buyNum
                list.push(item)

                totalPrice+=Number(buyNum*priceUnit)
                shopNum+=Number(buyNum)

            }
        })
        // 总价
        $(".recoment-total-value").text(totalPrice.toFixed(2))
        recomentInfo.list = list
        recomentInfo.totalPrice = totalPrice

        // 重新生成票型html
        initHtml()

        // 数量
        // $(".ticket-shop-num").text(shopNum)
        // if(shopNum<=0){
        //     // 预定按钮置灰
        //     $(".pay-btn").attr('disabled','disabled')
        // }else{
        //     $(".pay-btn").removeAttr('disabled','disabled')
        // }
        return totalPrice
    }
})
