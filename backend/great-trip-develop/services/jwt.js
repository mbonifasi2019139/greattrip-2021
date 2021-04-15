"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secretKey = "greattrip-@kinal-2021";

exports.createToken = (user) => {
    var payload = {
        sub: user._id,
        password: user.password,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(4, "hours").unix(),
    };
    return jwt.encode(payload, secretKey);
};

exports.getToken = (user) => {
    var payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(4, "hours").unix(),
    };
    return jwt.encode(payload, secretKey);
};