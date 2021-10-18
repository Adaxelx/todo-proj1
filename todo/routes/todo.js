var express = require("express");

var router = express.Router();
const { sendTask } = require("../controllers/todo");

/* Add task */
router.post("/", sendTask);

module.exports = router;
