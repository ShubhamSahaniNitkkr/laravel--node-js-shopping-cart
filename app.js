var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressHbs = require("express-handlebars");
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var mongoose = require("mongoose");
var app = express();
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(session);
var { isDemoMode, enableDemoMode } = require("./config/demo");

if (process.env.DEMO_MODE === "true") {
  enableDemoMode();
}

var mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/shopping";

if (!isDemoMode()) {
  mongoose.connect(mongoUri, { useNewUrlParser: true }).catch(() => {
    console.log("MongoDB unavailable, falling back to DEMO_MODE");
    enableDemoMode();
  });
} else {
  console.log("DEMO_MODE enabled — using in-memory products and memory sessions");
  console.log("Demo login: demo@demo.com / demo123");
}

require("./config/passport");

app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var sessionConfig = {
  secret: process.env.SESSION_SECRET || "mysuperpassword",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 * 1000 }
};

if (!isDemoMode()) {
  sessionConfig.store = new MongoStore({ mongooseConnection: mongoose.connection });
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.demoMode = isDemoMode();
  next();
});

app.use("/user", userRouter);
app.use("/", indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
