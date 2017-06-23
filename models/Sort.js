'use strict';
/**
 * Created by yghysdr on 2017/3/24.
 */
const db = require('../db');

const Sort = db.defineModel('sort', {
    name: {
        type: db.STRING(100)
    }
});
module.exports = Sort;