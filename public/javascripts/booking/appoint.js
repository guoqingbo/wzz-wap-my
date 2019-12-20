$(function () {
    $("#calendar").calendar({
        multipleMonth: 3,
        settingdata: [],
        multipleSelect: false,
        click: function (dates, dom) {
            $('#mask').hide()
            $('#calendar').removeClass('show');
            $('.order-time').text(dates)
        }
    });
    $('#calendarTogg').on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        $("#calendar").addClass('show');
        $('#mask').show()
    });
    $('#mask').click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $("#mask").hide();
        if($("#calendar").length){
            $("#calendar").removeClass('show');
        }
    })
    var validate = $('#form').validate({
        rules: {
            linkName: {
                required: true,
                maxlength: 8,
            },
            linkMobile: {
                required: true, //isNeedMobile === 'T',
                isMobile: true
            },
        }
    });
    $(".btn-order").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var orderNo = $("input[name='orderNo']").val()
        var params = {
            orderNo:orderNo,
            travelDate:$(".order-time").text(),
            linkName:$("input[name='linkName']").val(),
            linkMobile:$("input[name='linkMobile']").val(),
        }
        if(validate.form()){
            $.post('/booking/saveAppoint',params)
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {
                        window.location.href = 'member/order/' + orderNo;
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
