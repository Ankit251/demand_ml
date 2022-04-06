var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var jwt = require("jsonwebtoken");
var indexRouter = require("./routes/index");
var dataRouter = require("./routes/data");
var userRouter = require("./routes/firestore-data");
const { verifyJwtToken } = require("./middleware/token");
const { verifyFirebaseToken } = require("./middleware/firebase-token");
const { resetPassword } = require("./services/firebase");

// Imports the Google Cloud client library
const {ErrorReporting} = require('@google-cloud/error-reporting');

// Instantiates a client
const errors = new ErrorReporting({reportMode: 'always'});


var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../static")));

app.use("/", indexRouter);
app.use("/api/data", verifyFirebaseToken, dataRouter);
app.use("/api/user", verifyFirebaseToken, userRouter);

app.post("/api/login", function (req, res, next) {
  let user = req.body.email;
  let token = req.body.token;
  try {
    res.cookie("token", token, { httpOnly: true });
    res.json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "Internal server errror" });
  }
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // if (process.env.ENV == "production") {
  //   errors.report(err);
  // }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(errors.express);

module.exports = app;
