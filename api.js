/**
 * Created by yghysdr on 2017/5/27.
 */
const utils = require('./utils');

let base = "http://" + utils.getIp()[1] + ":3000/";
let baseUrl = base + '/api/';
let baseFileUrl = "http://oqlwlmr6l.bkt.clouddn.com/";

module.exports = {
    baseUrl: baseUrl,
    base: base,
    baseFileUrl: baseFileUrl
};