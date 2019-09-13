var btnFlag = true;

// window.onpopstate = function (event) {
//     $('#calendar, #ticketcalendar').removeClass('show');
//     if(history.state && history.state.page === 'calendar'){
//         $('#calendar, #ticketcalendar').addClass('show')
//     }
// };
// 重定向到https
function redirectHttps() {
    // var protocol = window.location.protocol;
    var hostname = window.location.hostname
    // if(hostname == 'localhost' || hostname == 'gqb.sendinfo.com.cn' || hostname == '192.168.66.111' ){
    //     return
    // }
    if(hostname=='wap.wuzhizhou.com'){
        var url = window.location.href;
        if (url.indexOf("https") < 0) {
            url = url.replace("http:", "https:");
            $("body").hide()
            window.location.replace(url);
        }
    }

}
redirectHttps()
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
$(function () {
    // 子元素scroll父元素容器不跟随滚动JS实现
    $.fn.uniqueScroll = function () {
        $(this).on('mousewheel', _pc)
            .on('DOMMouseScroll', _pc);

        function _pc(e) {

            var scrollTop = $(this)[0].scrollTop,
                scrollHeight = $(this)[0].scrollHeight,
                height = $(this)[0].clientHeight;

            var delta = (e.originalEvent.wheelDelta) ? e.originalEvent.wheelDelta : -(e.originalEvent.detail || 0);

            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                this.scrollTop = delta > 0 ? 0 : scrollHeight;
                e.stopPropagation();
                e.preventDefault();
            }
        }

        $(this).on('touchstart', function (e) {
            var targetTouches = e.targetTouches ? e.targetTouches : e.originalEvent.targetTouches;
            $(this)[0].tmPoint = {x: targetTouches[0].pageX, y: targetTouches[0].pageY};
        });
        $(this).on('touchmove', _mobile);
        $(this).on('touchend', function (e) {
            $(this)[0].tmPoint = null;
        });
        $(this).on('touchcancel', function (e) {
            $(this)[0].tmPoint = null;
        });

        function _mobile(e) {

            if ($(this)[0].tmPoint == null) {
                return;
            }

            var targetTouches = e.targetTouches ? e.targetTouches : e.originalEvent.targetTouches;
            var scrollTop = $(this)[0].scrollTop,
                scrollHeight = $(this)[0].scrollHeight,
                height = $(this)[0].clientHeight;

            var point = {x: targetTouches[0].pageX, y: targetTouches[0].pageY};
            var de = $(this)[0].tmPoint.y - point.y;
            if (de < 0 && scrollTop <= 0) {
                e.stopPropagation();
                e.preventDefault();
            }

            if (de > 0 && scrollTop + height >= scrollHeight) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    };
    $('.mask').uniqueScroll()
    // 百度统计
    var _hmt = _hmt || [];
    (function() {
        // 生产环境添加百度统计
        var hostname = window.location.hostname
        if(hostname == 'wap.wuzhizhou.com'){
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?ca42e0b7298e4a404b7bc0a8d133f595";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    })();


    // 响应式布局
    var winWidth = $(window).width();
    $("html").css("fontSize", (winWidth / 640) * 40 + "px");


    // 不知道什么鬼
    if ($('#details-tab').size() > 0) {
        tab("details-tab");
    }
  /*  //h5和小程序互跳21321
    var smallurl=window.location.href;
    console.log(smallurl)
    wx.miniProgram.postMessage({
        data: {
            title: '分享的标题',
            desc:'分享的描述',
            path:'/pages/share/share.js?data='+JSON.stringfy({url:encodeURIComponent(smallurl)})
        }
    });*/
    // 轮播
    if ($('#rec_slider').size() > 0) {
        $('#rec_slider').flexslider({
            animation: 'slide',
            controlNav: true,
            directionNav: true,
            animationLoop: true,
            slideshow: false,
            useCSS: false,
            slideshow: true,
            slideshowSpeed: 3500
        });
    }
    if ($('#tab').size() > 0) {
        tabs.init("tab");
    }
    if ($('.number').size() > 0) {
        if ($("#route-list").length > 0) {
            var totalp = 0;
            $(".route-price").each(function () {
                var price = $(this).find("strong").text();
                totalp = operation.accAdd(totalprice, price);
            });
            $("#totalprice").text(totalp);
            $('input[name=totalPrice]').val(totalp);
        }
        else {
            totalprice(1);
        }
        $(".number").numSpinner({
            min: 1,
            onChange: function (evl, value) {
                if ($("#route-list").length > 0) {
                    routetotalprice();
                }
                else {
                    totalprice(value);
                }
            }
        });
    }
    $("#mask").height($(document).height());
    $(".tips-wrapper").css("min-height", $(window).height());

    // pop tips
    $('.tips a').on('click', function () {
        $('.mask,.tips').hide();
    });



    sessionStorage.setItem('detailUrl', window.location.pathname + window.location.search);
    $('.back-bar').data('url', sessionStorage.getItem('listUrl'));

    $('.kefuBtn').click(function () {
        wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {

                //小程序
                var url = '../kefu/kefu';
                wx.miniProgram.navigateTo({url: url});
                return;
            }
        });
        if (!isWeiXin()) {
            window.location.href = 'https://wzzdlyq.qiyukf.com/client?k=9043442f1a44a1780180c5459734227c&wp=1';
        }

    });

});


var tabs = {
    init: function (divid) {
        $("#" + divid).find("a").click(function (e) {
            var itmeId = $(this).attr("href");
            if (itmeId.substr(0, 1) == "#") {
                e.preventDefault();
            }
            $(itmeId).addClass('active').siblings().removeClass("active");
            $(this).parent().addClass('active').siblings().removeClass("active");
        });
    }
};

/**
 *计算购买支付价格
 * @param {*购买数量} num
 * @param {*优惠券满减限制} fullCat
 * @param {*优惠券类型} couponType
 * @param {*优惠券券值} couponValue
 */
function totalprice(num) {
    var price = $("#price").text();
    var payPrice = $('.payPrice');
    var couponInfo = $('#couponInfo');
    var couponHandlePrice = $('.couponHandlePrice');
    var couponType, fullCat, couponValue;

    if (couponInfo) {
        couponType = couponInfo.data('T');
        fullCat = couponInfo.data('F');
        couponValue = couponInfo.data('V');
    }

    var _totalPrice = parseFloat(operation.accMul(price, num).toFixed(2));
    var _handledPrice = '';
    $("#totalprice").text(_totalPrice);
    $('#cost-dialog .cost-dialog-explian strong').text(_totalPrice);
    if (couponType && couponValue && (+_totalPrice >= fullCat)) {
        _handledPrice = (+couponType)
            ? (_totalPrice * ((+couponValue) / 10)).toFixed(2)
            : (_totalPrice - (+couponValue)).toFixed(2);

        payPrice.html(_handledPrice);

        var handlePrice = '';
        couponInfo.data('T') === '0'
            ? handlePrice = '- ' + couponInfo.data('V') + ' ='
            : handlePrice = '* ' + (couponInfo.data('V') / 10) + ' =';
        couponHandlePrice.html(handlePrice);

        $('input[name=totalPrice]').val(_handledPrice);

        return 1; //优惠券有效处理了价格
    } else {
        $('input[name=totalPrice]').val(_totalPrice);
        payPrice.html('');
        couponHandlePrice.html('');
        return 0; //没有用优惠券处理价格
    }
}

function routetotalprice() {
    var totalprice = 0;
    $(".number").each(function () {
        var val = $(this).val();
        var price = $(this).parent().next().find("strong").text();
        totalprice = operation.accAdd(totalprice, operation.accMul(val, price));
    });
    $("#totalprice").text(totalprice);
    $('input[name=totalPrice]').val(totalprice);
}

//四则运算
var operation = {
    accMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    accDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        // with (Math) {
        //     r1 = Number(arg1.toString().replace(".", ""));
        //     r2 = Number(arg2.toString().replace(".", ""));
        //     return (r1 / r2) * pow(10, t2 - t1);
        // }
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    accAdd: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    },
    accSub: function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        //last modify by deeka
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg2 * m - arg1 * m) / m).toFixed(n);
    }
};

function tab(id) {
    var touchObj = $("#" + id).find("a");
    $("#tab-panel").find(".details-tab-item:eq(0)").css("height", "auto");
    touch.on(touchObj, 'tap', function () {
        var index = $(this).parent().index(), divid = $(this).data("div");
        touchObj.removeClass("active");
        $(this).addClass("active");
        $("#tab-panel").css("margin-left", -(Math.round(index * 10000) / 100).toFixed(2) + '%').find(".details-tab-item").removeAttr("style");
        $("#" + divid).css("height", "auto");
    });
}

//  业务类型
function getModule(module) {
    var title = "";
    switch (module) {
        case "ticket":
            title = "景区";
            break;
        case "hotel":
            title = "酒店";
            break;
        case "route":
            title = "跟团游";
            break;
        case "line":
            title = "套票";
            break;
        case "cate":
            title = "餐饮";
            break;
        case "goods":
            title = "商品";
            break;
        case "raiders":
            title = "攻略";
            break;
        case "guide":
            title = "导游";
            break;
    }
    return title;
}

// 业务类型图标
function getIcon(m) {
    switch (m) {
        case 'park':
            return '<span class="order-info"><i class="font-icon icon-iconfont-menpiao"></i>' +
                '<em>景区';
            break;
        case 'hotel':
            return '<span class="order-info"><i class="font-icon icon-iconfont-jiudian"></i>' +
                '<em>酒店';
            break;
        case 'combo':
            return '<span class="order-info"><i class="font-icon icon-iconfont-ziyouxing"></i>' +
                '<em>套票';
            break;
        case 'shop':
            return '<span class="order-info"><i class="font-icon icon-iconfont-shouji3"></i>' +
                '<em>购物';
            break;
        case 'eatery':
            return '<span class="order-info"><i class="font-icon icon-iconfont-canting"></i>' +
                '<em>美食';
            break;
        case 'amuse':
            return '<span class="order-info"><i class="font-icon icon-iconfont-amuse"></i>' +
                '<em>娱乐';
            break;
        case 'traffic':
            return '<span class="order-info"><i class="font-icon icon-iconfont-amuse"></i>' +
                '<em>交通';
            break;
        case 'route':
            return '<span class="order-info"><i class="font-icon icon-iconfont-shouji5"></i>' +
                '<em>跟团游';
            break;
        case 'company':
            return '<span class="order-info"><i class="font-icon icon-iconfont-shouji32"></i>' +
                '<em>租车';
            break;
        case 'guide':
            return '<span class="order-info"><i class="font-icon icon-iconfont-zhanghu"></i>' +
                '<em>导游';
            break;
        default:
            return '<span class="order-info">' +
                '<em>';
            break;
    }
}

//  导游等级
function guideLevel(level) {
    switch (level) {
        case '铜牌':
            return '<i class="icon-guide-level3"></i>';
            break;
        case '银牌':
            return '<i class="icon-guide-level2"></i>';
            break;
        case '金牌':
            return '<i class="icon-guide-level"></i>';
            break;
    }
}

//  床型
function isBed(bed) {
    switch (bed) {
        case 0:
            return '大床';
            break;
        case 1:
            return '大床';
            break;
        case 2:
            return '大床';
            break;
    }
}

//  早餐
function isBreakfast(Breakfast) {
    switch (Breakfast) {
        case 0:
            return '单早';
            break;
        case 1:
            return '单早';
            break;
        case 2:
            return '单早';
            break;
    }
}

// 检测终端
function ispc() {
    var flag = true;
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
    //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
    if (system.win || system.mac || system.xll || system.ipad) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
}

//  跳转错误页面
function error() {
    window.location.href = '/error';
}

// 订单状态
function payStatus(s, m) {
    s = typeof s === 'string' ? parseInt(s) : s;
    switch (s) {
        case 0:
            return '待支付';
            break;
        case 1:
            return '待消费';
            break;
        case 2:
            return '交易成功';
            break;
        case 3:
            return '已退款';
            break;
        case 4:
            return '交易取消';
            break;
        case 5:
            return '待确认';
            break;

    }
}

// 退单状态状态
function refundStatus(s, m) {
    switch (s) {
        case 'TDDD':
            return '退单中';
            break;
        case 'TDCG':
            return '退单成功';
            break;
        case 'TDSB':
            return '退单失败';
            break;
        // refund_statys字段
        case 'TKCS':
            return '退款初始化';
            break;
        case 'TKDD':
            return '退单成功，等待退款';
            break;
        case 'TKCG':
            return '退款成功';
            break;
        case 'TKSB':
            return '退款失败';
            break;
        // audit_status
        case 'SHDD':
            return '等待审核';
            break;
        case 'SHCG':
            return '审核成功';
            break;
        case 'SHSB':
            return '审核驳回';
            break;
        // third_notice_flag
        case 'DDDSFTD':
            return '等待第三方退单';
            break;
        case 'DSFTDCG':
            return '第三方退单成功';
            break;
        case 'DSFTDSB':
            return '第三方退单失败';
            break;
    }
}

/**
 * 去除日历数据中的时间，保留日期
 * @param date (eg:2017-10-17 12:05:05)
 */
function dealTimeDate(date) {
    var dateArray = date.split(' ');
    return dateArray[0];
}

/**
 * 订单使用状态
 * @param t
 * @returns {*}
 */
function useStatus(t) {
    switch (t) {
        case '0':
            return '未使用';
            break;
        case '1':
            return '使用中';
            break;
        case '2':
            return '已使用';
            break;
        default:
            break;

    }
}

//对接全员营销 qyyxSrc
// (function() {
//     var hm = document.createElement("script");
//     hm.id = "statis-qyyx";
//     hm.src = "//qyyx.zhiyoubao.com/static/h-ui/js/pro.js?wuzhizhou";  //测试fx001   正式bxyfx  sdzgywzzd
//    // hm.src = "//qyyxcs.sendinfo.com.cn/static/h-ui/js/pro.js?sdzgywzzd";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(hm, s);
// })();

//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


// loadding层
function LoadingLayer(option) {
    this.mask = option && option.mask || false;
}
LoadingLayer.prototype = {
    constructor : 'LoadingLayer',
    loaddingDom : $('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'),
    maskDom: $('<div class="mask"></div>'),
    show: function () {
        this.loaddingDom.appendTo('body');
        if(this.mask){
            this.maskDom.appendTo('body').show();
        }
    },
    remove: function(){
        this.loaddingDom.remove();
        if(this.mask){
            this.maskDom.remove();
        }
    }
};

var loadding = new LoadingLayer();

// 错误提示层
function ErrLayer(option) {
    this.msg = option.message || '错误提示';
    this.timeOut = option.timeOut || 3500;
    this.layerDom = $('<div class="errTipLayer"></div>');
    this.init();
}

ErrLayer.prototype = {
    init: function () {
        var width = this.layerDom.appendTo('body').html(this.msg).outerWidth();
        this.layerDom.css('margin-left', 0).addClass('anim-opacity2');
        // this.layerDom.addClass('anim-opacity2');
        setTimeout(function () {
            this.layerDom.remove();
        }.bind(this), this.timeOut);
        return this
    }
};

// // 确认提示框
// function TipLayer(option) {
//     this.layerDom = $('<div class="searchLayer resultTipLayer">' +
//         '<i class="iconfont icon-warning tipWarning"></i>' +
//         '<span class="top-close"><i class="iconfont icon-iconfont-shibai"></i></span>' +
//         '<div class="tipMessage">' + option.message + '</div>' +
//         '<div class="btnBox"></div></div><div class="msgMask"></div>');
//     this.confirmBtn = $('<button class="submitBtn confirmBtn">' + (option.btnName || '确认') + '</button>');
//     this.cancelBtn = $('<button class="submitBtn cancelBtn">' + (option.btnName || '取消') + '</button>');
//     this.showCallBack = option.showCallBack || function () {};
//     this.closeCallBack = option.closeCallBack || function () {};
//     this.confirmCallBack = option.confirmCallBack || function () {};
//     this.init(option);
// }
//
// TipLayer.prototype = {
//     init: function (option) {
//         var that = this;
//
//         if(option.bottom || option.bottom===""){
//             // 如果自定义了底部
//             this.layerDom.find('.btnBox').append(option.bottom);
//         }else{
//             this.layerDom.find('.btnBox').append(this.confirmBtn);
//         }
//         if(option.class){
//             this.layerDom.eq(0).addClass(option.class)
//         }else{
//             this.layerDom.eq(0).removeClass(option.class)
//         }
//         if(option.topClose){
//             // 是否显示左上角关闭
//             this.layerDom.find('.top-close').show();
//             this.layerDom.find('.top-close').click(function (e) {
//                 that.close();
//             })
//         }else{
//             this.layerDom.find('.top-close').hide();
//         }
//         if(option.confirmType === 'confirm'){
//             this.layerDom.find('.btnBox').append(this.cancelBtn);
//         }
//         this.layerDom.appendTo('body');
//         this.confirmBtn.click(function () {
//             that.confirm();
//         });
//         this.cancelBtn.click(function () {
//             that.close();
//         });
//         this.show();
//         return this
//     },
//     confirm: function () {
//         this.close();
//         this.confirmCallBack();
//         return this;
//     },
//     show: function () {
//         this.layerDom.show();
//         this.showCallBack();
//         return this
//     },
//     close: function () {
//         this.layerDom.remove();
//         this.closeCallBack();
//         return this
//     }
// };
// 确认提示框
function TipLayer(option) {
    this.layerDom = $('<div class="searchLayer resultTipLayer">' +
        '<i class="iconfont icon-warning tipWarning"></i>' +
        '<div class="tipMessage">' + option.message + '</div>' +
        '<div class="btnBox"></div></div><div class="msgMask"></div>');
    this.confirmBtn = $('<button class="submitBtn confirmBtn">' + (option.btnName || '确认') + '</button>');
    this.cancelBtn = $('<button class="submitBtn cancelBtn">' + (option.btnName || '取消') + '</button>');
    this.showCallBack = option.showCallBack || function () {};
    this.closeCallBack = option.closeCallBack || function () {};
    this.confirmCallBack = option.confirmCallBack || function () {};
    this.init(option);
}

TipLayer.prototype = {
    init: function (option) {
        var that = this;
        this.layerDom.find('.btnBox').append(this.confirmBtn);
        if(option.confirmType === 'confirm'){
            this.layerDom.find('.btnBox').append(this.cancelBtn);
        }
        this.layerDom.appendTo('body');
        this.confirmBtn.click(function () {
            that.confirm();
        });
        this.cancelBtn.click(function () {
            that.close();
        });
        this.show();
        return this
    },
    confirm: function () {
        this.close();
        this.confirmCallBack();
        return this;
    },
    show: function () {
        this.layerDom.show();
        this.showCallBack();
        return this
    },
    close: function () {
        this.layerDom.remove();
        this.closeCallBack();
        return this
    }
};
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        btnFlag = false;
        loadding.show();
    },
    complete: function (data, status) {
        loadding.remove();
        btnFlag = true;
        // console.log(data.getAllResponseHeaders())
    },
    error: function (err) {
        console.log(err)
        if (err.status === 401) {
            location.href = '/login';
        }else {
            var message = typeof JSON.parse(err.responseText).message !== 'undefined' ? JSON.parse(err.responseText).message : '';
            message = message === 'Bad credentials' ? '帐号或密码错误' : message;
            var errTipLayer = new ErrLayer({
                message: message
            })
        }
    }
});

// 跳转链接replace history
function fnUrlReplace(eleLink) {
    if (!eleLink) {
        return;
    }
    var href = typeof eleLink === 'string' ? eleLink : eleLink.href;
    if (href && /^#|javasc/.test(href) === false) {
        if (history.replaceState) {
            // 生成新的URL
            history.replaceState(null, document.title, href.split('#')[0] + '#');
            location.replace('');       // 刷新当前页面URL
        } else {
            location.replace(href);     // 不生成新的历史记录
        }
    }
}
// 日期格式化
function formatDate(date, fmt) {
    if(typeof date == 'string' || typeof date == 'number'){
        date = new Date(date)
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt;
}
// 获取url参数
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
(function($){
    $.fn.parseForm=function(){
        var serializeObj={};
        var array=this.serializeArray();
        var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;s
    };
})(jQuery);
