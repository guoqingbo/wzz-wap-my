$(function () {
    function getOrderList(){
        var params = {
            searchParam:$("input[name=keyword]").val()||'',
        }
        $.post("/supplier/getOrderList",params)
            .success(function (data) {
                if(data[0].status===200){
                    $(".supplier-order-list").html(data[0].html)
                }else{
                    new ErrLayer({message: data[0].message})
                }
            })
            .error(function (error) {
                console.log(error)
            })
    }
    getOrderList()
    // 搜索
    $(".search-btn").click(function (e) {
        e.preventDefault()
        e.stopPropagation()
        getOrderList()
    })
})
