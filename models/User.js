/**
 * Created by yghysdr on 2017/2/21.
 */
const db = require('../db');

module.exports = db.defineModel('user', {
    phone: {
        type: db.STRING(11),
        unique: true
    },
    password: db.STRING(100),
    token: db.STRING(100),
    avatar: db.STRING(100),
    signature: db.STRING(100),
    nick: db.STRING(100)
});


