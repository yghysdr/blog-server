'use strict';
var db = require('../db');

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


