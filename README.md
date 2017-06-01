#Blog

## 添加跨域，本地json读取。

## 使用sequelize进行一对多的表创建，查询
例如创建一个goods对应多个rating。
```
const db = require('../db');
const Rating = require('./Rating');
const Goods = db.defineModel('goods', {
    name: {
        type: db.STRING(11)
    }
});
Goods.hasMany(Rating);
module.exports = Goods;
```
```
const db = require('../db');

module.exports = db.defineModel('rating', {
    des: {
        type: db.STRING(11)
    }
});
```
## REST请求
rest.js
 * 支持REST的middleware，给ctx绑定rest
 * 1.添加content-type = application/json
 * 2.设置请求路径必须是api开头
 * 3.统一处理错误
 * 4.统一为返回结果加一层
如果api请求错误抛出APIError即可
```
 throw new APIError(错误码, '错误信息');
```
## article文章的读写。
```
'GET /api/article': 获取文章列表
'POST /api/article': 提交文章
```
## 从表单保存文件
[koa-multer](https://github.com/koa-modules/multer)
