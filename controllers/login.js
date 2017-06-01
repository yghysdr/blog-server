'use strict';
const model = require('../model');
const crypto = require('crypto');
const fs = require('fs');
const utils = require('../utils');
const api = require('./../api');

let User = model.User;

var fn_login = async(ctx, next)=> {

    var
        phone = ctx.request.body.phone || '',
        password = ctx.request.body.password || '';

    var user = await User.findOne({
        where: {
            phone: phone
        }
    });
    if (user !== null && password === user.password) {
        ctx.rest({
            msg: '登入成功',
            token: user.token,
            uid: user.id,
            avatar: api.baseFileUrl + user.avatar
        });
    } else {
        ctx.response.type = 'application/json';
        ctx.response.body = {
            code: 1,
            data: "登入失败",
            haveMore: false
        }
    }
};
//上传的是base64（不再使用）
// var fn_avatar = async(ctx, next) => {
//     var avatar = ctx.request.files;
//     let path = 'static/img/avatar.jpg';
//     if (avatar) {
//         fs.writeFile(path, avatar, 'base64', function (err) {
//                 if (err) {
//                     console.log(err);
//                     avatar_fail(ctx);
//                 }
//             }
//         );
//         ctx.rest({
//             msg: '图片上传成功'
//         });
//     } else {
//         avatar_fail(ctx);
//     }
// };
//
//
// function avatar_fail(ctx) {
//     console.log('上传失败');
//     ctx.response.type = 'application/json';
//     ctx.response.body = {
//         code: 1,
//         data: "图片上传失败",
//         haveMore: false
//     }
// }

var fn_avatar = async(ctx, next) => {
    await User.update({
            avatar: ctx.req.file.filename,
            updatedAt: Date.now()
        },
        {
            where: {id: ctx.req.headers.uid}
        }
    );
    ctx.rest({
        avatar_url: api.baseFileUrl + ctx.req.file.filename,
        uid: ctx.req.headers.uid,
    });
};


module.exports = {
    'POST /api/login': fn_login,
    'PUT /api/avatar': fn_avatar
};



