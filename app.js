var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var RateLimit = require("express-rate-limit");

//db connection
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://admin:S6Jb-NrhA7edCxe@cluster0.fmbhm.mongodb.net/express-server",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var indexRouter = require("./src/routes/index");
var usersRouter = require("./src/routes/users");

var app = express();

//helmet setup
app.use(helmet());

//rate limit setup prevent DoS attack
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, //limit number of request per IP
});

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//JWT setup
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      "ichigorg",
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
      }
    );
  }
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
