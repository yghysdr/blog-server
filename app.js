"use strict";
const isProduction = process.env.NODE_ENV === 'production';
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const upload = require('./upload');
const cors = require('./koa-cors');
const rest = require('./rest');
const verify = require('./verify');
const serve = require('koa-static');
const path = require('path');
const key = require('./key.js');
const fs = require('mz/fs');

const app = new Koa();

/**
 * 该目录下的文件外部可以直接访问
 */

const opts = {
    maxage: 1000 * 60 * 60 * 24 * 365, // 1年，默认为0
    hidden: false, // 能否返回隐藏文件（以`.`打头），默认false不返回
    index: 'index.html', // 默认文件名
    defer: true, // 在yield* next之后返回静态文件，默认在之前
    gzip: true,
    // 允许传输gzip，如静态文件夹下有两个文件，index.js和index.js.gz，
    // 会优先传输index.js.gz，默认开启
    extensions: true
};
app.use(serve(path.join(__dirname, './static'), opts));

app.use(async(ctx, next) => {
    if (ctx.request.path === '/article') {
        ctx.response.type = 'html';
        ctx.response.body = await fs.readFile(path.join(__dirname, './static/article.html'));
    } else {
        await next();
    }
});

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

//post请求体解析
app.use(bodyParser());
//文件路由
upload.fun(router);
//路由
controller.fun(router);
//绑定rest
app.use(rest.restify());
app.use(router.routes());

app.listen(key.server.port);
console.log('app start at port ' + key.server.port + '...');