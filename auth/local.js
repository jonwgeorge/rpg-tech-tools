const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const init = require("./passport");
const database = require("../db/connection");
const authHelpers = require("./_helpers");

const options = {};

init();

passport.use(new LocalStrategy(options, (email, password, done) => {
  // check to see if the username exists
  const query = {
    name: "fetch-user",
    text: "SELECT * FROM users WHERE email = $1",
    values: [email]
  };

  return database.query(query);
}));

module.exports = passport;