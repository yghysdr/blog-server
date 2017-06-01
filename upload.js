'use strict';
/**
 * 文件上传处理
 */
const multer = require("koa-multer");
const upload = multer({dest: './static/upload'});
const api = require('./api');
const fs = require('fs');
var qiniu = require("qiniu");
let myKey = require("./key");
qiniu.conf.ACCESS_KEY = myKey.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = myKey.qiniu.SECRET_KEY;

function upToken(fileName) {
    var putPolicy = new qiniu.rs.PutPolicy(myKey.qiniu.bucket + ":" + fileName);
    return putPolicy.token();
}

function uploadFile(fileName, localFile, callback) {
    var token = upToken(fileName);
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, fileName, localFile, extra, function (err, ret) {
        if (!err) {
            callback(0);
        } else {
            callback(1);
        }
    });
}

function addControllers(router) {
    /**
     * 处理文件后，发送 await next()，等待其他操作处理相应逻辑，当然也可以此处处理
     */
    router.put('/api/avatar', upload.single('file'), async(ctx, next) => {
        let file = ctx.req.file;
        if (file || file.path) {
            uploadFile(file.filename, file.path, function (code) {
                if (code === 0) {
                    fs.unlink(file.path);
                }
            });
            await next();
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                code: 1,
                data: "图片上传失败",
                haveMore: false
            }
        }
    });
    /**
     * {
     * "fieldname": "pic",
     * "originalname": "avatar.png",
     * "encoding": "7bit",
     * "mimetype": "image/png",
     * "destination": "./static/upload",
     * "filename": "abe6ac7690fc9a4f3ebdb68d00bd580e",
     * "path": "static/upload/abe6ac7690fc9a4f3ebdb68d00bd580e",
     * "size": 5333
     * }
     */
    router.post('/api/article_pic', upload.single('file'), async(ctx, next) => {
        let file = ctx.req.file;
        if (file || file.path) {
            uploadFile(file.filename, file.path, function (code) {
                if (code === 0) {
                    fs.unlink(file.path);
                }
            });
            ctx.rest(api.baseFileUrl + ctx.req.file.filename);
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                code: 1,
                data: "图片上传失败",
                haveMore: false
            }
        }
    });
}

module.exports = {
    'fun': addControllers
};
