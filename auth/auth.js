var settings = require('../config/env'),
    moment = require('moment'),
    jwt = require('jwt-simple');

function encodeToken(username) {
    const payload = {
        exp: moment().add(2, 'hours').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(payload, settings.secretkey);
}


function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, settings.secretkey);
        const now = moment().unix();

        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
