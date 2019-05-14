const passport = require("passport");
const database = require("../db/connection");

module.exports = () => {
    passport.serializeUser((user, done)  => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        database('users').where({id}).first()
        .then((user) => { done(null, user); })
        .catch((err) => { done(err, null); });
    });
};