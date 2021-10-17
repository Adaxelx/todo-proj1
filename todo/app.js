require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var todosRouter = require("./routes/todo");

var app = express();
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

mongoose.connect(dbConfig.url, dbConfig.options);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/todo", todosRouter);

module.exports = app;
