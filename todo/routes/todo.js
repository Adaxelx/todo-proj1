var express = require("express");

var router = express.Router();
const {
  sendTask,
  getTasks,
  deleteTask,
  updateTask,
} = require("../controllers/todo");

router.post("/", sendTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", updateTask);

module.exports = router;
