$(function () {
    // 每隔10秒切换下一个项目
    // 每一个项目下得游玩人每隔2秒更新一次
    var screenCode = $(".projectId").val();
    var index = 0, //项目序号（第一个项目）
        dataLen = 1, //项目个数
        settime, // 10秒切换项目，定时器
        settime2;// 更新项目下叫号定时器

    // 启用定时更新排队
    getNum(function () {
        if(settime2){
            clearInterval(settime2)
        }
        // 每两秒请求更新一次
        settime2 = setInterval(function () {
            getNum();
        }, 2000);

        // 每隔十秒切换下一个项目
        if(settime){
            clearInterval(settime)
        }
        settime = setInterval(function () {
            index++;
            if (index >= dataLen) {
                index = 0;
            }
        },10000)
    })

    // 获取排队数据
    function getNum(cb) {
        $.ajax({
            type: "POST",
            url: "/callNum",
            data: {screenCode: screenCode},
            success: function (datas) {
                // 项目个数
                dataLen = datas[0].data.length;
                // 更新页面
                updateDom(datas[0].data)
                if(typeof cb == 'function'){
                    cb(datas);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    // 更新屏幕页面
    function updateDom(len) {
        // 不存在时
        if(!len[index]){
            return
        }
        $(".callNum-title span").text(len[index].projectName);
        var html = "",
            list = len[index].upInfoList,
            subName;
        for (var j = 0; j < list.length; j++) {
            var modelCode=(list[j].modelCode).toString();
            var modelCodeText=modelCode.substring(modelCode.length - 8, modelCode.length-2).toLowerCase();
            if (list[j].userName) {
                var nameLen = list[j].userName;
                for (var i = 0; i < nameLen.length; i++) {
                    var str = nameLen;
                    var subStr = str.substring(0, 4);
                    subName = (subStr + (str.length > 4 ? '...' : ''));
                }
            }
            html += '<li class="callNum-li">' +
                        '<div>' +
                            '<span class="queueUpNo">' + list[j].queueUpNo + '</span>' +
                            '<span class="modelCode '+(list[j].userName? "userName":"noneNmae")+'">' +(list[j].userName?subName: modelCodeText) + '</span>' +
                        '</div>' +
                    '</li>';
        }
        $(".callNum-ul").html(html);
    }
})

