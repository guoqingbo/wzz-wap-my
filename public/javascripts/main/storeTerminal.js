$(function () {
    // 判断是否存储全渠道参数
    function storeQuanQudao(){
        // 获取url后的参数
        var query = window.location.search;
        // 判断推广码存不存在
        if(query && /promoteSrcCode/.test(query)){
            sessionStorage.setItem('mainParam',query)
        }else{
            var query1 = sessionStorage.getItem('mainParam')
            if(query1){
                window.location.href = window.location.href+query1
            }
        }
    }
    storeQuanQudao()
    /**
     * banner
     */
    var bannerSwiper = new Swiper('#banner_swiper', {
        loop: true,
        autoplay: 4000,
        pagination: '.swiper-pagination'
    });

    var carouselSwiper = new Swiper('#carousel_swiper', {
        loop: true,
        //autoplay: 4000,
        pagination: '.swiper-pagination'
    });
    /**
     *顶部公告 轮播
     */
    var addSwiper = new Swiper('#shuffling_ann', {
        direction: 'vertical',
        loop: true,
        autoplay: 4000
    });

    /**
     * 广告位 轮播
     */

    var advSwiper = new Swiper('#adv_swiper', {
        loop: true,
        autoplay: 4000,
        pagination: '.swiper-pagination'
    });
    /**
     * 广告位 公告
     */
    var newsSwiper = new Swiper('.news-box',{
        direction: 'vertical',
        loop: true,
        autoplay: 3000,
        speed:600,
        autoplayDisableOnInteraction : false //操作完后不禁止动画
    });
    /**
     * 活动轮播
     * @type {*|t}
     */
    var activeSwiper = new Swiper('#active_swiper', {
        slidesPerView: 2.2,
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });

    /**
     * 分区推荐
     * @type {*|jQuery|HTMLElement}
     */
    var navLi = $('.fq-recommend-nav li');
    var tabsSwiper = new Swiper('#fq_swiper', {
        paginationClickable: true,
        loop : true,
        autoHeight: true,
        onSlideChangeStart: function(Swiper){
            var thisnum=$('.fq-img-list .swiper-slide-active').attr('data-swiper-slide-index');
            navLi.removeClass('on');
            navLi.eq(thisnum).addClass('on');

        }
    });
    touch.on(navLi,'tap', function () {
        if(!$(this).hasClass("on")){
            $(".fq-recommend-nav .on").removeClass('on');
            $(this).addClass('on');
            tabsSwiper.slideTo($(this).index() + 1);
        }
    });

    /******************************************************************************************************************
     * 点击事件
     ******************************************************************************************************************/

    /**
     * 点击搜索门票
     */
    touch.on($('#searchBtn'),'tap', function (e) {
        e.stopPropagation();
        var searchName = $(this).siblings('input').val();
        window.location.href = '/list/ticket?searchName='+searchName;
    })

});


