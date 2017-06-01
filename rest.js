/**
 * 支持REST的middleware，给ctx绑定rest
 * 1.添加content-type = application/json
 * 2.设置请求路径必须是api开头
 * 3.统一处理错误
 * 4.统一为返回结果加一层
 */
module.exports = {
    APIError: function (code, message) {
        this.code = code || 100;
        this.messages = message || '';
    },
    restify: (pathPrefix)=> {
        pathPrefix = pathPrefix || '/api/';
        return async(ctx, next)=> {
            if (ctx.request.path.startsWith(pathPrefix)) {
                //绑定
                ctx.rest = (data, haveMore)=> {
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: 0,
                        data: data,
                        haveMore: haveMore || false
                    }
                };
                try {
                    await next();
                } catch (e) {
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.core || 100,
                        message: e.message || 'error server'
                    }
                }
            } else {
                await next();
            }
        };
    }
};