'use strict';
/**
 * 文章相关
 */

const model = require('../model');
const url = require('url');
let Article = model.Article;

/**
 * 直接 url.parse(ctx.request.url, true).query;
 * 结果是 { page: '1', size: '10', name: '顺' }
 * 1.支持中文
 * 2.由于是通过url传递参数，因此参数全是字符。使用时需要强转
 * @param ctx
 * @param next
 */
var fn_article_list = async(ctx, next) => {
    let params = url.parse(ctx.request.url, true).query;
    let currentPage = params.page * 1 || 1;
    if (currentPage <= 0) {
        currentPage = 1;
    }
    let pageSize = params.size * 1 || 10;
    if (pageSize <= 0) {
        pageSize = 10;
    }
    let type = params.type || '0';
    let article;
    /**
     * 多取出一个，方便判断是否还有更多。
     */
    if (type === '0') {
        article = await Article.findAll({
            limit: pageSize + 1,
            offset: (currentPage - 1) * pageSize,
            order: [['updatedAt', 'DESC']]
        });
    } else {
        article = await Article.findAll({
            limit: pageSize + 1,
            offset: (currentPage - 1) * pageSize,
            where: {
                articleType: type
            },
            order: [['updatedAt', 'DESC']]
        });
    }
    if (article.length < pageSize + 1) {
        ctx.rest(article, false);
    } else {
        ctx.rest(article.slice(0, pageSize), true);
    }
};

var fn_article = async(ctx, next) => {
    let params = url.parse(ctx.request.url, true).query;
    var article = await Article.findOne({
        where: {
            id: params.id || '0'
        }
    });
    console.log(params.id);
    ctx.rest(article);
};

var fn_article_post = async(ctx, next) => {
    let article = {};
    article.title = ctx.request.body.title || '';
    article.des = ctx.request.body.des || '';
    article.content = ctx.request.body.content || '';
    article.userId = ctx.request.body.userId || 1;
    article.articleType = ctx.request.body.articleType || 0;
    let result = await Article.create({
        title: article.title,
        des: article.des,
        content: article.content,
        userId: article.userId,
        articleType: article.articleType
    });
    ctx.rest(result);
};

var fn_article_put = async(ctx, next) => {
    let article = {};
    article.id = ctx.request.body.id || '';
    article.title = ctx.request.body.title || '';
    article.des = ctx.request.body.des || '';
    article.content = ctx.request.body.content || '';
    article.userId = ctx.request.body.userId || 1;
    article.articleType = ctx.request.body.articleType || 0;
    let result = await Article.update({
            title: article.title,
            des: article.des,
            content: article.content,
            articleType: article.articleType,
            updatedAt: Date.now()
        },
        {
            where: {id: article.id}
        }
    );
    ctx.rest(result);
};

module.exports = {
    'GET /api/list': fn_article_list,
    'GET /api/article': fn_article,
    'POST /api/article': fn_article_post,
    'PUT /api/article': fn_article_put
};