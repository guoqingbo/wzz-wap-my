$(function(){
    var paymold=$("#pay-mold").find("a");
    touch.on(".toogleli","tap",function(){
        $(this).parents('.order-list').prev('.orderDetails').slideToggle();
        $(this).find("a").toggleClass("arrow-down");
        $(this).parent().toggleClass("arrow-down");
    });

    // 阻止多次点击去支付
    $('#toPayBtn').click(function (e) {
        e.preventDefault();
        var paytype = $("#pay-mold li.active").data('paytype');
        var item = $(this).data('item');
        var payUrl = '/pay/'+item.orderType+'?payOrderNo='+ item.payOrderNo +'&orderNo='+item.orderNo+'&paySum='+item.paySum+'&orderInfo='+ item.orderInfo+'&payType='+ paytype;
        if(paytype == 42){
            // 如果是银联支付
            payUrl +='&amount='+item.amount
        } if(paytype == 41){
            // 如果是银联支付
            payUrl +='&amount='+item.amount
        }
        // $('#toPayBtn').attr('href',payUrl);
        // var payUrl = $(this).attr('href');
        var flag = $(this).data('flag');
        if(!flag){
            $(this).data('flag', true);
            window.location = payUrl;
        }
    });

    $("#pay-mold li").click(function () {
        $(this).addClass('active').siblings("li").removeClass('active')
    })
    // touch.on(paymold,'tap',function(event){
    //     paymold.find(".icon-iconfont-gougou").removeClass("c-base");
    //     $(this).find(".icon-iconfont-gougou").addClass("c-base");
    //     $(this).addClass("c-base");
    // });
});
