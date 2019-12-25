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
        var certType = item.linkmanType||'01'
        $("input[name='linkMans']").val(item.linkmanName)
        $("input[name='teles']").val(item.phoneNo)
        $("input[name='idNos']").val(item.cardNo)
        $('.cert-type').find('option[value="'+certType+'"]').attr("selected",true)
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
    var ruleBuy = $('#form').data('rulebuy')
    var validate = $('#form').validate({
        rules: {
            linkMans: {
                required: true,
                maxlength: 8,
                han: true
            },
            teles: {
                required: ruleBuy.isNeedMobile == 'T', //isNeedMobile === 'T',
                isMobile: true
            },
            idNos:{
                required: ruleBuy.isNeedIdcard == 'T', //isNeedMobile === 'T',
            }
        }
    });
    $(".btn-order").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var amount = $(".buy-num").text()
        if(amount<=0){
            $('.tips p').text('请选择购买数量');
            $('.mask,.tips').show();
            return
        }
         var params = {
             rateCode:$("input[name='rateCode']").val(),
             linkMans:$("input[name='linkMans']").val(),
             teles:$("input[name='teles']").val(),
             idNos:$("input[name='idNos']").val(),
             certType:$("select[name='certType']").val(),
             remark:$("textarea[name='remark']").val(),
             amount:amount
         }
        if(validate.form()){
            $.post('/booking/saveOrder',params)
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {
                        window.location.href = '/pay/booking/' + datas.data.orderInfos[0].orderNo;
                    } else if(datas.status == 400){
                        window.location.href = '/login?redir='+window.location.href;
                    } else {
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
        }
    })
})
//上传图片/视频
function imgUpload(t) {
    var file = t.files[0];
    ImgToBase64(file, 720, function (base64) {
        var imgCode= base64.split('base64,')[1];
        $(t).val('');
        $.ajax({
            type: 'POST',
            url: '/disPhoto',
            cache:false,
            data: { image: imgCode},
            beforeSend:function (e) {
                $('body').append('<div class="up-loading">识别中，请等待...</div>');
                $('body').find('.up-loading').addClass('show');

            },
            success: function (data) {
                $('body').find('.up-loading').removeClass('show');
                setTimeout(function () {
                    $('body').find('.up-loading').remove();
                },400);
                // console.log(data);
                // if (data[0].status === 200) {
                //     var info=JSON.parse(data[0].message);
                //     console.log(info);
                if(data.error_msg){
                    alert('识别有误');
                    return false
                }
                //插入数据
                var _name = data.words_result['姓名'].words
                    , _idCard = data.words_result['公民身份号码'].words
                if(!_name || !_idCard){
                    alert('身份证识别有误，请重新添加识别或手动添加');
                    return false
                }
                var flag=true
                $("input[name=idNos]").each(function(i){
                    if($(this).val()==_idCard){
                        alert('上传的身份证已存在');
                        flag=false;
                        return false
                    }
                });
                if(flag){
                    $(t).parents(".camera-text").prev().val(_idCard);
                    $(t).parents("ul").find("input[name=linkMans]").val($(t).parents("ul").find("input[name=linkMans]").val()||_name);
                }
                // } else {
                //     // alert('照片识别有误，请手动添加');
                //     alert(data[0].error)
                // }

            },
            error:function (err) {
                // alert('上传出错了');
                $('body').find('.up-loading').removeClass('show');
                setTimeout(function () {
                    $('body').find('.up-loading').remove();
                    alert('身份证识别有误，请手动添加');
                },400);

            }
        });
    });
};

function ImgToBase64(file, maxLen, callBack) {
    var img = new Image();

    var reader = new FileReader();//读取客户端上的文件
    reader.onload = function () {
        var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
        img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
    };
    img.onload = function () {
        //生成比例
        var width = img.width, height = img.height;
        //计算缩放比例
        var rate = 1;
        if (width >= height) {
            if (width > maxLen) {
                rate = maxLen / width;
            }
        } else {
            if (height > maxLen) {
                rate = maxLen / height;
            }
        };
        img.width = width * rate;
        img.height = height * rate;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var base64 = canvas.toDataURL('image/jpeg', 0.7);
        callBack(base64);
    };
    reader.readAsDataURL(file);
}
