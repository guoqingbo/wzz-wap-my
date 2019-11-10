$(function () {
    var smz = 1;
    var min_num = 4;

    var val = min_num;
    var idcard_html = '';

    $("#user").find("input").focus(function () {
        $(this).next("i").removeClass("icon-iconfont-xie").addClass("icon-iconfont-pxchaxian");
    }).blur(function () {
        $(this).next("i").removeClass("icon-iconfont-pxchaxian").addClass("icon-iconfont-xie");
    });
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        var windowHeight = document.documentElement.clientHeight;
        document.body.style.height = windowHeight + 'px';
    }

    var codeValid = $('#submitForm .input-box:first').validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            }
        }
    });

    var phonevalidator = $('#submitForm').validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            },
            checkCode: {
                required: true
            }
        }
    });
    // 发送验证码
    $('#getCodeBtn').on('click', function () {
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

    $("#phoneSave").click(function () {
        if (phonevalidator.form()) {
            $.post("/phoneSave", {
                    phone: $('#submitForm').find('input[name=loginName]').val(),
                    checkCode: $("input[name=checkCode]").val()
                }).success(function (data) {
                    var datas = data[0];
                    if (datas.status == 400) {
                        window.location.href = '/login';
                    } else if (datas.status == 200) {
                        $("#userInfo,.userInfomask").hide();
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                        $("input[name=teles]").val($('#submitForm').find('input[name=loginName]').val())
                    } else {
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }

                })
                .error(function (err) {
                    window.location.href = '/error';
                });
        }
    });

    /**
     * 绑定DOM节点；
     */
    var $ord = {
        form: $('#form'),
        formBtn: $('.formBtn'),
        beginDate: $('input[name=beginDate]'),
        endDate: $('input[name=endDate]'),
        price: $('#price'),
        infoAddress: $('#infoAddress'),
        expressPrice: $('#express_price'),
        totalPrice: $('#totalprice'),
        costDialog: $("#cost-dialog"),
        addressError: $('.address-error') //goods module
    };
    $ord.formBtn.removeClass('background-gray').on('click', subForm);
    var validator; //申明表单验证函数
    var goodsWayType = $("input[name='express']:checked").val(); //商品收货方式选择
    formValidate(goodsWayType);

    /**
     * 下单协议
     * @type {*|jQuery|HTMLElement}
     */
    if (module === 'ticket') {
        $("#mask-ticket").height($(document).height());
        var checkedBtn = $('#checkedBtn');
        var btn = $('.room-handle').find('a.fr');
        checkedBtn.unbind('click').click(function () {
            var checkBox = $(this).find('#check')
            var icon = $(this).find('i');

            if(checkBox.is(':checked')){
                checkBox.prop('checked', false);
                btn.addClass('gray_btn');
                icon.removeClass('checked')
            }else{
                icon.addClass('checked')
                checkBox.prop('checked', true);
                btn.removeClass('gray_btn')
            }
        });

        btn.click(function () {
            if (!$(this).hasClass('gray_btn')) {
                $(".ticket-layer,#mask-ticket").hide();
            }
        })

    }

    if (module === 'shop') {
        var orD = {
            _user: $('.get_express'),
            _getExpress: $('#get_express'),
            _getType: $('#get_type'),
            _getSelf: $('#get_self'),
            _getSelfPlace: $('#get_self_place'),
            _mask: $('#mask'),
            _takeLayer: $('#take_layer'),
            _target: $('#target')
        };

        // if (orD._getType.val() === '1')
        if (orD._getType.find("input[name='express']:checked").val() === '1') {
            orD._user.hide();
            $ord.expressPrice.hide();
            orD._getSelf.show();
        } else {
            orD._getSelf.hide();
            orD._user.show();
            $ord.expressPrice.show();
        }

        orD._getType.find("input[name='express']").on('change', function () {

            // $(this).find('option').each(function () {
            //     var _this = $(this);
            //     if (_this.prop('selected')) {
            //         goodsWayType = Number(_this.attr('data-index'));
            //     }
            // });

            goodsWayType = Number($(this).val());
            formValidate(goodsWayType);
            switch (goodsWayType) {
                case 0:
                    orD._getSelf.hide();
                    orD._user.show();
                    $ord.expressPrice.show();
                    break;
                case 1:
                    orD._user.hide();
                    $ord.expressPrice.hide();
                    orD._getSelf.show();
                    break;
                default:
                    break
            }
            addPosttagePrice( $('.numbernum').val() );
        });

        orD._getSelfPlace.click(function () {
            orD._mask.show();
            orD._takeLayer.show();
        });
        $(".mask,.close-take").click(function () {
            orD._mask.hide();
            orD._takeLayer.hide();
        });

        var _a = $(".take-tit a");
        _a.click(function () {
            orD._mask.hide();
            orD._takeLayer.hide();
            orD._getSelfPlace.find('.order-place-text').text($(this).parent().siblings(".take-add").find("p").html());
            orD._getSelfPlace.find('.order-text').val($(this).parent().siblings(".take-add").find("p").html());
        });

    }

    touch.on("#cost", "tap", function () {
        var height = $ord.costDialog.height();
        $("#mask").show();
        $ord.costDialog.css("margin-top", -height * 0.5).show();
    });
    $('#mask').click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $("#mask,#cost-dialog").hide();
        $("#linkManLayer").removeClass('linkMan-layer-show');
        if($("#calendar").length){
            $("#calendar").removeClass('show');
        }
    })

    // 日历选择
    var calendarDates = $("#calendar").data('dates');
    var initDom = function (date, tag) {
        var _price = 0,
            _stock = 0;
        if (!date) {
            if (tag) {
                $('#calendarTogg').unbind('click');
            }
            initNumber(0);
            return;
        }

        if (module === 'hotel') {
            var _a = date[0].currDate,
                _b = date[date.length - 1].currDate,
                _c;
            if (date.length > 1) {
                date.pop();
            }
            _c = date.length;

            for (var i = 0; i < date.length; i += 1) {
                _price += date[i].currPrice;
            }

            if (date.length > 1) {
                _stock = (date.reduce(function (prev, cur, index, array) {
                    return {
                        stock: Math.min(prev.leftSum || prev.stock, cur.leftSum)
                    };
                })).stock
            } else {
                _stock = date[0].leftSum
            }

            $ord.beginDate.val(_a);
            $ord.endDate.val(_b);
            $('#calendarTogg').text(_a + ' 至 ' + _b + '  ' + _c + '晚');
        } else if (module === 'traffic') {
            minNum = date.minNum;
            maxNum = date.maxNum;
            if (date.stockPriceMap.length) {
                _price = date.stockPriceMap[0].price;
                _stock = date.stockPriceMap[0].stock
            } else {
                $('.traffic-select').parent().html("暂无票型").css('color', '#f66')
            }
            $('input[name=id]').val(date.frequencyId);
        } else {
            _price = date.currPrice;
            _stock = date.leftSum;
            $('#calendarTogg span').text(date.currDate);
            $ord.beginDate.val(date.currDate);
            $ord.endDate.val(date.currDate);
        }

        if (_price) {
            $ord.price.text(_price);
            // initNumber(_stock, date);
            //roomSet==='F' 为不限量  为T等于限量

            if(date && date.roomSet){
                var isroomSet = false
                if(date instanceof Array){
                    isroomSet = date[0].roomSet==='F'&&(module==='hotel'||module==='combo'|| module==='repast')
                }else{
                    isroomSet = date.roomSet==='F'&&(module==='hotel'||module==='combo'|| module==='repast')
                }
                if(isroomSet){
                    initNumber(9999, date,date.roomSet);
                }else{
                    initNumber(_stock, date);
                }

            }else{
                initNumber(_stock, date);
            }
        } else {
            initNumber(0, date);
            $ord.price.text('暂无价格');
            $ord.formBtn.addClass('background-gray').unbind('click');
        }

    };
    $("#calendar").calendar({
        multipleMonth: 3,
        settingdata: calendarDates,
        multipleSelect: module === 'hotel' ? true : false,
        click: function (dates, dom) {
            console.log(dates)
            initDom(module === 'hotel' ? dates : dates[0]);
            if ($(dom).text().indexOf('无库存') === -1) {
                btnFlag = true;
                $('.btn-order.background-base').removeClass('background-gray').unbind('click', subForm).bind('click', subForm);
            }
            $('#mask').hide()
            $('#calendar').removeClass('show');
            //history.go(-1);
        }
    });

    $('#calendarTogg').on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        $("#calendar").addClass('show');
        $('#mask').show()
        var state = {
            page: 'calendar'
        };
        history.pushState(state,  document.title + '日期选择', location.href);
    });

    function localTime(t) {
        var _a = t.split('-');
        return new Date(_a[0], +_a[1] - 1, _a[2]).getTime();
    }

    // 初始化订单，默认为库存第一天
    if (module === 'ticket' || module === 'combo' || module === 'route' || module === 'car' || module === 'guide' || module === 'repast' || module === 'qr') {
        if (date) {
            var hasDate = false
            $.each(calendarDates, function (i) {
                if (calendarDates[i].currDate == date) {
                    initDom(calendarDates[i], 1);
                    hasDate = true
                }
            })
            if(!hasDate){
                initDom({currDate:date}, 1);
            }
        } else {
            initDom(calendarDates[0], 1);
        }

    } else if (module === 'hotel') {
        var reAr = [],
            _be = localTime(beginDate),
            _en = localTime(endDate),
            endArr = endDate.split('-'),
            cg_enDate;
        if (endArr[1] < 10) {
            cg_enDate = endArr[0] + '-' + '0' + endArr[1] + '-' + endArr[2];
        } else {
            cg_enDate = endDate;
        }
        if (calendarDates.length < 2) {
            let edObj = {
                currDate: cg_enDate
            }
            calendarDates.push(edObj);
        }
        calendarDates.map(function (item, index) {
            var _a = localTime(item.currDate.substr(0, 10));
            if (_be <= _a && _a <= _en) {
                reAr.push(item);
            }
        });

        initDom(reAr);
    } else if (module === 'traffic') {
        var _a = $('.traffic-select').find("option:eq(0)").data('stock');
        initDom(_a);
    } else {
        if (!$ord.price.text()) {
            $ord.price.html('暂无价格');
            $ord.formBtn.addClass('background-gray').unbind('click');
        } else {
            initNumber(stock);
        }

    }

    // 加入购物车和立即预定
    function subForm() {
        if (module === 'shop') {
            if(!goodsWayType){
                var _a3 = $('select[name=address3]');

                if (!_a3.val()) {
                    $ord.addressError.show();
                }
            }else{
                // var _a3 = $('input[name=address]');
                //
                // if (!_a3.val()) {
                //     $('#address-error').text("这是必填的!")
                //     $('#address-error').show();
                // }else{
                //     $('#address-error').hide();
                // }
            }

        }
        if (validator.form() && ($ord.addressError.is(':hidden') || !$ord.addressError.length)) {

            var cardArr = [],
                carTag = false;
            var errMsg = [];
            $ord.formBtn.addClass('background-gray').unbind('click');

            $('.card_box')
                .map(function (index, item) {
                    cardArr.push($(item).val());
                });

            cardArr
                .map(function (item, index) {
                    if (cardArr.indexOf(item) !== cardArr.lastIndexOf(item)) {
                        carTag = true;
                    }
                });

            // IdCard 1 出生日期,
            //     2 性别
            //     3 年龄
            var idNum = $('input[name=idNos]').val();
            var ageNum = idNum && IdCard(idNum, 3);
            var ageErr;
            if(minAge==0){
                ageErr=false;
            }else{
                ageErr = idNum && ageNum < +minAge || ageNum > +maxAge;
            }
            var sexErr = idNum && sex && IdCard(idNum, 2) !== sex;
            // if(closeTime!=null || closeTime!="" || closeTime!= undefined){
            //     //获取当前时分
            //     let time = new Date();
            //     let timeHour=time.getHours();//获取小时
            //     let timeMinute=time.getMinutes();//获取分钟
            //     let dqTime=timeHour+":"+timeMinute;
            //     console.log(dqTime.replace(":",""));
            // }
            carTag && errMsg.push('身份证不能相同');
            sexErr && errMsg.push('性别不符下单要求');
            ageErr && errMsg.push('年龄不符下单要求');


            if (carTag || ageErr || sexErr) {
                $('.tips p').html(errMsg.join('</br>'));
                $('.mask,.tips').show();
                $ord.formBtn.removeClass('background-gray').on('click', subForm);
                return;
            }

            var _b = ($(this)[0].tagName === 'A');
            //全员营销
            // var _url = _b
            //     ? module === 'shop'
            //         ? '/order/' + module + '?' + $ord.form.serialize() + '&paramExtension=' + goodsWayType+ '&promoteCode='+ promoteCode
            //         : '/order/' + module + '?' + $ord.form.serialize()+ '&promoteCode='+ promoteCode
            //     : '/order/addCart?' + $ord.form.serialize() + '&' + $('#cartForm').serialize()+ '&promoteCode='+ promoteCode;
            var _url = _b ?
                module === 'shop' ?
                '/order/' + module + '?' + $ord.form.serialize() + '&paramExtension=' + goodsWayType :
                '/order/' + module + '?' + $ord.form.serialize() :
                '/order/addCart?' + $ord.form.serialize() + '&' + $('#cartForm').serialize();

            var params = {}
            // if(sessionStorage.getItem('promoter')){
            //     var query = sessionStorage.getItem('promoter').substring(1);
            //     var vars = query.split("&");
            //     var promoter = {}
            //     for (var i=0;i<vars.length;i++) {
            //         var pair = vars[i].split("=");
            //         promoter[pair[0]] = pair[1]
            //     }
            //     params.channelId = promoter.channelId // 全渠道订单来源标识
            //     params.promoteSrcCode = promoter.promoteSrcCode // 全渠道订单来源
            // }

            if (hasLogin||leaguerId) {
                //已经登录直接提交订单
                $.post(_url,params)
                    .success(function (data) {
                        var datas = data[0];
                        if (datas.status === 200 && _b) {
                            window.location.href = '/pay/' + module + '/' + datas.data.orderInfos[0].orderNo;
                        } else if(datas.status == 400){
                            window.location.href = '/login?redir='+window.location.href;
                        } else {
                            $ord.formBtn.removeClass('background-gray').on('click', subForm);
                            $('.tips p').text(datas.message);
                            $('.mask,.tips').show();
                           /* $("<label id='linkMans-error' class='error' for='linkMans' style='display: inline-block;'>"+datas.message+"</label>").insertAfter(".order-item .order-text")*/
                        }
                    })
                    .error(function (err) {
                        error();
                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                    });
            } /*else {
                alert("2222");
                //没有提交订单，先免密登录再提交
                $.get('/fastregByAccount?loginName=' + $ord.form.find('input[name=teles]').val() +
                        '&realName=' + $ord.form.find('input[name=linkMans]').val() +
                        '&idcard=' + $ord.form.find('input[name=idNos]').val())
                    .success(function (data) {
                        if (data[0].status == 200) {
                            $.post(_url)
                                .success(function (data) {
                                    console.log(data);
                                    var datas = data[0];
                                    if (datas.status === 200 && _b) {
                                        window.location.href = '/pay/' + module + '/' + datas.data.orderInfos[0].orderNo;
                                    } else {
                                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                                        $('.tips p').text(datas.message);
                                        $('.mask,.tips').show();
                                    }
                                })
                                .error(function (err) {
                                    $ord.formBtn.removeClass('background-gray').on('click', subForm);
                                    error();
                                });
                        } else {
                            $('.tips p').text(data[0].message);
                            $('.mask,.tips').show();
                            $ord.formBtn.removeClass('background-gray').on('click', subForm);
                        }
                    })
                    .error(function (err) {
                        error()
                        $ord.formBtn.removeClass('background-gray').on('click', subForm);
                    })

            }*/
        }
    }

    // 初始化加減框
    function initNumber(stock, date,roomSet) {
        var _min = minNum || 1,
            _max = roomSet==='F'&&(module==='hotel'||module==='combo'|| module==='repast')?'9999':(maxNum || false);//roomSet==='F' 为不限量  为T等于限量
        if (!stock || +_min > +stock) {
            $("#numbernum").html('库存不足');
            $ord.formBtn.addClass('background-gray').unbind('click');
            routetotalprice();
        } else {
            if (isRealName === 'T') {
                intiUser(+_min);
            }
            if (module === 'hotel') {
                initOrderList(date, +_min)
            }
            var _dmin = _min,
                _dmax,
                _minx = {
                    min: _dmin,
                    onChange: function (evl, value) {
                        var _value = parseInt(value);
                        if (smz == 0) {
                            return;
                        }
                        if ($("#route-list").length > 0) {
                            routetotalprice();
                        } else {
                            if (isRealName === 'T') {
                                intiUser(+_value);
                            }
                            if (module === 'hotel') {
                                initOrderList(date, _value);
                            }
                            if (module === 'shop') {
                                var _areaCode = $ord.infoAddress.find('select').eq(1).val().split(',')[0];
                                getPostage(_areaCode, _value);
                                addPosttagePrice(_value);
                            } else {
                                totalprice(_value);
                            }

                        }

                    }
                };

            if (_max) {
                _dmax = Math.min(+_max, +stock);
            } else {
                _dmax = stock;
            }
            if (_dmax) {
                _minx.max = _dmax;
            }
            $('input[name=num]').val(_dmin);
            totalprice(_dmin);
            $("#numbernum").html($('<input>', {
                type: 'tel',
                value: _dmin,
                name: 'amount',
                class: 'numbernum'
            })).find('.numbernum').numSpinner(_minx);


        }
    }

    function initOrderList(date, num) {
        var _d = '';

        date.map(function (item, index) {
            _d += '<li>' + item.currDate +
                '<span class="fr price">' +
                '<em>￥</em>' +
                '<strong>' + item.currPrice + '</strong>  * ' +
                '<strong>' + num + '</strong>' +
                '</span>' +
                '</li>';
        });
        $('#cost-dialog #costList').html(_d);
    }

    // 实名制
    function intiUser(num,find) {
        var _userDom = '';
        listLinkManChecked=[];
        //for (var i = 1; i < num; i += 1) {
        if (parseInt(num) > 1&&find==='add') {
            _userDom += '<ul class="order-list myorder-list" id="numUser' + num + '">' +
                '<li>' +
                '<label for="" class="lab-title">游客' + (num) + '</label>' +
                '<div class="order-item">' +
                '<input id=linkName' + num + ' type="text" name="linkMans" value="" placeholder="请填写姓名"  class="order-text" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">' +
                '<i class="font-icon fr icon-iconfont-xie"></i>' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<label for="" class="lab-title">身份证</label>' +
                '<div class="order-item">' +
                '<input id=linkCard' + num + ' type="text" name="idNos" value="" placeholder="请填写身份证" class="order-text card_box" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">' +
                '<span class="c-price camera-text">' +
                '<input type="file" name="file" capture="camera" accept="image/*" onchange="imgUpload(this)" class="hide_file">' +
                '<i class="font-icon icon-iconfont-camera" style="margin-right: .1rem"></i>拍照识别</span>' +
                // '<i class="font-icon fr icon-iconfont-xie"></i>' +
                '</div>' +
                '</li>' +
                '</ul>';
            $('#userAuth').append(_userDom);
        } else if (parseInt(num) > 1&&find==='sub') {
            $('#numUser' + (num+1) + '').remove();

        }else{
            //$('#userAuth').html("");
            for (var i = 1; i < num; i += 1) {
                _userDom += '<ul class="order-list myorder-list">' +
                    '<li>' +
                    '<label for="" class="lab-title">游客' + (i + 1) + '</label>' +
                    '<div class="order-item">' +
                    '<input id=linkName' + i + ' type="text" name="linkMans" value="" placeholder="请填写姓名"  class="order-text" onkeyup="this.value=this.value.replace(/\\s+/g,\'\')">' +
                    '<i class="font-icon fr icon-iconfont-xie"></i>' +
                    '</div>' +
                    '</li>' +
                    '<li>' +
                    '<label for="" class="lab-title">身份证</label>' +
                    '<div class="order-item">' +
                    '<input id=linkCard' + i + ' type="text" name="idNos" value="" placeholder="请填写身份证" class="order-text card_box" onkeyup="this.value=this.value.replace(/\\s+/g,\'\')">' +
                    '<span class="c-price camera-text">'+
                    '<input type="file" name="file" capture="camera" accept="image/*" onchange="imgUpload(this)" class="hide_file">'+
                    '<i class="font-icon icon-iconfont-camera" style="margin-right: .1rem"></i>拍照识别</span>'+
                    // '<i class="font-icon fr icon-iconfont-xie"></i>' +
                    '</div>' +
                    '</li>' +
                    '</ul><div class="page-line"></div>';
            }
            $('#userAuth').html(_userDom);
        }
        //}
    }
    // 实名制
    // function intiUser(num) {
    //     var _userDom = '';
    //     listLinkManChecked=[];
    //     for (var i = 1; i < num; i += 1) {
    //         _userDom += '<ul class="order-list myorder-list">' +
    //             '<li>' +
    //             '<label for="" class="lab-title">游客' + (i + 1) + '</label>' +
    //             '<div class="order-item">' +
    //             '<input id=linkName' + i + ' type="text" name="linkMans" value="" placeholder="请填写姓名"  class="order-text">' +
    //             '<i class="font-icon fr icon-iconfont-xie"></i>' +
    //             '</div>' +
    //             '</li>' +
    //             '<li>' +
    //             '<label for="" class="lab-title">身份证</label>' +
    //             '<div class="order-item">' +
    //             '<input id=linkCard' + i + ' type="text" name="idNos" value="" placeholder="请填写身份证" class="order-text card_box">' +
    //             '<i class="font-icon fr icon-iconfont-xie"></i>' +
    //             '</div>' +
    //             '</li>' +
    //             '</ul><div class="page-line"></div>';
    //     }
    //     $('#userAuth').html(_userDom);
    // }

    // 交通选择票型
    $('.traffic-select').on('change', function () {
        var _a = $(this).find("option:checked").data('stock');

        initDom(_a);
    });

    // 省市区三级联动
    var _f = false;
    $ord.infoAddress.find('select').on('change', function () {
        domAddress($(this), _f);
        _f = true;
    });
    $ord.infoAddress.on('click', 'option', function () {
        $(this).parent().data('dname', $(this).text());
    });
    $ord.infoAddress.find('select').eq(0).trigger('change');

    function domAddress(th, _f) {
        var _areaCode = _f ? th.val().split(',')[0] : '',
            _p = _f ? '?parentCode=' + _areaCode : '',
            _d = _f ? th.next() : th,
            _name = _f ? th.attr('name') : '';


        th.nextAll().html('<option value="">选择</option>');

        $('.address-error').hide();


        $.get('/order/getAdress' + _p)
            .success(function (data) {
                data[0].data.map(function (item, index) {
                    var _o = '<option value="' + item.areaCode + ',' + item.areaName + '">' + item.areaName + '</option>';
                    if (index === 0) {
                        _d.html('<option value="">选择</option>' + _o);
                    } else {
                        _d.append(_o);
                    }
                });
            })
            .error(function (err) {

            });

        //查询邮费信息
        if (_name === 'address2') {
            var _number = $('#numbernum').find('.numbernum').val();
            getPostage(_areaCode, _number)
        }
    }

    function getPostage(areaCode, number) {
        $.get('/order/getPostage?areaCode=' + areaCode + '&modelCode=' + modelCode + '&amount=' + number)
            .success(function (data) {
                if (data[0].status == 200) {
                    var _string = data[0].data ?
                        '邮费：<em class="c-price">￥</em><i class="c-price">' + data[0].data + '</i>' :
                        '包邮';
                    $ord.expressPrice.html(_string);
                    addPosttagePrice(number)
                }

            })
            .error(function (err) {

            });
    }
    if(module==='shop'){
        getPostage('', $('.numbernum').val() );
    }

    function addPosttagePrice(num) {
        var price = $("#price").text();
        var _expressPrice = parseFloat($ord.expressPrice.find('i').text() || 0);
        // if( orD._getType.val() == '1')
        if( orD._getType.find("input[name='express']:checked").val() == '1'){
            _expressPrice=0;
        }
        var _totalPrice = parseFloat(operation.accMul(price, num).toFixed(2) || 0);
        $ord.totalPrice.html( (_expressPrice + _totalPrice).toFixed(2) )
    }

    function formValidate(goodsWay) {
        validator = $ord.form.validate({
            rules: {
                linkMans: {
                    required: true,
                    maxlength: 8,
                    han: true
                },
                teles: {
                    required: true, //isNeedMobile === 'T',
                    isMobile: true
                },
                idNos: {
                    required: isNeedIdcard === 'T'?false:isNeedIdcard === 'T',
                    isIdCardNo: true
                },
                street: {
                    required: !goodsWay,
                    isIllegalChar: true,
                    minlength: 2,
                    maxlength: 30,

                },
                address: {
                    required: !!goodsWay
                }
            }
        });

    }

    var linkManChecked = {
        id: '',
        linkMans: '',
        teles: '',
        idNos: ''
    },listLinkManChecked=[];
    $("#linkManBtn").click(function () {
        $.get('/member/linkMan', function (data) {
            if (data[0].status == 400) {
                window.location.href = '/login';
            } else {
                $("#linkManLayer").addClass("linkMan-layer-show");
                $("#mask").show();
                var res = data[0].data,
                    html = "";
                $.each(res, function (i) {
                    var checkName = ["", ""];
                    var idtrue = listLinkManChecked.filter(function (v) {
                        return v.id==res[i].id
                    });
                    if (idtrue[0]) {
                        checkName = ["checked", "icon-checkmark"];
                    }
                    html += "<li>" +
                        "<div class='linkMan-name'>" + res[i].linkmanName + "</div>" +
                        "<div class='linkMan-center'>" +
                        "<p>手机号：<span>" + res[i].phoneNo + "</span></p><p>身份证：<span>" + res[i].cardNo + "</span></p>" +
                        "</div>" +
                        "<div class='linkMan-check'><span data-id=" + res[i].id + " class='checkspan " + checkName[0] + "'><i class='" + checkName[1] + "'></i></span></div>" +
                        "</li>";
                });
                $(".linkMan-list").html(html)
            }
        }, 'json');
    });

    //单选改多选2018年10月16日11:32:59
    $(".linkMan-list").on('click', '.linkMan-check', function () {
        var allnum=$('.numbernum').val(), tnum= $('.linkMan-list').find('.checkspan.checked').length;
        if( $(this).find("span").hasClass('checked') ){
            $(this).find("span").removeClass("checked").find("i").removeClass("icon-checkmark");
        }else{
            if(!$('#userAuth').find('ul').length){
                $(".linkMan-list").find('.checkspan').removeClass('checked');
                $(".linkMan-list").find('.checkspan').find("i").removeClass("icon-checkmark");
                $(this).find("span").addClass("checked").find("i").addClass("icon-checkmark");
            }
            if( tnum < allnum ){
                $(this).find("span").addClass("checked").find("i").addClass("icon-checkmark");
            }
        }
        // linkManChecked.id = $(this).find("span").data("id");
        // linkManChecked.linkMans = $(this).parent().find(".linkMan-name").text();
        // linkManChecked.teles = $(this).parent().find(".linkMan-center").find("p:first").find("span").text();
        // linkManChecked.idNos = $(this).parent().find(".linkMan-center").find("p:last").find("span").text();
    });

    $("#enter").click(function () {
        $("#linkManLayer").removeClass('linkMan-layer-show');
        $("#mask").hide();
        var n=0; listLinkManChecked=[];
        $('.linkMan-list').find('li').each(function (i,v) {
            if($(v).find('.checkspan').hasClass('checked')){
                n=n+1;
                var _id= $(v).find(".checkspan").data("id"),
                    _linkMans = $(v).find(".linkMan-name").text(),
                    _teles = $(v).find(".linkMan-center").find("p:first").find("span").text(),
                    _idNos = $(v).find(".linkMan-center").find("p:last").find("span").text();
                listLinkManChecked.push({
                    id: _id,
                    linkMans: _linkMans,
                    teles: _teles,
                    idNos: _idNos
                });
                if(n===1){
                    $('.order-nl').find('input[name="linkMans"]').val(_linkMans);
                    $('.order-nl').find('input[name="teles"]').val(_teles);
                    $('.order-nl').find('input[name="idNos"]').val(_idNos);
                }else{
                    $('#userAuth').find('ul').each(function (i,v) {
                        if(n-2 === i){
                            $(v).find('input[name="linkMans"]').val(_linkMans);
                            $(v).find('input[name="idNos"]').val(_idNos);
                        }
                    });
                }
            }
        })
        // $("input[name='linkMans']").val(linkManChecked.linkMans);
        // $("input[name='teles']").val(linkManChecked.teles);
        // $("input[name='idNos']").val(linkManChecked.idNos);
    });
    $("#cancel").click(function () {
        $("#linkManLayer").removeClass('linkMan-layer-show');
        $("#mask").hide();
    });

    $('.linkMan-add').click(function (e) {
         e.preventDefault();
         location.href = this.href + '?originalUrl=' + location.href
    });
});

function IdCard(UUserCard, num) {
    if (num === 1) {
        //获取出生日期
        birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
        return birth;
    }
    if (num === 2) {
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
            //男
            return "X";
        } else {
            //女
            return "Y";
        }
    }
    if (num === 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}
//上传图片/视频
function imgUpload(t) {
    var file = t.files[0];
    ImgToBase64(file, 720, function (base64) {
        var imgCode= base64.split('base64,')[1];
        $(t).val('');
        $.ajax({
            type: 'POST',
            url: '/disPhoto',
            cache:false,
            data: { image: imgCode},
            beforeSend:function (e) {
                $('body').append('<div class="up-loading">识别中，请等待...</div>');
                $('body').find('.up-loading').addClass('show');

            },
            success: function (data) {
                $('body').find('.up-loading').removeClass('show');
                setTimeout(function () {
                    $('body').find('.up-loading').remove();
                },400);
                // console.log(data);
                // if (data[0].status === 200) {
                //     var info=JSON.parse(data[0].message);
                //     console.log(info);
                if(data.error_msg){
                    alert('识别有误');
                    return false
                }
                //插入数据
                var _name = data.words_result['姓名'].words
                    , _idCard = data.words_result['公民身份号码'].words
                if(!_name || !_idCard){
                    alert('身份证识别有误，请重新添加识别或手动添加');
                    return false
                }
                var flag=true
                $("input[name=idNos]").each(function(i){
                    if($(this).val()==_idCard){
                        alert('上传的身份证已存在');
                        flag=false;
                        return false
                    }
                });
                if(flag){
                    $(t).parents(".camera-text").prev().val(_idCard);
                    $(t).parents("ul").find("input[name=linkMans]").val($(t).parents("ul").find("input[name=linkMans]").val()||_name);
                }
                // } else {
                //     // alert('照片识别有误，请手动添加');
                //     alert(data[0].error)
                // }

            },
            error:function (err) {
                // alert('上传出错了');
                $('body').find('.up-loading').removeClass('show');
                setTimeout(function () {
                    $('body').find('.up-loading').remove();
                    alert('身份证识别有误，请手动添加');
                },400);

            }
        });
    });
};

function ImgToBase64(file, maxLen, callBack) {
    var img = new Image();

    var reader = new FileReader();//读取客户端上的文件
    reader.onload = function () {
        var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
        img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
    };
    img.onload = function () {
        //生成比例
        var width = img.width, height = img.height;
        //计算缩放比例
        var rate = 1;
        if (width >= height) {
            if (width > maxLen) {
                rate = maxLen / width;
            }
        } else {
            if (height > maxLen) {
                rate = maxLen / height;
            }
        };
        img.width = width * rate;
        img.height = height * rate;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var base64 = canvas.toDataURL('image/jpeg', 0.7);
        callBack(base64);
    };
    reader.readAsDataURL(file);
}
