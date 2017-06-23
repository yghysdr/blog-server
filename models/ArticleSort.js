'use strict';
/**
 * Created by yghysdr on 2017/3/24.
 */
const db = require('../db');

const ArticleSort = db.defineModel('article_sort', {
    article_id: {
        type: db.ID
    },
    sort_id: {
        type: db.ID
    }
});
module.exports = ArticleSort;