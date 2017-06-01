'use strict';
/**
 * Created by yghysdr on 2017/4/24.
 */

const model = require('./model');
const User = model.User;

async function verify_token(uid, token) {
    var user = await User.findOne({
        where: {
            id: uid
        }
    });
    if (user && user.token === token) {
        return true;
    } else {
        return false;
    }
};

var os = require('os');

function getLocalIps(flagIpv6) {
    var ifaces = os.networkInterfaces();
    var ips = [];
    var func = function (details) {
        if (!flagIpv6 && details.family === 'IPv6') {
            return;
        }
        ips.push(details.address);
    };
    for (var dev in ifaces) {
        ifaces[dev].forEach(func);
    }
    return ips;
};

module.exports = {
    verify_token: verify_token,
    getIp: getLocalIps
};

