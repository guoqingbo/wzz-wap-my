$(function(){

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        var windowHeight = document.documentElement.clientHeight;
        document.body.style.height = windowHeight + 'px';
    }
   //tab折页
    var index= $(".tripTitle .on").index();
    $(".trip-tab .trip-con").eq(index).show().siblings().hide();
    $(".plan-foot").css("display","none");


    $(".tripTitle .tripMsg").click(function(){
        $(".tripTitle .tripMsg").removeClass("on");
        $(this).addClass("on");
        var on = $(this).index();
        $(".trip-tab .trip-con").eq(on).show().siblings().hide();

        if(on=='0'){
            $(".plan-foot").css("display","none");
        }else{
            $(".plan-foot").css("display","block");
            if($(".foot-con span").length===0){
                $(".foot-con").css("height","0");
            }else{
                $(".foot-con").css("height","3rem");
            }
        }
    });
    //规划行程结构
    function buildSelectedData() {
        var user_picks = [];
        $('.hdUl').each(function () {
            var contained_item = [];
            var picked_item = [];
            var category = $(this).data("category");
            $(this).find('li').each(function(){
                var id = $(this).data("projectid");
                contained_item.push(id);
                if($(this).hasClass('on')) {
                    picked_item.push(id)
                }
            });
            user_picks.push({
                category: category,
                contained_item: contained_item,
                picked_item: picked_item
            })
        });
        return user_picks;
    }

   //行程规划 js
    $(".hdUl li").click(function(){
        var hdname = $(this).find(".trip-hdName").text();
        var projectId = $(this).data("projectid");
        $(".foot-con").css("height","3rem");
        if(!$(this).hasClass("on")){
             $(this).addClass("on");
             var html ='<span class="close"><label data-projectId="'+projectId+'">'+hdname+'</label><img src="/images/index/active.png"></span>'
             $(".foot-con").append(html);
        }else{
             $(this).removeClass("on");
             $(".foot-con span").each(function(){
                 var name = $(this).find("label").data("projectid");
                 if(projectId === name){
                     $(this).remove();
                 }
             })
        }
    });

    $(".foot-con").on('click','.close',function(){
       var name = $(this).find("label").data('projectid');
       $(this).remove();
       $(".hdUl .on").each(function(){
          var projectid = $(this).data('projectid');
          if(name === projectid){
              $(this).removeClass("on");
          }
       });

    });

    $(".plan-foot-btn").click(function(){
        //行程规划所需要的json
        var user_picks = buildSelectedData();

        if(!$(".hdUl li").hasClass("on")){
            layer.open({
                content: "项目不能为空"
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }
        $.ajax({
            type:"post",
            url:"/projectPlan",
            data:{userPickJson:JSON.stringify(user_picks)},
            success:function(data){
                var len=data[0].data;
                if(data[0].status===200){
                    layer.open({
                        content: data[0].message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href="/myTrip"
                    },2000);

                }else{
                    layer.open({
                        content: data[0].message
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            },
            error:function(err){
                layer.open({
                    content: data[0].message
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        })
    });

   //去规划行程
    $(".my-tripGo").on('click',function(){
         $(".tripTitle .tripMsg").eq(0).removeClass("on");
         $(".tripTitle .tripMsg").eq(1).addClass("on");
         $(".trip-tab .trip-con").eq(0).css("display","none");
         $(".trip-tab .trip-con").eq(1).css("display","block");
         $(".plan-foot").css("display","block");

    });

    var even=[],evenparams;
    $(".guide-ul").on('click',' .guide-li',function(){
        if($(this).hasClass("on")&& !$(this).find("img").hasClass("chooseJzgx")){
            $(this).find(".chooseImg").css("display","block");
            $(this).find(".chooseActive").css("display","none");
            $(this).removeClass("on");

            var index=$(this).index();
            var guideN=$(this).find(".guide-num").text();
            for(var i=0;i<even.length; i++){
                var evenN=even[i];
                if(guideN==evenN){
                    even.splice(i,1);
                }
            }

        }else if(!$(this).hasClass("on")&& !$(this).find("img").hasClass("chooseJzgx")){
            $(this).find(".chooseImg").css("display","none");
            $(this).find(".chooseActive").css("display","block");
            $(this).addClass("on");
            var ticketNo=$(this).find(".guide-num").text();
            $(".guide-li.on").each(function(){
                for(var i=0;i<=even.length; i++){
                    var evenN=even[i];
                    if(ticketNo!=evenN){
                        evenparams=ticketNo;
                        even.join(evenparams);
                    }
                }
            });
            even.push(evenparams);
        }
    });

    $(".yuyue-btn").click(function(){
       var projectDetailId=$(this).parent().find(".yyId").val(),projectinfoId=$(".projectId").val(),ticketNo,leaguerCode=$(".leaguerId").val();
       if($(".guide-ul .guide-li").hasClass("on")){
           var datas={
               projectDetailId:projectDetailId,
               projectinfoId:projectinfoId,
               ticketNo:even.join(','),
               leaguerCode:leaguerCode
           };
           /*$.ajax({
               type:"post",
               url:"/saveProjects",
               data:datas,
               success:function(data){
                   console.log(data);
                   if(data[0].status===200){
                       layer.open({
                           content: data[0].message
                           ,skin: 'msg'
                           ,time: 2 //2秒后自动关闭
                       });
                       window.location.href=window.location.href;
                   }else{
                       layer.open({
                           content: data[0].message
                           ,skin: 'msg'
                           ,time: 2 //2秒后自动关闭
                       });
                   }
               },
               error:function (err) {
                   console.log(err);
               }
           })*/
           //询问框
           layer.open({
               content: '您是否确认预约当前项目？'
               ,btn: ['预约', '取消']
               ,shadeClose: false
               ,yes: function(index){
                   //location.reload();
                   layer.close(index);
                   $.ajax({
                       type:"post",
                       url:"/saveProjects",
                       data:datas,
                       success:function(data){
                           if(data[0].success===true){
                               layer.open({
                                   content: data[0].message
                                   ,skin: 'msg'
                                   ,time: 2 //2秒后自动关闭
                               });
                               setTimeout(function(){
                                   window.location.href=window.location.href;
                               },2000)

                           }else{
                               layer.open({
                                   content: data[0].message
                                   ,skin: 'msg'
                                   ,time: 2 //2秒后自动关闭
                               });
                           }
                       },
                       error:function (err) {
                           console.log(err);
                       }
                   })
               }
           });
       }else{
           layer.open({
               content: '请选择票型'
               ,skin: 'msg'
               ,time: 2 //2秒后自动关闭
           });
       }
    });

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
                    if(!data || data.error_msg){
                        layer.open({
                            content: "识别有误"
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                        return false
                    }
                    //插入数据
                    var cardCodeId,
                        _idCard = data.words_result['公民身份号码'].words,
                        leaguerCode=$(".leaguerId").val(),
                        projectId=$(".projectId").val();
                    if(!_idCard){
                        layer.open({
                            content: "身份证识别有误，请重新添加识别"
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                        return false
                    }
                    var flag=true;
                    if(flag){
                        $.ajax({
                            type:"post",
                            url:"/saveLeaguerProject",
                            cache: false,
                            data:{idCardNo:_idCard,leaguerCode:leaguerCode,projectId:projectId},
                            success:function(data){
                                var data=data[0];
                                if(data.status===200){
                                    var len=data.data;
                                    var html="";
                                    var guideId,barcode,barcodes;
                                    $(".guide-ul").css("height","5rem");
                                    if($(".guide-li").length>0){
                                        $(".guide-ul .guide-li").each(function(i,ele){
                                            guideId = $(ele).find(".guideId").val();
                                            barcode= $(ele).find(".guide-num").text();
                                            len.forEach(function (elem,index) {
                                                barcodes = elem.barcode;
                                                if (barcode === barcodes && guideId=== elem.fnumber) {
                                                    len.splice(index,1);
                                                }
                                            });
                                        });
                                        for(var i=0; i<len.length;i++){
                                            html+='<li class="guide-li"><input type="hidden" value='+len[i].fnumber+' class="guideId"><span class="guide-num '+(len[i].status==="2"? 'guide-old':'' )+'">'+len[i].barcode+'</span>'+
                                                '<span class="guide-inpt">'+(len[i].status==="2"? '<img class="chooseJzgx" src="/images/index/jzgx.png">':'<img class="chooseImg" src="/images/index/chooseImg.png"><img class="chooseActive" src="/images/index/chooseActive.png">')+'</span>' +
                                                '</li>';
                                        }
                                        $(".guide-ul").append(html);

                                    }else{
                                        for(var i=0; i<len.length;i++){
                                            html+='<li class="guide-li"><input type="hidden" value='+len[i].fnumber+' class="guideId"><span class="guide-num '+(len[i].status==="2"? 'guide-old':'' )+'">'+len[i].barcode+ '</span>'+
                                                '<span class="guide-inpt">'+(len[i].status==="2"? '<img class="chooseJzgx" src="/images/index/jzgx.png">':'<img class="chooseImg" src="/images/index/chooseImg.png"><img class="chooseActive" src="/images/index/chooseActive.png">')+'</span>' +
                                                '</li>';
                                            cardCodeId=len[0].fnumber;
                                        }
                                        $(".guide-ul").append(html);
                                    }

                                }else{
                                    layer.open({
                                        content: data.message
                                        ,skin: 'msg'
                                        ,time: 2 //2秒后自动关闭
                                    });
                                }
                            },
                            error:function(err){
                                console.log("err",err);
                            }

                        })
                    }

                },
                error:function (err) {
                    console.log(err)
                    $('body').find('.up-loading').removeClass('show');
                    setTimeout(function () {
                        $('body').find('.up-loading').remove();
                        layer.open({
                            content: "身份证识别有误，请重新添加识别"
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                    },400);

                }
            });
        });
    };

    // var defer = $.Deferred();
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
            var base64 = canvas.toDataURL('image/jpeg', 0.6);
            callBack(base64);
            // defer.resolve(base64)
        };
        reader.readAsDataURL(file);
        // return defer.promise()
    }
});

