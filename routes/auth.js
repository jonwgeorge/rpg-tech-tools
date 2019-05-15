const express = require('express');
const router = express.Router();
const authHelpers = require("../auth/_helpers")
const user = require("../models/Users");
const passport = require("../auth/local");

// Register 
router.get("/register", authHelpers.loginRedirect, (req, res) => {
  res.render("auth/register");
});
router.post("/register", authHelpers.loginRedirect, (req, res, next) => {
  console.log(req.body);

  try {
    user.create(req);
    try {
      passport.authenticate("local", (err, res, info) => {
        if (res) { handleResponse(res, 200, "Register success.. Logging in..."); }
      })(req, res, next);
    } catch (err) {
      handleResponse(res, 500, "Could not register user...");
    }
  } catch (error) {
    return res.status(400).send(error);
  };
});

// Login
router.get("/login", authHelpers.loginRedirect, (req, res) => {
  res.render("auth/login");
});
router.post("/login", authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {handleResponse(res, 500, "error"); }
    if (!user) { handleResponse(res, 404, "User not found..."); }
    if (user) {
      req.logIn(user, function (err) {
        if (err) { handleResponse(res, 500, "Could not login user..."); }
        handleResponse(res, 200, "Login success...");
      });
    }
  })(req, res, next);
});

// Logout
router.get("/logout", authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, "Logout success...");
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

module.exports = router;