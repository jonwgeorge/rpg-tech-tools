var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var session = require("express-session");
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");
const creditsRouter = require("./routes/credits");

var app = express();
var oktaClient = new okta.Client({
  orgUrl: "https://dev-644430.okta.com",
  token: "004M58Pp3J00eItZHJlAEQzn_zNsNu9GAvv7j2x8PW"
});
const oidc = new ExpressOIDC({
  issuer: "https://dev-644430.okta.com/oauth2/default",
  client_id: "0oaklxh9xfQjiBaLx356",
  client_secret: "nWmtt2fNaJmWOFSqnYus_7aJKq-wEr7ad8OZcxCG",
  redirect_uri: "https://rpg-tech-tools-dev.herokuapp.com/users/callback",
  appBaseUrl: "https://rpg-tech-tools-dev.herokuapp.com",
  scope: "openid profile email",
  routes: {
    login: {
      path: "/users/login"
    },
    loginCallback: {
      path: "/users/callback",
      afterCallback: "/dashboard"
    },
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "CEhanyLB1*A0Dr2rAL9T$K^zLL21Cbho",
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);
app.use((req, res, next) => {
  if (!req.userContext) {
    return next();
  }
  
  oktaClient.getUser(req.userContext.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
  }).catch(err => {
    next(err);
  });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  
  next();
}

app.use("/", publicRouter);
app.use("/dashboard", loginRequired, dashboardRouter);
app.use("/users", usersRouter);
app.use("/credits", creditsRouter);

app.get("/test", (req, res) => {
  res.json({ profile: req.user ? req.user.profile : null });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
