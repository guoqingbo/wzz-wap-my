const multer = require('multer');
const request = require('request');
const async = require('async');

var upload = multer({

});
exports.mainRouter = function(router,common){
    router.post('/upload/filesList',upload.any(), function(req, res) {
        let url = common.gul(['uploadfile','upload'])
        let files = req.files;
        let requestArr = []
        if (files.length) {
            files.forEach(item=>{
                requestArr.push(function(cb){
                    let formData = {
                        // file: {
                        //     filename:item.originalname,
                        //     content_type: item.mimetype,
                        //     buffer:item.buffer,
                        // }
                        file: {
                            value: item.buffer,
                            options: {
                                filename: item.originalname,
                                contentType:item.mimetype
                            }
                        }
                    }
                    request.post({url, formData},function optionalCallback(err, resp, body) {
                            body = body && typeof body == "string"?JSON.parse(body):{}
                            body.fieldname = item.fieldname
                            cb(err,body)
                        });
                })
            })
            async.parallel(requestArr,function (err, results){
                console.log(results)
                res.send(results)
            })
        }else{
            res.send([{message:"无上传图片",success:false}])
        }
    });


};
