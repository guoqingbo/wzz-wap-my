$(function (){
    var validator = $('#form').validate({
        rules: {
            content: {
                required:true,
                isCode:true,
                minlength: 4,
                maxlength:200
            }
        }
    });

    // 发布评论
    $('#sub').on('click',function (){
        if (validator.form()){
            var num = $('.pfxtFen').find('.icon-star-full').length;
            var isAnonymous = $('input[name=isAnonymous]').is(':checked') ? 0 : 1;
            var content = $('textarea[name=content]').val()
            // if(!content){
            //     return new ErrLayer({
            //         message:"请先填写退单原因"
            //     });
            // }
            var sendFilesRes = upload.sendFiles()
            if(sendFilesRes){
                sendFilesRes.done(function (imgs) {
                    if(!imgs){
                        return new ErrLayer({
                            message:"图片上传失败"
                        });
                    }
                    var imgsArr = []
                    for(var i=0;i<imgs.length;i++){
                        var url = imgs[i].prefix+imgs[i].url
                        imgsArr.push(url)
                    }
                    $.post('/member/comment',{
                        orderNo:orderNo,
                        modelCode:modelCode,
                        businessType:module,
                        content:content ,
                        score:num,
                        isAnonymous:isAnonymous,
                        orderImg:imgsArr.join(","),
                    }).success(function (data){
                        var datas = data[0];
                        $('#sub').addClass('blue').unbind('click');
                        $('.tips p').text(datas.message);
                        $('.mask,.tips').show();
                    })
                        .error(function (err){
                            window.location.href = '/error';
                        });
                })
            }

        }
    });

    $(".pfxtFen i").click(function(){
        var index = $(this).index()+1;
        $(this).addClass("icon-star-full");
        $(this).prevAll().addClass("icon-star-full");
        $(this).nextAll().removeClass("icon-star-full");
    });

    $('.tips a').on('click',function (){
		window.location.href = '/member/order/' + orderNo;
	});
    var upload = {
        uploadImg:'',
        init:function () {
            $(".upload-btn").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).next().trigger("click")
            })
            $(".ipnut-file").change(function () {
                var file =$(this).prop("files")[0];
                var field = $(this).attr("name") || "image";
                if(!file){
                    return
                }
                if(upload.checkFileSize(file)){
                    upload.readAndPreview($(this))
                }
                // 上传图片
                // upload.sendFiles().done(function (res) {
                //     upload.uploadImg = res
                //     console.log(upload.uploadImg)
                // })


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
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
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
                    message:"请先上传图片"
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
                success:function(res){

                }
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
        delete upload.files[index]
    })
});
