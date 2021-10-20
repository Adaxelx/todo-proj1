const TodoModel = require("../models/Todo");

const genErrorObject = (message) => ({
  message,
});

const Todo = () => {
  const messages = {
    sendTask: {
      success: genErrorObject("Utworzono nowe zadanie!"),
      wrongTypeDescription: genErrorObject(
        "Nie właściwy typ description - oczekiwany typ: string"
      ),
      notUnique: genErrorObject("Istnieje już zadanie z takim opisem!"),
      required: (field) => genErrorObject(`Pole ${field} jest wymagane!`),
      toLong: (field, max) =>
        genErrorObject(
          `Pole ${field} jest ograniczone do ${max} znaków. Skróć wiadomość!`
        ),
    },
  };

  // POST request in routes/todo
  const sendTask = async (req, res, next) => {
    const { description } = req.body;

    try {
      const response = await TodoModel.create({ description });
      res.status(201);
      res.json(messages.sendTask.success);
    } catch (err) {
      const { path, properties, kind } = err?.errors?.description || {};
      if (kind === "required") {
        res.status(400);
        res.json(messages.sendTask.required(path));
      } else if (kind === "maxlength") {
        res.status(400);
        res.json(messages.sendTask.toLong(path, properties.maxlength));
      } else if (err.code === 11000) {
        res.status(409);
        res.json(messages.sendTask.notUnique);
      } else {
        res.status(500);
        res.json({ message: err.message || "Nieznany błąd." });
      }
    }
  };

  return { sendTask, messages };
};

module.exports = Todo();
