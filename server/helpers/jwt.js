'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
var secret = 'Secreto'

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        email: user.email,
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, secret);
}

