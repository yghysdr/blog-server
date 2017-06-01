/**
 * Created by yghysdr on 2017/2/21.
 * 创建表。在操作表之前先运行此处，创建表。
 * PS 只需要在项目运行前初始化一次
 */
require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./model.js');
model.sync();
