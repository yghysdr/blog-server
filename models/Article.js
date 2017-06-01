'use strict';
/**
 * Created by yghysdr on 2017/3/24.
 */
const db = require('../db');
const User = require('./User')
const Sequelize = require('sequelize');

const Article = db.defineModel('article', {
    title: {
        type: Sequelize.TEXT
    },
    des: {
        type: Sequelize.TEXT
    },
    content: {
        type: Sequelize.TEXT
    },
    articleType: {
        type: Sequelize.INTEGER
    }
});
Article.belongsTo(User);
module.exports = Article;