var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Handlebars = require("handlebars");
var hbs = require("express-handlebars");
const db = require("./config/dbConnection");
var session = require("express-session");

require("dotenv").config();

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
var adminRouter = require("./routes/admin");
var playerRouter = require("./routes/player");

var app = express();
var PORT = process.env.PORT || 80;
// if u use npm start and run thru www file instead added if condition ...
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("app is listening at port", PORT);
  }).on('error', (err) => {
    console.error('Server failed to start:', err);
  });
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.create({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  }).engine
);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const oneDay = 1000 * 60 * 60 * 24;


//data base connection
db.connect(function (err) {
  if (err) console.log("db connection error" + err);
  else console.log("Database connected successfuly");
});

app.use("/admin", adminRouter);
app.use("/", playerRouter);

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
