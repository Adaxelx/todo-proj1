const TodoModel = require("../models/Todo");

const Todo = () => {
  const messages = {
    sendTask: {
      success: { message: "Utworzono nowe zadanie!" },
    },
  };

  const sendTask = async (req, res, next) => {
    const { description } = req.body;
    try {
      const response = await TodoModel.create({ description });
      res.status(201);
      res.json(messages.sendTask.success);
    } catch (err) {
      // tutaj lepsza obsługa błędów by się przydała ale to później
      res.status(500);
      res.json({ message: err.message });
    }
  };

  return { sendTask, messages };
};

module.exports = Todo();
