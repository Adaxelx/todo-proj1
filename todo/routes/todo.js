var express = require("express");

var router = express.Router();
const { sendTask, getTasks, deleteTask, updateTask} = require("../controllers/todo");

/* Add task */
router.post("/", sendTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);

module.exports = router;
