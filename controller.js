'use strict';
const fs = require('fs');

function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/controllers');
    var js_files = files.filter((f)=> {
        return f.endsWith('.js');
    });
    for (let file of js_files) {
        console.log(`process controller: ${file}...`);
        let mapping = require(__dirname + '/controllers/' + file);
        addMapping(router, mapping);
    }
}

/**
 *  外部直接调用
 *  controller.controller(router);
 *  app.use(router.routes());
 */
module.exports = {
    'fun': addControllers
};
