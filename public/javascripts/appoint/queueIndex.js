$(function () {
    // 轮播图
    new Swiper('.wiper-container-ele', {
        loop: true,
        autoplay: 4000,
        pagination: '.swiper-pagination'
    });
    // 选项卡
    var mySwiper = new Swiper('.tab-content-list',{
        onSlideChangeStart: function (swiper) {
            $(".tab-select-item").eq(swiper.activeIndex).addClass('active').siblings().removeClass('active')
        }
    });

    $(".tab-select-item").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var index = $(this).index()
        $(this).addClass('active').siblings().removeClass('active')
        mySwiper.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
    })
})
