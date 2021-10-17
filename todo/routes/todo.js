var express = require("express");
const Todo = require("../models/Todo");
var router = express.Router();

/* Add task */
router.post("/", async function (req, res, next) {
  const { description } = req.body;
  try {
    const response = await Todo.create({ description });
    res.status(201);
    res.json(response);
  } catch (err) {
    // tutaj lepsza obsługa błędów by się przydała ale to później
    res.status(500);
    res.json({ message: "Database is not responding. Try again later." });
  }
});

module.exports = router;
