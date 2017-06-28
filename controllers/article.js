'use strict';
/**
 * 文章相关
 */

const model = require('../model');
const url = require('url');
const utils = require('../utils');
let Article = model.Article;
let ArticleSort = model.ArticleSort;
let Sort = model.Sort;

/**
 * 直接 url.parse(ctx.request.url, true).query;
 * 结果是 { page: '1', size: '10', name: '顺' }
 * 1.支持中文
 * 2.由于是通过url传递参数，因此参数全是字符。使用时需要强转
 * @param ctx
 * @param next
 */
var fn_article_list_get = async(ctx, next) => {
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
    let articleList;
    /**
     * 多取出一个，方便判断是否还有更多。
     */
    if (type === '0') {
        articleList = await Article.findAll({
            limit: pageSize + 1,
            offset: (currentPage - 1) * pageSize,
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'title', 'des', 'userId', 'updatedAt'],
            where: {
                id: {$ne: 0}
            }
        });
    } else {
        articleList = await ArticleSort.findAll({
            limit: pageSize + 1,
            offset: (currentPage - 1) * pageSize,
            where: {
                sortId: type,
                id: {$ne: 0}
            },
            attributes: ['sortId'],
            include: {
                model: Article,
                order: [['updatedAt', 'DESC']],
                attributes: ['id', 'title', 'des', 'userId', 'updatedAt']
            }
        });
        let articleListTemp = [];
        for (let i = 0; i < articleList.length; i++) {
            let temp = {};
            temp.id = articleList[i].article.id;
            temp.title = articleList[i].article.title;
            temp.des = articleList[i].article.des;
            temp.userId = articleList[i].article.userId;
            articleListTemp[i] = temp;
        }
        articleList = articleListTemp;
    }
    if (articleList.length < pageSize + 1) {
        ctx.rest(articleList, false);
    } else {
        ctx.rest(articleList.slice(0, pageSize), true);
    }
};

var fn_article_get = async(ctx, next) => {
    let params = url.parse(ctx.request.url, true).query;
    var article = await Article.findOne({
        where: {
            id: params.id || 0
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
    var sorts = ctx.request.body.type || [0];
    let result = await Article.create({
        title: article.title,
        des: article.des,
        content: article.content,
        userId: article.userId
    });
    if (typeof sorts === "string") {
        sorts = utils.strToArray(sorts);
    }
    sorts = utils.arrayUniq(sorts);
    for (let i = 0; i < sorts.length; i++) {
        ArticleSort.create({
            articleId: result.id,
            sortId: parseInt(sorts[i], 0)
        });
    }
    ctx.rest(sorts);
};

var fn_article_put = async(ctx, next) => {
    let article = {};
    article.id = ctx.request.body.id || '';
    article.title = ctx.request.body.title || '';
    article.des = ctx.request.body.des || '';
    article.content = ctx.request.body.content || '';
    article.userId = ctx.request.body.userId || 1;
    let sorts = ctx.request.body.type || [1000];
    await Article.update(
        {
            title: article.title,
            des: article.des,
            content: article.content,
            updatedAt: Date.now()
        },
        {
            where: {id: article.id}
        }
    );
    await ArticleSort.destroy(
        {where: {articleId: article.id}}
    );
    if (typeof sorts === "string") {
        sorts = utils.strToArray(sorts);
    }
    for (let sort in sorts) {
        ArticleSort.create({
            articleId: article.id,
            sortId: parseInt(sort, 1000)
        });
    }
    ctx.rest(article);
};

var fn_sort_get = async(ctx, next) => {
    var result = await Sort.findAll({
        attributes: ['id', 'name'],
        where: {
            id: {$ne: 1000}
        }
    });
    ctx.rest(result);
};

var fn_sort_data_get = async(ctx, next)=> {
    var sorts = await Sort.findAll({
        attributes: ['id', 'name'],
    });
    let result = [];
    for (let i = 0; i < sorts.length; i++) {
        let data = {};
        data.name = sorts[i].name;
        data.id = sorts[i].id;
        let temp = await ArticleSort.findAndCountAll({
            where: {
                sortId: sorts[i].id,
                id: {$ne: 0}
            }
        });
        data.count = temp.count;
        result.push(data)
    }
    ctx.rest(result);
};

var fn_archive_get = async(ctx, next) => {
    var result = await Article.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'createdAt']
    });
    let archiveList = [];
    let archive = {
        year: '',
        articleList: []
    };
    let year = new Date(result[0].createdAt).getFullYear();
    for (let i = 0; i < result.length; i++) {
        var date = new Date(result[i].createdAt);
        let tempYear = date.getFullYear();
        if (tempYear !== year) {
            archiveList.push(archive);
            archive = {
                year: '',
                articleList: []
            };
        }
        archive.year = result[i].createdAt;
        archive.articleList.push(result[i]);
        year = tempYear;
    }
    archiveList.push(archive);
    ctx.rest(archiveList);
};

module.exports = {
    'GET /api/list': fn_article_list_get,
    'GET /api/article': fn_article_get,
    'GET /api/sort': fn_sort_get,
    'GET /api/sortData': fn_sort_data_get,
    'GET /api/archive': fn_archive_get,
    'POST /api/article': fn_article_post,
    'PUT /api/article': fn_article_put
};