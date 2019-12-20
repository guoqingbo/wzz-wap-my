$(function () {
    $('#mask').click(function (e) {
        $(this).hide()
        $("#linkManLayer").removeClass("linkMan-layer-show");
    })

    // 选择游玩人/取票人 弹框
    $("#linkManBtn").click(function (e) {
        $.get('/member/linkMan',function (data) {
            if(data[0].status == 200){
                $("#linkManLayer").addClass("linkMan-layer-show");
                $("#mask").show();
                var linkman = data[0].data
                var html = orderTemplate({
                    data:{
                        linkMan:linkman,
                        linkManChecked:[]
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
        var item = $(".checkspan.checked").parents('.linkMan-item').data("item")
        $("input[name='linkMans']").val(item.linkmanName)
        $("input[name='teles']").val(item.phoneNo)
    });
    // 票型列表数量加减
    $('.sub-icon,.add-icon').click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var productEle = $(this).parents('.ticket-type-item')
        var buyNumEle =$('.buy-num')
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
        // 单价
        var priceUnit = Number($("#price").text())
        // 数量
        var num = Number($(".buy-num").text())
        var totalPrice = (priceUnit*num).toFixed(2)
        $("#totalprice").text(totalPrice)
        return totalPrice
    }
    var validate = $('#form').validate({
        rules: {
            linkMans: {
                required: true,
                maxlength: 8,
                han: true
            },
            teles: {
                required: true, //isNeedMobile === 'T',
                isMobile: true
            },
        }
    });
    $(".btn-order").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
         var params = {
             rateCode:$("input[name='rateCode']").val(),
             linkMans:JSON.stringify([$("input[name='linkMans']").val()]),
             teles:JSON.stringify([$("input[name='teles']").val()]),
             certType:$("input[name='certType']").val()
         }
        if(validate.form()){
            $.post('/booking/saveOrder',params)
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200 && _b) {
                        window.location.href = '/pay/' + module + '/' + datas.data.orderInfos[0].orderNo;
                    } else if(datas.status == 400){
                        window.location.href = '/login?redir='+window.location.href;
                    } else {
                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                        /* $("<label id='linkMans-error' class='error' for='linkMans' style='display: inline-block;'>"+datas.message+"</label>").insertAfter(".order-item .order-text")*/
                    }
                })
                .error(function (err) {
                    error();
                    $ord.formBtn.removeClass('background-gray').on('click', subForm);
                });
        }
    })
})
