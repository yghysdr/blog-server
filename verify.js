/**
 * Created by yghysdr on 2017/4/25.
 * 权限判断
 */
const model = require('./model');
const User = model.User;

var verify = async(ctx) => {
    let uid = ctx.request.headers.uid || '';
    let token = ctx.request.headers.token || '';
    //登入
    if (ctx.request.url.indexOf('login') != -1) {
        return true;
    }
    if (ctx.request.method !== 'GET') {
        if (await verify_token(uid, token)) {
            return true;
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                code: 100,
                data: {},
                msg: "没有权限",
                haveMore: false
            };
            return false;
        }
    } else {
        return true;
    }
}

async function verify_token(uid, token) {
    var user = await User.findOne({
        where: {
            id: uid
        }
    });
    if (user && user.token === token) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    verify: verify
};

