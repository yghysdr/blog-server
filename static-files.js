'use strict';
/**
 * 我们把所有静态资源文件全部放入/static目录，目的就是能统一处理静态文件。
 * 在koa中，我们需要编写一个middleware，处理以/static/开头的URL。
 */
const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

/**
 * staticFiles 是一个普通函数，它接收两个参数：URL前缀和一个目录，然后返回一个async函数。
 * 这个async函数会判断当前的URL是否以指定前缀开头，如果是，就把URL的路径视为文件，
 * 并发送文件内容。如果不是，这个async函数就不做任何事情，而是简单地调用await next()
 * 让下一个middleware去处理请求。
 * @param url  类似 '/static/'
 * @param dir  类似 __dirname + '/static'
 * @returns {function(*, *)}
 */
function staticFiles(url, dir) {
    return async(ctx, next) => {
        let rpath = ctx.request.path;
        console.log('yghysdr...' + rpath);
        // 判断是否以指定的url开头:
        if (rpath.startsWith(url)) {
            // 获取文件完整路径:
            let fp = path.join(dir, rpath.substring(url.length));
            // 判断文件是否存在:
            if (await fs.exists(fp)) {
                // 查找文件的mime:
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并赋值给response.body:
                ctx.response.body = await fs.readFile(fp);
            } else {
                // 文件不存在:
                ctx.response.status = 404;
            }
        } else {
            // 不是指定前缀的URL，继续处理下一个middleware:
            await next();
        }
    };
}

module.exports = staticFiles;