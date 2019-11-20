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
            password: {
                required: true,
                rangelength: [6, 20]
            },
            enterpassword: {
                equalTo: "#password"
            },
            checkCode: {
                required: true
            }
        }
    });

    /**
     * 账号登录
     */
    var submitForm = $('#submitForm');
    submitForm.submit(function () {
        var $this = $(this);
        // 获取全渠道缓存
        var data = {
            loginName:$('input[name="loginName"]').val(),
            loginPass:$('input[name="loginPass"]').val()
        };
        if (validator.form()) {
            var url = $this.data('url');
            $.post('/leaguerLogin', data)
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {
                        if (url) {
                            window.location.href = url;
                        } else {
                            window.location.href = '/';
                        }
                    } else {
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err) {
                    window.location.href = '/error';
                });
            return false;
        }
    });
});
