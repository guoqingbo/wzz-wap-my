$(function () {
    $('#calendarList li a, #swiperType .swiper-slide a').click(function (event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        var detailLoading = new LoadingLayer({mask:true});
        detailLoading.show();
        fnUrlReplace(this);
        return false;
    });

    // 搜索输入框获取焦点跳转到搜索页
    $("input[name='searchName']").focus(function (e) {
        window.location.href = '/detail/search'
    })
    //详情页搜索点击
    $(".searchBtn").click(function(){
       var classifyid=$(this).parent().find('.search').data("classifyid"),
           productcode=$(this).parent().find('.search').data('productcode'),
           // finddata=$(this).parent().find('.search').data('finddata'),
           searchName=$("input[name='searchName']").val();
       // window.location.href='/detail/ticket/'+productcode+'?classifyId='+classifyid+'&searchName='+searchName;
        window.location.href='/detail/ticket/'+productcode+'?searchName='+searchName;
    });





    $('.mask').click(function () {
        $('#mask').hide();
        $('.wxShare').hide();
        $("#ticketcalendar,#calendar").removeClass('show');
        $('.video-pop-box').hide()
    });

    // 分享
    $("#socialShare").socialShare({
        content: '',
        url: '',
        titile: ''
    });
    $("#shareQQ").on("click", function () {
        $(this).socialShare("tQQ");
    });
    /**
     * 详情页banner
     */
    var detailSwiper = new Swiper('#home_swiper', {
        loop: true,
        autoplay: 4000,
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction: false
    });
    var typeSwiper = new Swiper('#swiperType', {
        slidesPerView: 5,
        spaceBetween: 30,
    });
    var initDom = function (date) {
        var beginDate = date[0],
            numDays = date.length - 1,
            endDate = date[numDays];
        $.get('/detail/roomItems', {
            goodsCode: goodsCode,
            beginDate: beginDate,
            endDate: endDate,
            numDays: numDays
        })
            .success(function (data) {
                var datas = data[0];

                if (datas.status === 200) {
                    // $('.details-list').empty().append(listDom(datas.data, beginDate, endDate));
                    $('.details-list').empty().append(data[0].html);
                    $('#hotelCalendar span:eq(0)').html(beginDate);
                    $('#hotelCalendar span:eq(1)').html(endDate);
                    $('#hotelCalendar em').html(numDays);

                    $(".price-code-btn").click(function () {
                        $(this).toggleClass("down").parent().parent().nextAll().each(function () {
                            if (!$(this).hasClass("price-code")) {
                                return false;
                            }
                            $(this).toggle();
                        });
                    });

                    showDetail()

                } else {
                    window.location.href = '/error';
                }
                // history.go(-1);
            })
            .error(function (err) {
                window.location.href = '/error';
            })
    };

    $("#calendar").calendar({
        multipleMonth: 4,
        multipleSelect: true,
        click: function (dates) {
            initDom(dates);
            // history.go(-1);
            $("#calendar").removeClass('show');
            $('.mask').hide()
        }
    });

    $('#hotelCalendar').on('click', function () {
        $("#calendar").addClass('show');
        $("#mask").show();
        // var state = {
        //     page: 'calendar'
        // };
        // history.pushState(state, document.title + '日期选择', location.href);
    });

    var nowDate = new Date(),
        nextDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000),
        nowText = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate(),
        nextText = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate();

    var beginD = beginDate ? beginDate : nowText,
        endD = endDate ? endDate : nextText;

    if ($('#hotelCalendar').length) {
        initDom([beginD, endD]);
    }

    if ($('.showDetail').length) {
        showDetail()
    }

    $(".calendar-btn").click(function () {
        $("#ticketcalendar").addClass('show');
        $("#mask").show();
        // var state = {
        //     page: 'calendar'
        // };
        // history.pushState(state, document.title + '日期选择', location.href);
    });

    $("#ticketcalendar").calendar({
        multipleMonth: 4,
        click: function (dates) {
            // history.go(-1);
            loadding.show();
            // fnUrlReplace('/detail/ticket/' + goodsCode + '?classifyId=' + classifyId + '&date=' + dates);
            window.location.href = '/detail/ticket/' + goodsCode + '?classifyId=' + classifyId + '&date=' + dates
        }
    });
    // 视频弹框
    $("body").on('click','.audioDetail',function (e) {
        e.preventDefault()
        e.stopPropagation()
        var video = $(this).data("video")
        // $('.video-pop-box video').empty()
        // $('.video-pop-box video').append($("<source src="+ video +">"));
        // 不动态创建video的话，自动播放不起作用
        $('.video-pop-box video').remove()
        var videoEle = '<video controls="controls" style="width: 100%;object-fit: fill;height:8rem" src='+video+'></video>'
        $('.video-pop-box').append(videoEle)
        // $('.video-pop-box video source').attr('src',video)
        $('.video-pop-box').show()
        $('.video-pop-box video').trigger('play');
        $('.mask').show()
    })
    // 关闭视频
    $("body").on('click','.close-icon',function (e) {
        e.preventDefault()
        e.stopPropagation()
        $('.video-pop-box video').attr('src','')
        $('.video-pop-box').hide()
        $('.mask').hide()
    })

    // if(module == 'hotel'){
    //     new Swiper('.home_slider2', {
    //         loop: true,
    //         autoplay: 3000,
    //     });
    // }

});

function listDom(list, begin, end) {
    var dom = '',
        len = list.length;

    list.reverse();
    while (len--) {
        var _url = list[len].enabled ? 'href="/order/hotel/' + list[len].rateCode + '?beginDate=' + begin + '&endDate=' + end + '"' : 'class="gray_btn"';
        var ratecode = list[len].ratecodes, ratelength = ratecode.length;
        var handle = '<a ' + _url + '>预订</a>';
        if (ratelength > 0) {
            handle = '<a href="javascript:;" class="price-code-btn down"><i class="font-icon icon-iconfont-jiantou"></i></a>';
        }
        var imgurl = list[len].linkMobileImg || "#";
        dom += '<li>' +
            '<div class="pro-info">' +
            '<div class="pro-img">' +
            '<img src="' + imgurl + '" alt=""/>' +
            '</div>' +
            '<div class="hotel-info">' +
            '<h4 class="pro-info-title">' + list[len].modelName + '</h4>' +
            '<p class="pro-info-explian"><span>' + bedType(list[len].bedType) + '</span><span>' + list[len].buildingArea + 'm²</span><span><i class="font-icon"></i><i class="font-icon"></i></span></p>' +
            '<p class="pro-info-explian"><a class="showDetail" href="javascript:;"' + 'data-modelCode=' + list[len].modelCode + ' data-module= "hotel" ' + ' class="c-base">房型介绍></a></p>' +
            '</div>' +
            '</div>' +
            '<div class="pro-price c-base">' +
            '<span class="price"><em>￥</em><strong>' + (+list[len].currPrice).toFixed(2) + '</strong></span>' +
            '<span class="original-price"><em>￥' + (+list[len].priceShow || 0).toFixed(2) + '</em></span>' +
            '</div>' +
            '<div class="pro-price">' + handle +
            '</div>' +
            '<div class="ticket-layer">' +
            '<a href="javascript:;" class="close-ticket font-icon icon-iconfont-pxchaxian"></a>' +
            '<h3 class="notice-tit">' + list[len].modelName + '</h3>' + '<div class="ht-pic"></div>' +
            '<div class="article-info bgf">' +
            '<div class="article-main">' +
            '<ul class="order-list myorder-list">' +
            '<li><label for="" class="lab-title">床型</label><div class="order-item">' + bedType(list[len].bedType) + '</div></li>' +
            '<li> <label for="" class="lab-title">建筑面积</label> <div class="order-item"> <span>' + list[len].buildingArea + '㎡</span> </div> </li>' +
            '<li> <label for="" class="lab-title">房型描述</label><div class="order-item">' + list[len].modelDetail + '</div> </li>' +
            '</ul>' +
            '</div></div>' +
            '<div class="room-handle">' +
            '<p>价格<span class="price"><em>￥</em><strong>' + (+list[len].currPrice).toFixed(2) + '</strong></span> </p>' +
            '</div></div>' +
            '</li>';
        if (ratelength > 0) {
            $.each(ratecode, function (i) {
                dom += '<li class="price-code" style="display: none">' +
                    '<h4>' + ratecode[i].aliasName + '</h4>' +
                    '<div class="pro-price c-base">' +
                    '<span class="price"><em>￥</em><strong>' + ratecode[i].currentPrice + '</strong></span>' +
                    '<span class="original-price"><em>￥' + ratecode[i].priceShow + '</em></span>' +
                    '</div>' +
                    '<div class="pro-price">' +
                    '<a href="/order/hotel/' + ratecode[i].rateCode + '?beginDate=' + begin + '&endDate=' + end + '&productCode='+productCode+'">预订</a>' +
                    '</div>';
            });
        }
    }
    return dom;
}


function bedType(num) {
    var str = "";
    switch (num) {
        case '0':
            str = "大床";
            break;
        case '1':
            str = "双床";
            break;
        case '2':
            str = "三床";
            break;
    }
    return str;
}

/**
 * 查看详情
 */
var time1 = null
function showDetail() {
    var _showDetail = $('.showDetail'), _mask = $('#mask'), _ticketLayer = $('.ticket-layer');
    var dom;
    _showDetail.unbind('click').click(function (e) {
        var _this = $(this),
            modelCode = $(this).data('modelcode'),
        module = $(this).data('module') ? $(this).data('module') : '';
        if (module == 'hotel') {
            $.get('/detail/picture', {
                modelCode: modelCode,
                wayType: 2
            }).success(function (data) {
                // dom = '<div class="flexslider home_slider2">' +
                //     '<ul class="slides">';
                // for (var i = 0; i < data[0].data.length; i++) {
                //     dom += '<li><div class="slide"><img src="' + data[0].data[i].wapUrl + '" </div></li>'
                // }
                // dom += '</ul></div>';
                // dom = ''
                // for (var i = 0; i < data[0].data.length; i++) {
                //     dom += '<img src="'+data[0].data[i].wapUrl+'">'
                // }
                if(data[0].data.length){
                    dom = '<div class="home_slider2 swiper-container detail-container"><ul class="swiper-wrapper">'
                    for (var i = 0; i < data[0].data.length; i++) {
                        dom +='<li class="swiper-slide"><img src="'+data[0].data[i].wapUrl+'"></li>'
                    }
                    dom += '</ul></div>'
                    _this.parents('li').find('.ticket-layer').find('.ht-pic').html(dom);
                    new Swiper(_this.parents('li').find('.home_slider2'), {
                        loop: true,
                        autoplay: 2000,
                    });
                }

                _this.parents('li').find('.ticket-layer').addClass('show');

                // if(time1){
                //     clearTimeout(time1)
                // }
                // time1 = setTimeout(function () {
                //     _this.parents('li').find('.home_slider2').flexslider({
                //         animation: 'slide',
                //         controlNav: false,
                //         directionNav: false,
                //         animationLoop: true,
                //         useCSS: false,
                //         slideshow: true,
                //         slideshowSpeed: 2000
                //     });
                // },420);

                _mask.show();

            })
        } else {
            var ticketLayer = _this.parents('li').find('.ticket-layer')
            var sitem=ticketLayer.data(sitem).sitem
            ticketLayer.find(".article-main").html(sitem.modelExplain || sitem.content)
            ticketLayer.addClass('show');;
            // _this.parents('li').find('.ticket-layer').show();
            _mask.show();
        }
        e.stopPropagation();
        layerHeight(this,module);
    });

    _mask.click(function () {
        _ticketLayer.removeClass('show');
        // _ticketLayer.hide();
        $(this).hide();
    });

    $('.close-ticket').click(function () {
        _ticketLayer.removeClass('show');
        // _ticketLayer.hide();
        _mask.hide();
    });

    function layerHeight(t,module) {
        var _wh=$(window).height(), _ww= $(window).width();
        var tli=$(t).parents('li');
        var h = _wh*0.75 - _ww/640*40*4.6-1 - tli.find('.notice-tit').outerHeight( true )
        if(module=='hotel'){
            h =h- tli.find('.ht-pic').outerHeight( true )
        }
        tli.find('.article-info').height(h);
    }
}
