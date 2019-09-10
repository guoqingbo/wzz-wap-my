$(function(){

     $(".yh-now").click(function(){
        var couponCode= $(".yh-code").val();

        if(couponCode===""){
            layer.open({
                content: "优惠券不能为空"
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
            return false;
        }

        $.ajax({
            type:"post",
            url:"/coupon/exchange",
            data:{couponCode:couponCode},
            success:function(data){
                if(data[0].success===true||data[0].status===200){
                    $(".yh-useBtn").css("display","block");
                    $(".yh-code").val("");
                    layer.open({
                        content:"兑换成功"
                        , skin: 'msg'
                        , time: 2 //2秒后自动关闭
                    });
                }else{
                    $(".yh-useBtn").css("display","none");
                    layer.open({
                        content:data[0].message
                        , skin: 'msg'
                        , time: 2 //2秒后自动关闭
                    });
                }
            }
        })

     })



});
