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
    /**
     "phone": "18301247317",
     "password": "462136c56d6e53732cb957fa1cbfd5b1",
     "token": "310f71a6482a1a15acc8bf2ea99941fb",
     "avatar": "http://blog.yghysdr.cn/74d26faeeb49c05903c40c7ffc1a7089",
     "signature": "",
     "nick": "一个很严肃的人",
     "id": 1,
     */
    if (user !== null && password === user.password) {
        let data = {};
        data.uid = user.id;
        data.phone = user.phone;
        data.token = user.token;
        data.avatar = api.baseFileUrl + user.avatar;
        data.nick = user.nick;
        data.signature = user.signature;
        ctx.rest(data);
    } else {
        ctx.response.type = 'application/json';
        ctx.response.body = {
            code: 1,
            data: {},
            msg: "登入失败",
            haveMore: false
        }
    }
};

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



