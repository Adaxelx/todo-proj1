require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var todosRouter = require("./routes/todo");
const databaseHelper = require("./helpers/database");
var app = express();

databaseHelper.connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/todo", todosRouter);

module.exports = app;
