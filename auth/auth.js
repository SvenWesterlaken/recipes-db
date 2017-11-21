var settings = require('../config.json'),
    moment = require('moment'),
    jwt = require('jwt-simple');

function encodeToken(username) {
    const playload = {
        exp: moment().add(1, 'weeks').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(playload, settings.secretkey);
}


function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, settings.secretkey);
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('Token has expired.');
        }

        // Return
        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
