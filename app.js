"use strict";
const isProduction = process.env.NODE_ENV === 'production';
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');
const controller = require('./controller');
const upload = require('./upload');
const staticFiles = require('./static-files');
const templating = require('./templating');
const cors = require('./koa-cors');
const rest = require('./rest');
const verify = require('./verify');
const serve = require('koa-static');
const path = require('path');

app.use(serve(path.join(__dirname, '.', 'dist')));
app.use(cors());

app.use(async(ctx, next) => {
    if (await verify.verify(ctx)) {
        console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
        var start = new Date().getTime();
        var execTime;
        await next();
        execTime = new Date().getTime() - start;
        ctx.response.set('X-Response-Time', `${execTime}ms`);
    }
});

//2 middleware处理静态文件：

app.use(staticFiles('/static/', __dirname + '/static'));

//3 middleware解析POST请求：
app.use(bodyParser());

//4 middleware负责给ctx加上render()来使用Nunjucks：
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//5 处理路由
upload.fun(router);
controller.fun(fs, router);
app.use(rest.restify());
app.use(router.routes());

app.listen(80);
console.log('app start at port 80...');