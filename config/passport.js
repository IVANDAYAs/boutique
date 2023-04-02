const JwtStartegy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStartegy(opts, (jwt_payload, done) => {
        if (jwt_payload.mail == "admin@boutique.com") {
            const mail = jwt_payload.mail;
            return done(null, mail);
        }
    }));
};