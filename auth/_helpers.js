const bcrypt = require("bcrypt");
const User = require("../models/Users");

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: "Please log in"});
  return next();
};

function createUser (req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return User.createUser(req, hash, res);
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