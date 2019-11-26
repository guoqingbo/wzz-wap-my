$(function () {
    $('.login-out-btn').click(function () {
        new TipLayer({
            message: '确认要退出登录',
            confirmType: 'confirm',
            confirmCallBack: function () {
                $.post('/supplier/loginOut')
                    .success(function (res) {
                        new ErrLayer({
                            message: '退出成功'
                        });
                        window.location.href = '/supplier/login'
                    })
                    .error(function (err) {
                        console.log(err)
                    });
            }
        })
    })
})
