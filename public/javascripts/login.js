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
    var codeValid = $('#submitForm .input-box:eq(0)').validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            }
        }
    });

    /**
     * 快捷登录规则
     */
    var validator2 = $('#submitLogin').validate({
        rules: {
            mobile: {
                required: true,
                isMobile: true
            },
            checkCode: {
                required: true
            }
        }
    });


    /**
     * 切换登录方式
     * @type {*|jQuery|HTMLElement}
     */
    var loginList = $('.login-list');
    $('#login_type').find('span').on('click', function () {
        var $this = $(this), index = $this.data('index');
        $this.siblings().removeClass('on');
        $this.addClass('on');
        loginList.hide();
        loginList.eq(index).show();
    });

    /**
     * 用户协议选择
     * @type {*|jQuery|HTMLElement}
     */
    var checkedBtn = $('#checkedBtn');
    checkedBtn.unbind('click').click(function () {
        var icon = $(this).find('i'),
            checkBox = $(this).find('input');

        icon.hasClass('checked')
            ? icon.removeClass('checked')
            : icon.addClass('checked');


        checkBox.is(':checked')
            ? checkBox.prop('checked', false)
            : checkBox.prop('checked', true)

    });

    /**
     * 发送验证码
     */
    $('#getCodeBtn').on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        if (codeValid.form()) {
            var sendType = $(this).data('type');
            // 快捷登录or注册
            var mobile = $('#submitLogin').find('input[name=mobile]').val() || $('#submitForm').find('input[name=loginName]').val();

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

    /**
     * 注册
     */
    $('#registerBtn').on('click', function () {
        if (validator.form()) {
            if ($('#check').is(':checked')) {
                $.get('/signIn?' + $('#submitForm').serialize())
                    .success(function (data) {
                        var datas = data[0];
                        if (datas.status === 200) {
                            window.location.href = '/member';
                        } else {
                            $('.tips p').text(datas.message);
                            $('.mask,.tips').show();
                        }
                    })
                    .error(function (err) {
                        window.location.href = '/error';
                    });
            } else {
                $('.tips p').text("请勾选注册协议");
                $('.mask,.tips').show();
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
        var promoter = sessionStorage.getItem('promoter')
        if(promoter) {
            promoter = JSON.parse(promoter)
            data.promoterId = promoter.promoterId
        }
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

    /**
     * 快捷登录
     */
    var submitLogin = $('#submitLogin');
    submitLogin.submit(function (e) {
        e.preventDefault()
        e.stopPropagation()
        if (validator2.form()) {
            var $this = $(this);
            var loginData = {
                mobile:$('input[name="mobile"]').val(),
                checkCode:$('input[name="checkCode"]').val(),
            };
            var promoter = sessionStorage.getItem('promoter')
            if(promoter) {
                promoter = JSON.parse(promoter)
                loginData.promoterId = promoter.promoterId
            }
            var url = $this.data('url');
            $.post('/phoneNumberLogin', loginData)
                .success(function (res) {
                    var datas = res[0];
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

    /**
     * 核对验证码
     */
    $('#checkCode').click(function () {
        var $this = $(this);
        if (validator.form()) {
            var url = $this.data('url');
            $.get('/checkPhoneCode?' + $('#submitForm').serialize())
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200) {

                        window.location.href = '/resetPassword?id='+datas.data.id;

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

    /**
     * 设置新密码
     */
    $('#setNewPassword').on('click', function () {
        var $this = $(this);
        if (validator.form()) {
            var _id = $this.data('id');
            $.get('/setNewPassword?leaguerId='+_id+'&'+ $('#submitForm').serialize())
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
        }
    })
});
