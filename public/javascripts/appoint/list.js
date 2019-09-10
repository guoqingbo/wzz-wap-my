// 响应式布局
var winWidth = $(window).width();
var rsize = GetQueryString('size') || 8;
rsize= rsize < 1 ? 1: ( rsize > 20 ? 20:rsize);
$("html").css("fontSize", (winWidth / 1920) * 100 + "px");
/*****
 * 考虑返回值错误与延迟时的第二次请求
 * *****/
;(function ($,window,document) {
    var laikySlide=function (ele,opt) {
        this.$element=ele;
        this.defaults={
            time: 5000,               //竖向轮播时间，竖向轮播结束，轮播项目
            updatime: 2500,           //数据更新时间
            itemHeight:'100'
        };
        this.options=$.extend({},this.defaults,opt)
    }, appPar={
        setIn : '',     //循环请求
         appList: [],   //列表
         appInfo: [],    //当前下标的详细 时端与预约人
         TSub: 0,        //横向切换的下标
         vSub: 0,        //竖向切换的下标
         vOutH: 0,       //已轮播的高
         viewh: 0
    },   anm, ups, ups2, upanm;  //定时上轮



    laikySlide.prototype ={
        Vslide:function () {
            var _t = this, _d= _t.$element, topH;
            clearTimeout(ups2);
            clearInterval(anm);

            var listH=[], listMax=0;
            $('#timelist').find('.time-item').each(function (i,v) {
                var vh=$(v).outerHeight(true);
                listH.push( vh );
                listMax+=Number(vh);
            });

            //竖向轮播
            _t.refreshData();//
            anm = setInterval(function () {
                var trs=true;
                topH = _t.Vheight(listH, listMax);
                // console.log(topH, "高");
                $('#timelist').css('top', -topH[0] );
                if(topH[1]){
                    clearInterval(anm);
                    if(topH[2]){
                        //当不用轮播, 轮播值为0，不延迟
                        _d.addClass('noAn').html('').css('top',0);
                        _t.Tslide();
                    }else {
                        ups2 = setTimeout(function () {
                            _d.addClass('noAn').html('').css('top', 0);
                            _t.Tslide();
                        }, _t.options.time);
                    }
                }
            }, _t.options.time);
        },
        Tslide: function(){
            //横向切换
            var _t = this, _d= _t.$element;
            appPar.TSub++;
            _t.updatings();
        },
        Vheight: function(lh,lm){
            var mh= appPar.viewh,
                cur = appPar.vSub,
                page = Math.ceil(lm/mh) ;
            appPar.vSub++;
            // console.log(appPar.vSub, page, mh, lm);
            return [ appPar.vSub*mh, (page<=1) ? true : (appPar.vSub>=page) , lm==0||page<=1 ||appPar.vSub>=page ]
        },
        Vheight2: function(lh){
            // console.log(appPar.vSub,'当前竖标');
            //mh窗口高 lh列表高集合 cur当前下标
            var mh= appPar.viewh,
                cur = appPar.vSub, nh=0 , bh=0, bn=0;
            //获取bn，最后一屏展示数量
            for(var i=lh.length-1; i>=0; i--){
                //根据最后一屏高度 能展示下的lh，去比对。
                if( (bh+lh[i]) < mh ){  //最后一块高度+上一块高度小于最后一屏高度
                    bh+=lh[i]; // 当前块高度+所有小于最后一屏的高度。
                    bn++;  //累加得出最后一屏展示几块。
                }
            }
            appPar.vOutH=0;
            for(var i=0;i<lh.length-bn; i++){
               if(cur<=i){
                    if( (nh+lh[i]) < mh ){
                        nh+=lh[i];
                        appPar.vSub=i+1;
                    }
               }
                //已轮播高度  ,  ----后续优化一块高度大于屏幕高度----
                if(cur>i){
                    appPar.vOutH+=Number(lh[i]);
                }
            }
            nh+= Number(appPar.vOutH);

            return [nh, (appPar.vSub >=lh.length-bn), nh==0]
        },
        ajaxList:function (cb) {
            var _t = this, _d= _t.$element;
            if(ups){
                clearTimeout(ups);
            }
            //请求项目列表
            $.ajax({
                type: "post",
                url: "/appointGetList",
                data: { screenCode : GetQueryString('screenCode')},
                success: function (data) {
                    if(data[0].status ===200){
                        if(data[0].data.length>0){
                            // var list = [{id:111},{id:222},{id:333}];
                            appPar.appList=data[0].data; //更新列表
                            _t.updatings( data[0].data );
                        }
                    }
                    else{
                        ups=setTimeout(function () {
                            _t.init();
                        },20000)
                    }
                },
                error: function (data) {
                    ups=setTimeout(function () {
                        _t.init();
                    },20000)
                }
            });

        },
        ajaxInfo:function(id,cb){
            var _t = this, _d= _t.$element;
            //请求数据详情
            $.ajax({
                type: "post",
                url: '/appointGetInfo',
                data: { id: id },
                success: function (data) {
                    if(data[0].status===200){
                        cb(data[0].data);
                    }else{
                        //请求错误,立即请求下一个
                        appPar.vSub=0;
                        appPar.TSub++;
                        _t.updatings();
                    }
                },
                error:function (data) {
                    //请求错误,立即请求下一个
                    appPar.vSub=0;
                    appPar.TSub++;
                    _t.updatings();
                }
            });
        },
        updatings: function () {
            var _t = this, _d= _t.$element;
            //appPar.TSub=0
            if(upanm){
                clearTimeout(upanm);
            }
            // console.log(appPar.TSub,  appPar.appList.length );
            if(appPar.TSub>=appPar.appList.length){
                _t.init();
                return;
            }
            //更新JSON
            _t.ajaxInfo(appPar.appList[appPar.TSub].projectId , function (data) {
                appPar.appInfo = data; //首次更新当前DOM

                var _html='', itemh= _t.options.itemHeight, itemf=(itemh*0.4).toFixed(0);
                var curApp=data.detailVos;
                $('.project-name').html(data.projectName);
                appPar.vSub=0;
                // if(curApp.length>0){
                    curApp.forEach(function (v) {
                        _html+=
                            '<li class="time-item">' +
                            '  <div class="time-title" style="height:'+itemh+'px; line-height:'+itemh+'px; font-size:'+itemf+'px; ">' +
                            '    <img class="title-icon" src="/images/appoint/time.png" />' +
                            '    <span class="appoint-lable">预约时间</span>' +
                                '<span class="appoint-lable2 labtime">'+v.beginTime+'-'+v.endTime+'</span>' +
                                '<img class="title-icon1" src="/images/appoint/icon2.png" />' +
                                '<img class="title-icon" src="/images/appoint/icon1.png" />' +
                                '<span class="appoint-lable">预约人数</span>' +
                                '<span class="appoint-lable2 labnum">'+v.orderNum+'人</span>' +
                            '</div>' +
                            '  <ul class="persom-list" style="padding-left:'+itemh+'px;">';
                        v.orderList.forEach(function (m) {
                            _html+='<li class="person-item" style="height:'+itemh+'px; line-height:'+itemh+'px; font-size:'+itemf+'px;">'+(m.name||m.ticketNo.substr(-6))+'</li>';
                        });
                        if(!v.orderList.length){
                            _html+='<li class="person-item" style="height:'+itemh+'px; line-height:'+itemh+'px;font-size:'+itemf+'px;">暂无预约人</li>';
                        }
                        _html+='  </ul>' +
                            '</li>';
                    });
                    _d.html(_html).removeClass('noAn');
                    _t.Vslide();
                // }else{
                //     //数据没有，请求下一个
                //     upanm=setTimeout(function () {
                //         appPar.TSub++;
                //         _t.updatings();
                //     }, _t.options.time );
                // }
            });
        },
        refreshData: function(){
            ///------更新时段数据，不处理新增时段（项目全部轮播一遍再进行处理）。
            var _t = this, _d= _t.$element;
            _t.ajaxInfo(appPar.appList[appPar.TSub].projectId,function (data) {
                appPar.appInfo = data; //每次轮播更新一次数据
                _d.find('.time-item').each(function (i,v) {
                    if(data[i]){
                        $(v).find('.labtime').text( data[i].beginTime+'-'+data[i].endTime );
                        $(v).find('.labnum').text(data[i].orderNum);

                        var _hl= '';
                        data[i].orderList.forEach(function (m) {
                            _hl+='<li class="person-item">'+(m.name||m.ticketNo.substr(-6))+'</li>';
                        });
                        if(!data[i].length){
                            _hl+='<li class="person-item">暂无预约人</li>';
                        }
                        $(v).find('.persom-list').html(_hl);
                    }
                });
            });

        },
        init :function () {
            //初始化
            //还原参数
            appPar={
                setIn : '',     //循环请求
                appList: [],   //列表
                appInfo: [],    //当前下标的详细 时端与预约人
                TSub: 0,        //横向切换的下标
                vSub: 0,        //竖向切换的下标
                vOutH: 0,       //已轮播的高
                viewh: 0
            };
            appPar.viewh= $('.appoint-list-box').outerHeight(true);
            var _t = this, _d= _t.$element;
            if (anm){
                clearInterval(anm);
            }
            _t.ajaxList();

        }
    };
    $.fn.laikySlide=function (options) {
        var lkySi= new laikySlide(this,options);
        lkySi.init();
    };

})(jQuery, window, document);


//获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
