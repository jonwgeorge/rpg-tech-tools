const bcrypt = require("bcrypt");
const database = require("../db/connection");

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: "Please log in"});
  return next();
};

function createUser (req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return database('users')
  .insert({
    email: req.body.email,
    password: hash,
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    created_at: "current_timestamp",
    modified_at: "current_timestamp"
  })
  .returning("*");
};

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
};

function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    {status: "You are already logged in"});
  return next();  
}

module.exports = {
  loginRequired,
  createUser,
  comparePass,
  loginRedirect
};