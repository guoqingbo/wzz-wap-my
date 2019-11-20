$(function () {

    layer.open({
        content: '窗口未出票订单请在订单详情页预约'
        ,btn: '我知道了'
    });
    var projectId = $("input[name='projectId']").val();
    // //上传身份证(该方法已废弃)
    // $(".scan-card-btn").click(function (e) {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     $(this).next().trigger("click")
    // })
    // $(".ipnut-file").on("change",function () {
    //     var file = $(this).prop("files")[0];
    //     ImgToBase64(file)
    //         .done(function (base64) {
    //             var imgCode= base64.split('base64,')[1];
    //             baiduIdCardScan(imgCode)
    //                 .done(function (data) {
    //                     getTicketList(data)
    //                 })
    //         })
    //         .fail(function (error) {
    //             console.log(error)
    //         })
    // })
    //上传照片
    // // 获取图片Base64编码
    // // 调用百度ai，身份证卡片识别
    // function baiduIdCardScan(imgCode) {
    //     return $.ajax({
    //         type: 'POST',
    //         url: '/appoint/disPhoto',
    //         cache:false,
    //         data: { image: imgCode},
    //         beforeSend:function () {
    //             $('body').append('<div class="up-loading">识别中，请等待...</div>');
    //             $('body').find('.up-loading').addClass('show');
    //         },
    //     })
    // }
    var upload = {
        init:function () {
            $(".scan-card-btn").click(function (e) {
                $(this).next()[0].value = '';
                e.preventDefault();
                e.stopPropagation();

                $(this).next().trigger("click")
            })
            $(".ipnut-file").change(function () {
                // upload.readAndPreview($(this))
                var file =$(this).prop("files")[0];
                var field = $(this).attr("name") || "image";
                if(!file){
                    return
                }
                // 压缩图片
                upload.compressFile(file)
                    .then(function (file) {
                        // 检查文件大小
                        if(upload.checkFileSize(file)){
                            upload.files[field] = file
                            upload.sendFiles()
                                .then(function (res) {
                                    upload.sendSuccess(res)
                                })
                        }
                    })
            })
        },
        files:{},
        checkFileSize:function(file){
            var checkRes = true
            var fileSize = file.size/1024/1024
            var maxFileSize = 4
            if(fileSize>maxFileSize){
                 new ErrLayer({
                    message: '您上传的身份证图片大小为'+fileSize.toFixed(2)+'M，请选择小于'+maxFileSize+'M的图片'
                })
                checkRes = false
            }
            return checkRes
        },
        readAndPreview: function ($ele) {
            // 图片预览
            var file = $ele.prop("files")[0];
            var field = $ele.attr("name") || "image";
            // 支持的图片类型（可自定义）
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                // var reader = new FileReader();
                // reader.addEventListener("load", function () {
                //     // var image = new Image();
                //     // image.src = this.result;
                //     // // preview.append(image);
                //     // $ele.parent().find(".previe-box").html(image)
                //     // $("#showImg").attr('src',this.result)
                //
                //     // setTimeout(function () {
                //     //     //跳转到图片搜索页面
                //     //     window.location.href='/photo/search'
                //     // },500)
                // }, false);
                // reader.readAsDataURL(file);
                // 上传图片
                upload.files[field] = file
                // upload.sendFiles().then(function (res) {
                //     upload.sendSuccess(res)
                // })
                // upload.formData.append(field, files[0]);
            }else{
                new ErrLayer({
                    message:"请选择正确的图片格式"
                });
            }

        },
        sendFiles:function () {
            // 上传图片
            var formData = new FormData()
            for(var key in upload.files){
                formData.append(key, upload.files[key])
            }
            return $.ajax({
                url: '/appoint/disPhoto',
                type: 'post',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: "JSON",
                beforeSend:function () {
                    $('body').append('<div class="up-loading">识别中，请等待...</div>');
                    $('body').find('.up-loading').addClass('show');
                },
            });
        },
        imgToBase64:function(file) {
            var defer = $.Deferred();
            var reader = new FileReader();//读取客户端上的文件
            var img = new Image();// 压缩图片用
            reader.readAsDataURL(file);
            reader.onload = function () {
                //reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
                //  defer.resolve(reader.result)
                img.src = reader.result
            };
            // 压缩图片用
            img.onload = function () {
                //生成比例
                var winWidth = $(window).width();
                var width = img.width;
                var height = img.height;
                //计算缩放比例
                var rate = 1;
                if (width >= winWidth) {
                    // 手机默认拍摄的图片尺寸一般很大（>3000px），调整下图片大小
                    rate = winWidth / width;
                }
                img.width = width * rate;
                img.height = height * rate;
                //生成canvas
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var base64 = canvas.toDataURL('image/jpeg', 1);
                defer.resolve(base64)
        };
        return defer.promise()
    },
        //base64转换为Blob(即文件)
        dataURItoBlob:function(base64Data) {
            var byteString;
            if (base64Data.split(",")[0].indexOf("base64") >= 0){
                byteString = atob(base64Data.split(",")[1]);
            } else {
                byteString = unescape(base64Data.split(",")[1]);
            }
            var mimeString = base64Data
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
        },
        //压缩图片
        compressFile:function(file){
            var defer = $.Deferred();
            upload.imgToBase64(file).then(function (base64Data) {
                var file = upload.dataURItoBlob(base64Data)
                defer.resolve(file)
            })
            return defer
        },
        sendSuccess:function (res) {
            //图片上传
            getTicketListByIDCard(res)
        }
    }
    upload.init()
    // 根据身份证获取票型
    function getTicketListByIDCard(data) {
        $('body').find('.up-loading').remove();
        if(!data || data.error_msg || !data.words_result['公民身份号码'].words){
            return new ErrLayer({message: '无法识别身份证号，请重新上传'})
        }
        var params = {
            idCardNo:data.words_result['公民身份号码'].words,
            // leaguerCode:$(".leaguerId").val(),
            projectId:projectId
        }
        getTickitList(params)
    }
    // 根据辅助码获取票型
    function getTicketListByCode(data) {
        var params = {
            idCardNo:data.code,
            // leaguerCode:$(".leaguerId").val(),
            projectId:projectId
        }
        getTickitList(params)
    }

    // 获取票型
    function getTickitList(params){
        //插入数据
        $.ajax({
            type:"post",
            url:"/appoint/saveLeaguerProject",
            cache: false,
            data:params,
            success:function(data){
                if(data[0].status===200){
                    $(".appoint-ticket-list").html(data[0].html)
                }else{
                    new ErrLayer({message: data[0].message})
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    // 取消预约
    $("body").on("click",".cancel-appont-btn",function (e) {
        var params = {
            ticketNo:$(this).data("ticketno"),
            projectCode:projectId
        }
        $.post("/appoint/cancel",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                if(data[0].status == 200){
                    window.location.reload()
                }
             })
            .error(function (error) {
                console.log(error)
            })
    })

    // 选择票型
    $("body").on("click",".seleted-ticket",function (e) {
        e.preventDefault()
        e.stopPropagation()
        var checkbox = $(this)
        if(checkbox.hasClass("selected")){
            checkbox.removeClass("selected")
        }else{
            checkbox.addClass("selected")
        }

    })
    // 预约
    $(".appoint-btn").click(function(){
        var ticketNo = getTicketNo()
        if(ticketNo.length<=0){
            return new ErrLayer({message: "请选择票型"})
        }
        var params={
            projectDetailId:$(this).data("id"),
            projectinfoId:projectId,
            // ticketNo:ticketNo.join(",")
            ticketJson:JSON.stringify(ticketNo)

        };
        $.post("/appoint/saveProjects",params)
            .success(function (data) {
                new ErrLayer({message: data[0].message})
                setTimeout(function(){
                    window.location.reload()
                },1000)

            })
            .error(function (error) {
                console.log(error)
            })
    });
    // 获取选择预约的票型
    function getTicketNo(){
        var ticketNo = []
        $(".appoint-ticket-item .selected").each(function () {
            var ticketInfo = {
                ticketNo:$(this).data("ticketno"),
                ticketNum:1
            }
            ticketNo.push(ticketInfo)
            // ticketNo.push($(this).data("ticketno"))
        })
        return ticketNo
    }

    // 微信扫一扫
    // wx.config({
    //     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: wxShare.appid, // 必填，公众号的唯一标识
    //     timestamp: wxShare.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: wxShare.nonceStr, // 必填，生成签名的随机串
    //     signature: wxShare.signature,// 必填，签名，见附录1
    //     jsApiList: [
    //         "scanQRCode" //扫二维码
    //     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });
    $(".scan-code-btn").click(function () {
        if(typeof wxShare == 'undefined'){
            return new ErrLayer({message: "请使用微信浏览器扫码"})
        }
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {// 当needResult 为 1 时，扫码返回的结果
                geTicketInfo(res)
            }
        });
    })
    // 预约说明
    $(".appoint-notice-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var bookinformation = $(this).data("bookinformation")
        // layer.open({
        //     content:bookinformation
        //     ,btn: '我知道了'
        // });
        layer.open({
            title:'预约说明',
            anim:'up',
            content: bookinformation,
            className:'my-layer',
            // skin:'footer'
        })

    })
    // 查询辅助码
    $(".query-code-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        var content = '<div class="code-box">' +
            '<p>通过网上购买取票辅助码查询可预约票型</p>' +
            '<p class="code-tip">（刚购买订单需要5分钟后才可预约）</p>' +
            '<input class="code-input" value="" name="code" placeholder="请输入辅助码"/>' +
            '<p class="error-tip"></p>' +
            '</div>'
        var index = layer.open({
            className:'my-layer',
            content: content
            ,btn: ['查询', '取消']
            ,yes: function(index){
                // 获取当前辅助码
                var code = $('input[name="code"]').val()
                if(!code){
                    $(".error-tip").text('无当前辅助码记录，请确认输入正确')
                    return
                }else{
                    $(".error-tip").text('')
                }
                getTicketListByCode({code:code})
                layer.close(index);
            }
        });

    })
    // 根据二维码票型编码，查询票型信息
    function geTicketInfo(res){
        if(res){
            var str = res.resultStr
            var params = {
                ticketNo:str.substring(0,str.length-2),
                projectId:projectId
            }
            $.post("/appoint/ticketInfo",params)
                .success(function (data) {
                    if(data[0].status===200){
                        $(".appoint-ticket-list").html(data[0].html)
                    }else{
                        new ErrLayer({message: data[0].message})
                    }
                })
                .error(function (error) {
                    console.log(error)
                })
        }else{
            new ErrLayer({message: "未获取票型码"})
        }
    }
})
