$(function () {
    // var linkman =$("#linkManLayer").data("linkman")||[]
    var linkman =[]
    var shopInfo = {}
    var recomentInfo = JSON.parse(sessionStorage.getItem('recomentInfo') ||'{"list":[]}')
    var shopData = JSON.parse(sessionStorage.getItem('shopData') || '{}')
    // 初始化页面
    function initHtml() {
        var shopData = JSON.parse(sessionStorage.getItem('shopData') || '{}')
        // 获取缓存的游玩人
        var ticketLinkMan = JSON.parse(sessionStorage.getItem("ticketLinkMan") || '{}')

        // 生成票型列表
        var html = orderTemplate({
            data:{list:shopData.list,ticketLinkMan:ticketLinkMan},
            render:true,
            mixin:'shopCarList'
        })

        // 价格
        var totalPrice = Number(shopData.money || 0)
        // 生成推荐
        console.log(recomentInfo.list.length)
        if(recomentInfo.list.length){
            html+=orderTemplate({data:{list:recomentInfo.list},render:true,mixin:'shopCarList'})
            totalPrice+=Number(recomentInfo.totalPrice || 0)
        }
        $(".shop-car-list").html(html)

        // 获取缓存取票人
        var takeTicketLinkMan = JSON.parse(sessionStorage.getItem('takeTicketLinkMan')||"[]")
        if(takeTicketLinkMan.length){
            var html = orderTemplate({
                data:takeTicketLinkMan,
                render:true,
                mixin:'takeTicketLinkMan'
            })
            $(".take-person-option").html(html)
        }
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

    // 选择游玩人/取票人 弹框
    var parentEle = '' //
    $("body").on("click",".chose-play-person",function (e) {
        // 获取已经选择的游玩人
        var linkManChecked=[]
        var comefrom = 'takePerson'// 判断是取票人还是游玩人，默认取票人，用于新增或编辑联系人时直接填充到订单页
        if($(this).parents(".ticket-type-box").length){
            // 游玩人
            parentEle = $(this).parents(".ticket-type-box")

            // 用于新增或编辑联系人时直接填充到订单页
            var ratecode = parentEle.data("ratecode")
            comefrom = ratecode

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
            if(data[0].status == 200){
                $("#linkManLayer").addClass("linkMan-layer-show");
                $("#mask").show();
                linkman = data[0].data
                var html = orderTemplate({
                    data:{
                        linkMan:linkman,
                        linkManChecked:linkManChecked,
                        comefrom:comefrom,
                    },
                    render:true,
                    mixin:'linkManList'
                })
                $("#linkManLayer").html(html)
            }else if(data[0].status == 400){
                window.location.href='/login?redir='+window.location.href
            }
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
        if (selectedPerson.length==0){
            return
        }
        // 填入对应的游客
        if(parentEle.find(".person-selected").length){
            // 购买实名制数量
            var amount = Number(parentEle.find(".ticket-amount-value").text()||0)
            // 缓存游客
            var ticketLinkMan = JSON.parse(sessionStorage.getItem("ticketLinkMan") || '{}')
            var ratecode = parentEle.data("ratecode")
            ticketLinkMan[ratecode] = selectedPerson
            sessionStorage.setItem('ticketLinkMan',JSON.stringify(ticketLinkMan))
            // 门票游玩人
            var html = orderTemplate({
                data:{selectedPerson:selectedPerson,amount:amount},
                render:true,
                mixin:'ticketLinkMan'
            })
            parentEle.find(".person-selected").html(html)
            // if(selectedPerson.length<amount){
            //     parentEle.find(".no-data").text('需选择'+(amount-selectedPerson.length)+'位游玩人')
            // }
        }
        else if(parentEle.find(".take-person-option").length){
            // 缓存取票人
            sessionStorage.setItem('takeTicketLinkMan',JSON.stringify(selectedPerson))
            // 取票人
            var html = orderTemplate({
                data:selectedPerson,
                render:true,
                mixin:'takeTicketLinkMan'
            })
            $(".take-person-option").html(html)
        }
    });
    // 删除
    $(".shop-car-list").on('click','.person-selected-delete',function (e) {
        console.log(123456789)
        var parantEle = $(this).parents(".ticket-type-box")
        $(this).parents('.person-selected-item').remove()
        var ratecode = parantEle.data("ratecode")
        var amount = Number(parantEle.find(".ticket-amount-value").text())
        // 清除对应的缓存
        // 缓存游客
        var selectedPerson = []
        parantEle.find('.person-selected-item').each(function () {
            var item = $(this).data("item")
            selectedPerson.push(item)
        })
        var ticketLinkMan = JSON.parse(sessionStorage.getItem("ticketLinkMan") || '{}')

        ticketLinkMan[ratecode] = selectedPerson
        sessionStorage.setItem('ticketLinkMan',JSON.stringify(ticketLinkMan))

        if(selectedPerson.length<amount){
            parantEle.find('.no-data').text('需再选择'+(amount-selectedPerson.length)+'位游玩人')
        }
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
            // 判断实名制票型，身份证号是否重复
            var personArr = []
            $(this).find(".person-selected-item").each(function () {
                var idCard = $(this).find('.person-selected-icard').text()
                if( personArr.indexOf(idCard)>-1){
                    checkPersonNum = true
                    message =ticketName+ '</br>身份证号（'+idCard+'）重复'
                    return false
                }else{
                    personArr.push(idCard)
                }
            })
            if(checkPersonNum){
                return false
            }


            if(personNum<buyNum){
                message =ticketName+ '</br>需选择'+buyNum+'位游玩人'
                checkPersonNum = true
                return false
            }
        })
        if(checkPersonNum){
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
        // if(sessionStorage.getItem('promoter')){
        //     var query = sessionStorage.getItem('promoter').substring(1);
        //     var vars = query.split("&");
        //     var promoter = {}
        //     for (var i=0;i<vars.length;i++) {
        //         var pair = vars[i].split("=");
        //         promoter[pair[0]] = pair[1]
        //     }
        //     params.channelId = promoter.channelId // 全渠道订单来源标识
        //     params.promoteSrcCode = promoter.promoteSrcCode // 全渠道订单来源
        // }
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
                pageSize:2,
                currPage:recomentListPages,
                rateCodes:rateCodes.join(','),
                orderSum:shopData.money
            },
            success: function (data) {
                if (data[0].status === 200 ) {
                    recomentListTotalPage = data[0].pages
                    $(".ticket-type-list").append(data[0].html)
                    computePrice()
                } else {
                    new ErrLayer({message:data[0].message})
                }
            },
            error:function (err) {
                console.log(err)
            }
        });
    }
    // 只有官网才有随意拼
    if ($(".recoment-ticket-box").length){
        getRecomentList()
    }
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
        // 已经优惠的
        var hasAccountMoney = 0
        // 还可优惠的价格
        var canAccountMoney = 0
        var totalPrice = 0
        var shopNum = 0
        var list = []
        $(".ticket-type-list .ticket-type-item").each(function () {
            // 单价
            var priceUnit = Number($(this).find(".price-num").text())

            // 展示价格
            var priceOld = Number($(this).find(".old-price-num").text())

            // 购买数量
            var buyNum = $(this).find(".buy-num").text()
            if(buyNum>0){
                var item = $(this).data('item')
                // 修改item字段和门票一致
                item.buyNum = buyNum
                // item.rateCode=item.code
                list.push(item)
                hasAccountMoney+=Number(buyNum*(priceOld-priceUnit))
                totalPrice+=Number(buyNum*priceUnit)
                shopNum+=Number(buyNum)

            }else{
                canAccountMoney+=Number(priceOld-priceUnit)
            }
        })

        recomentInfo.list = list
        recomentInfo.totalPrice = totalPrice
        recomentInfo.canAccountMoney = canAccountMoney
        recomentInfo.hasAccountMoney = hasAccountMoney

        // 缓存推荐
        console.log(recomentInfo)
        sessionStorage.setItem('recomentInfo',JSON.stringify(recomentInfo))

        // 总价
        $(".recoment-total-value").text(recomentInfo.totalPrice.toFixed(2))

        // 已惠价
        $(".has-discount-value").text(recomentInfo.hasAccountMoney.toFixed(2))

        // 还可优惠
        $(".discount-value").text(recomentInfo.canAccountMoney.toFixed(2))


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
