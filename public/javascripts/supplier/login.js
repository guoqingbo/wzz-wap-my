$(function () {
    /**
     * 账号登录规则
     */
    var validator = $('#submitForm').validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            },
            loginPass: {
                required: true,
                rangelength: [6, 20]
            },
        }
    });

    /**
     * 账号登录
     */
    var submitForm = $('#submitBtn');
    submitForm.click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        // 获取全渠道缓存
        var data = {
            loginName:$('input[name="loginName"]').val(),
            loginPass:$('input[name="loginPass"]').val()
        };
        if (validator.form()) {
            $.post('/supplier/login', data)
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {
                        window.location.href = '/supplier/scanCode'
                    } else {
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err) {
                   console.log(err)
                });
        }
    });
});
