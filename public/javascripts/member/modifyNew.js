$(function(){
    var validator = $('#form').validate({
        rules: {
            loginName:{
                required: true,
            },
            password:{
                required: true,
                rangelength: [6, 20],
                regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/
            },
            checkCode:{
                required: true,
            }
        },
        messages:{
            loginName:{
                required:"手机号码不能为空，请完善手机号",
            },
            password:{
                required:"新密码不能为空",
            },
            checkCode:{
                required:"验证码不能为空",
            },
        }
    });
    var codeValid = $('#form .input-box:eq(0)').validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            }
        }
    });

    /**
     * 发送验证码
     */
    $('#getCodeBtn').on('click', function () {
        if (codeValid.form()) {
            var sendType = $(this).data('type');
            // 快捷登录or注册
            var mobile = $('#form').find('input[name=loginName]').val();

            $.post('/checkCode', {
                sendType: sendType,
                mobile: mobile
            }).success(function (data) {
                var datas = data[0];
                $('.tips p').text(datas.message);
                $('.mask,.tips').show();
            })
                .error(function (err) {
                    window.location.href = '/error';
                });
        }
    });
    //修改密码
    $('#setNewPassword').on('click',function(){
        if (validator.form()){
            $.get('/checkPhoneCode?' + $('#form').serialize())
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {
                        $.get('/setNewPassword?'+ $('#form').serialize())
                            .success(function (data) {
                                var datas = data[0];
                                if (datas.status === 200) {
                                    window.location.href = '/login';
                                } else {
                                    $('.tips p').text(datas.message);
                                    $('.mask,.tips').show();
                                }
                            })
                            .error(function (err) {
                                window.location.href = '/error';
                            });

                    } else {
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err) {
                    window.location.href = '/error';
                });




        }
    })
});
