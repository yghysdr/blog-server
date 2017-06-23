'use strict';
/**
 * Created by yghysdr on 2017/3/24.
 */
const db = require('../db');
const Sort = require('./Sort');
const Article = require('./Article');


//articleId, sortId
const ArticleSort = db.defineModel('article_sort', {});
ArticleSort.belongsTo(Article);
ArticleSort.belongsTo(Sort);
module.exports = ArticleSort;