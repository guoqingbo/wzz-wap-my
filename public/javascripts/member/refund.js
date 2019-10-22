$(function (){
   var refundSum=JSON.parse($(".refundSum").val()),refundSumArr=[],refundSumId;
   var refundNums=$("input[name='refundAmount']").val();
   if(refundSum){
      for(var i=0;i<refundSum.length;i++){
          refundSumId=refundSum[i].id;
      }
       refundSumArr.push(refundSumId);
   }
   var data={
       ids:refundSumArr.join(","),
       nums:refundNums
   };
   //退款金额
    $.ajax({
        url:'/member/refundSum',
        type:"post",
        data:data,
        success:function(data){
            if(data[0].status===200){
                $("#refundPrice").html(data[0].data);
            }else{
                $("#refundPrice").html(0);
            }

        }
    });

    var validator = $('#form').validate({
        rules: {
            reason: {
                required:true,
                // minlength: 4,
                // maxlength:200
            }
        }
    });

    // 提交参数
    $('a.btn').on('click',function (){
        postForm($(this))
    });

    function postForm(that){
        if (validator.form()){
            that.addClass('background-gray').off('click');
            // var data = $('#form').serialize();
            var data = $('#form').parseForm();
            data.refundDetailJson = [];
            if(data.idNo&&module==="combo"){
                var orderDetailModelIdJson =JSON.parse(data.idNo);
                var orderDetailModelIdArry=[],orderDetailModelId;
                for(var i=0;i<orderDetailModelIdJson.length; i++){
                    orderDetailModelIdArry.push(orderDetailModelIdJson[i].id);
                }
                orderDetailModelId=orderDetailModelIdArry.join(',');
            }
            if(data.idNo&&module!="combo"){
                var orderDetailModelIdArry=[],orderDetailModelId,isCheck,id;
                $(".smz-li").each(function(index,ele){
                    isCheck=$(this).find(".smzCheck");
                    if(isCheck.is(":checked")){
                        id=isCheck.data("id");
                        orderDetailModelIdArry.push(id);
                    }
                });
                orderDetailModelId=orderDetailModelIdArry.join(',');
            }
            if(data.isRealName==="true"&&module==="combo"){
                $('.refund-item').each(function () {
                    data.refundDetailJson.push({
                        orderDetailId: $(this).data('id'),
                        refundAmount: $(this).find("input[name='refundAmount']").val(),
                        orderDetailModelId:orderDetailModelId
                    })
                });
            }else if(data.isRealName==="true"&&module!="combo"){
                $('.refund-item').each(function () {
                    data.refundDetailJson.push({
                        orderDetailId: $(this).data('id'),
                        refundAmount: $(this).find("input[name='refundAmount']").val(),
                        orderDetailModelId:orderDetailModelId
                    })
                });
            }else{
                $('.refund-item').each(function () {
                    data.refundDetailJson.push({
                        orderDetailId: $(this).data('id'),
                        refundAmount: $(this).find("input[name='refundAmount']").val()
                    })
                });
            }
            data.refundDetailJson = JSON.stringify(data.refundDetailJson);
            $.post('/member/refund/' + module, data)
                .success(function (data){
                    var datas = data[0];
                    var _txt = data[0].message || '提交成功';
                    $('.tips p').text(_txt);
                    $('.mask,.tips').show();
                })
                .error(function (err){
                    that.removeClass('background-gray').on('click',postForm);
                    window.location.href = '/error';
                });
        }
    }

    $('.tips a').on('click',function (){
		window.location.href = '/member/order/' + orderNo;
	});

    /**
     * 初始化数量加减
     */
    var refundNum = $('.refundNums');
    refundNum.each(function () {
        var min = $(this).data('min');
        var max = $(this).data('max');
        refundNum.numSpinner({
            min: min,
            max: max,
            onChange: function (evl, num) {
                //退款金额
                $.ajax({
                    url:'/member/refundSum',
                    type:"post",
                    data:{ids:refundSumArr.join(","), nums:num},
                    success:function(data){
                        var price = data[0].data;
                        if(data[0].status===200){
                            $('#refundPrice').text(price)
                        }else{
                            $('#refundPrice').text(0)
                        }
                    }
                });
            }
        });
    });
});
