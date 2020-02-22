$(function (){
    // 表单验证
    var type = $(".cert-type").find("option:selected").text();
    var validator = $('#form').validate({
        rules: {
            realName: {
                required:true,
                maxlength:8
            },
            cardType:{
                required:true,
            },
            idcard: {
                required:true,
                isIdCardNo: true
            },
            tel: {
                required:true,
                isMobile:true
            },
            loginName:{
                required:true,
                maxlength:8
            },
            loginPass:{
                required:true,
                rangelength: [6, 20]
            },
            newPass:{
                required: true,
                rangelength: [6, 20],
                regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/
            },
            enterpassword:{
                equalTo: "#newPass"
            },
            email: {
                required:true,
                email:true
            },
            name: {
                required:true,
                han:type == '身份证',
                // maxlength:8
            },
            charNo: {
                required:true,
                isIdCardNo: type == '身份证'
            },
            phone: {
                required:true,
                isMobile:true
            }
        }
    });

    $(".cert-type").change( function() {
        var type = $(this).find("option:selected").text();
        $("input[name=charNo]").rules("remove");
        $("input[name='name']").rules("remove");
        if(type=="身份证"){
            $("input[name=charNo]").rules("add", {required:true, isIdCardNo: true});
            $(".camera-text").show()
            $("input[name=name]").rules("add", {required:true, han: true});
        }else{
            $("input[name=charNo]").rules("add", {required:true});
            $(".camera-text").hide()
            $("input[name=name]").rules("add", {required:true});
        }
        $("input[name='charNo']").focus().blur()
        $("input[name='name']").focus().blur()
    });
    var submitResult=false;

    // 发布评论
    $('.btn-handle').find("a").on('click',function (){
        if (validator.form()){
            $.post('/member/modify?'+ $('#form').serialize())
                .success(function (data){
                    var datas = data[0];
                    if (datas.status === 200){
                        window.location.href = '/member/user';
                    }else{
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err){
                    window.location.href = '/error';
                });
        }
    });
    var temperatureUrl = ''
    if($(".linkMan-modify-btn").length){
        temperatureUrl= $(".temperatureUrl").attr('src') || ''
    }
    // 新增或修改联系人
    function addOrModifyLinkMan(type){
        console.log(type)
        var url = '/member/linkMan/add'
        var healthStr = {
            // 健康信息
            origin:$("select[name='origin']").val(),
            habitation:$("select[name='habitation1']").val()+"-"+$("select[name='habitation2']").val()+"-"+$("select[name='habitation3']").val(),
            address:$("input[name='address']").val(),
            goHainanTime:$(".come-time").data('date'),
            temperature:$("input[name='temperature']").val(),
            temperatureUrl:temperatureUrl,
            health:$("select[name='health']").val(),
            contactHubei:$("input[name='contactHubei']:checked").val()
        }
        var params = {
            charNo:$("input[name='charNo']").val(),
            name:$("input[name='name']").val(),
            phone:$("input[name='phone']").val(),
            certType:$("select[name='certType']").val(),

            healthStr:JSON.stringify([healthStr])
        }
        if(type == 'modify'){
            params.id = $("input[name='id']").val()
            url = "/member/linkMan/modify"
        }else{
            if(!$("input[name='isReal']").is(':checked')){
                return new ErrLayer({
                    message:"未保证以上所填写内容真实有效"
                });
            }
        }
        if (validator.form()){
            $.post(url, params)
                .success(function (data){
                    if (data[0].status === 200){
                        var originalUrl = getQueryVariable('originalUrl')
                        var comefrom = getQueryVariable('comefrom')

                        var linkMan = data[0].data
                        // 如果存在comefrom，字段则是从订单页添加联系人，要自动填充到订单页对应的联系人
                        if(comefrom == 'takePerson'){
                            // 取票人
                            // 缓存取票人
                            sessionStorage.setItem('takeTicketLinkMan',JSON.stringify([linkMan]))

                        }else if (comefrom == 'promoter'){
                            originalUrl = '/member/linkMan/list?originalUrl='+originalUrl+'&comefrom=promoter'
                        }else{
                            // 游玩人
                            // 获取缓存的游玩人
                            var ticketLinkMan = JSON.parse(sessionStorage.getItem("ticketLinkMan") || '{}')
                            ticketLinkMan[comefrom] = [linkMan]
                            // 缓存游玩人
                            sessionStorage.setItem('ticketLinkMan',JSON.stringify(ticketLinkMan))
                        }
                        window.location.href = originalUrl || '/member/linkMan/list';
                    }else{
                        $('.tips p').text(data[0].message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err){
                    window.location.href = '/error';
                });
        }
    }

    //新增常用联系人
    $(".linkMan-btn .submit-btn").click(function(){
        addOrModifyLinkMan()
    })


    // 获取省市区
    function getAddress(parentCode,cb){
        $.get('/order/getAdress',{parentCode:parentCode||''})
            .success(function (data) {
                cb(data)
            })
            .error(function (err) {

            });
    }
    getAddress('',function (data) {
        data[0].data.map(function (item, index) {
            // 如果是修改页面
            var selected = ''
            if($(".linkMan-modify-btn").length){
                var origin = $(".come-from").data('origin')
                var value = item.areaCode + ',' + item.areaName
                if(origin == value){
                    selected = 'selected'
                }
            }
            var _o = '<option value="' + value + '" '+selected+'>' + item.areaName + '</option>';
            if (index === 0) {
                $('.come-from').html('<option value="">选择</option>' + _o);
            } else {
                $('.come-from').append(_o);
            }
        });
    })
    getAddress(460000,function (data){
        data[0].data.map(function (item, index) {
            // 如果是修改页面
            var selected = ''
            if($(".linkMan-modify-btn").length){
                var habitation = $(".habitation").data('habitation')
                var habitationArr = []
                if(habitation){
                    habitationArr = habitation.split("-")
                }
                var value = item.areaCode + ',' + item.areaName
                if(habitationArr[1] == value){
                    selected = 'selected'
                }
            }
            var _o = '<option value="' + value + '"'+selected+'>' + item.areaName + '</option>';
            if (index === 0) {
                $('.city-select').html('<option value="">选择</option>' + _o);
            } else {
                $('.city-select').append(_o);
            }
            if($(".linkMan-modify-btn").length){
                $('.city-select').trigger('change')
            }
        });

    })

    // 城市选择更改
    $('.city-select').on('change', function () {
        var parentCode = $('.city-select').val().split(',')[0]
        getAddress(parentCode,function (data){
            data[0].data.map(function (item, index) {
                var selected = ''
                if($(".linkMan-modify-btn").length){
                    var habitation = $(".habitation").data('habitation')
                    var habitationArr = []
                    if(habitation){
                        habitationArr = habitation.split("-")
                    }
                    var value = item.areaCode + ',' + item.areaName
                    if(habitationArr[2] == value){
                        selected = 'selected'
                    }
                }
                var _o = '<option value="' + value + '" '+selected+'>' + item.areaName + '</option>';
                if (index === 0) {
                    $('.district-select').html('<option value="">选择</option>' + _o);
                } else {
                    $('.district-select').append(_o);
                }
            });

        })
    });
    $("#calendar").calendar({
        multipleMonth: 1,
        monthTag:2,
        multipleSelect: false,
        click: function (dates, dom) {
            $('#mask').hide()
            $('#calendar').removeClass('show');
            console.log(dates)
            $(".come-time").data('date',dates[0]).html(dates[0])
        }
    });
    $('#mask').click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        $("#mask").hide()
        if($("#calendar").length){
            $("#calendar").removeClass('show');
        }
    })
    $(".come-time").click(function (e) {
        $("#mask").show()
        $('#calendar').addClass('show');
    })

    var upload = {
        init:function () {
            $(".upload-btn").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if(temperatureUrl){
                    return new ErrLayer({
                        message:"只能上传一张图片"
                    });
                }
                $(this).next().trigger("click")
            })
            $(".ipnut-file").change(function () {
                var file = $(this).prop("files")[0];
                var field = $(this).attr("name") || "image";
                if(!file){
                    return
                }
                if(upload.checkFileSize(file)){
                    upload.readAndPreview($(this))
                    upload.sendFiles().done(function (imgs) {
                        if(!imgs){
                            return new ErrLayer({
                                message:"图片上传失败"
                            });
                        }
                        // var imgsArr = []
                        for(var i=0;i<imgs.length;i++){
                            var url = imgs[i].prefix+imgs[i].url
                            // imgsArr.push(url)
                            temperatureUrl = url
                        }
                    })
                }
            })
        },
        files:{},
        checkFileSize:function(file){
            var checkRes = true
            var fileSize = file.size/1024/1024
            var maxFileSize = 10
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
            var field = $(".preview-box img").length;
            // 支持的图片类型（可自定义）
            console.log(file)
            if (true||/\.(jpe?g|png|gif|bmp|tif|jp2|tiff|exif|wbmp|mbm)$/i.test(file.name)) {
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    var deleteHtml='<div class="deleteImg"><image src="'+this.result+'"></image><span>删除</span></div>';
                    $ele.parent().find(".upload-btn").before(deleteHtml);
                }, false);
                reader.readAsDataURL(file);
                // 上传图片
                upload.files[field] = file
            }else{
                new ErrLayer({
                    message:"请选择正确的图片格式"
                });
            }

        },
        sendFiles:function () {
            if(Object.keys(upload.files).length<=0){
                new ErrLayer({
                    message:"请先上传凭证"
                });
                return false
            }
            // 上传图片
            var formData = new FormData()
            for(var key in upload.files){
                formData.append(key, upload.files[key])
            }
            return $.ajax({
                url: '/upload/filesList',
                type: 'post',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: "JSON",
            });
        },
        sendSuccess:function (res) {
            //图片上传
        }
    }
    upload.init()
    $(".preview-box").on('click','.deleteImg span',function(){
        var index  = $(this).parent().index();
        $(this).parent().remove();
        $(".ipnut-file").val('');
        temperatureUrl = ''
        delete upload.files[index]
    })

    //修改常用联系人
    $(".linkMan-modify-btn").find("a").on("click",function(){
        addOrModifyLinkMan('modify')
    })

    //修改密码
    $('#setNewPassword').on('click',function(){
        if (validator.form()){
            $.post('/member/leaguerFixPwd', $('#form').serialize())
                .success(function (data){
                    var datas = data[0];
                    if (datas.status === 200){
                        submitResult = true;
                        $('.tips p').text('修改密码成功');
                        $('.mask,.tips').show();
                    }else{
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    }
                })
                .error(function (err){
                    window.location.href = '/error';
                });
        }
    })

    $('.tips a').on('click',function (){
        if (submitResult){
            window.location.href = '/member/user';
        }
	});

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
                //
                $("input[name='name']").val(_name)
                $("input[name='charNo']").val(_idCard)
                // var flag = true
                // $("input[name=idNos]").each(function(i){
                //     if($(this).val()==_idCard){
                //         alert('上传的身份证已存在');
                //         flag=false;
                //         return false
                //     }
                // });
                // if(flag){
                //     $(t).parents(".camera-text").prev().val(_idCard);
                //     $(t).parents("ul").find("input[name=linkMans]").val($(t).parents("ul").find("input[name=linkMans]").val()||_name);
                // }
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
