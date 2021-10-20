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

    getTask: {
      success: genErrorObject("Pobrano listę zadań!"),
    },

    deleteTask: {
      success: genErrorObject("Usunięto obiekt"),
      notExists: genErrorObject("Obiekt nie istnieje!")
    },

    updateTask: {
      success: genErrorObject("Zaktualizowano obiekt!"),
      notExists: genErrorObject("Obiekt o podanym ID nie istnieje!"),
      invalidId: genErrorObject("ID ma nieprawidłowy format!")
    }

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

  const getTasks = async (req, res, next) => {

    try {

      const response = await TodoModel.find({});
      res.status(200);
      res.json({ ...messages.getTask.success, data: response });
    } catch (err) {
      res.status(500);
      res.json({ message: err.message || "Nieznany błąd." });
    }
  }

  const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
      const response = await TodoModel.deleteOne({ _id: id });
      if (response.deletedCount === 0) {
        res.status(404);
        res.json(messages.deleteTask.notExists);
        return;
      }
      res.json(messages.deleteTask.success);

    } catch (err) {
      if (err.kind === "ObjectId") {
        res.status(404)
        res.json(messages.updateTask.invalidId);
      }
      else {
        res.status(500);
        res.json({ message: err.message || "Nieznany błąd." });
      }
    }

  }

  const updateTask = async (req, res, next) => {
    const { id } = req.params;
    try {
      const response = await TodoModel.findOne({ _id: id });

      if (!response) {
        res.status(404);
        res.json(messages.updateTask.notExists);
        return
      }
      const { isDone } = response;

      const responseUpdate = await TodoModel.updateOne({ _id: id }, { isDone: !isDone });
      res.json(messages.updateTask.success);
    }
    catch (err) {
      if (err.kind === "ObjectId") {
        res.status(404)
        res.json(messages.updateTask.invalidId);
      }
      else {
        res.status(500);
        res.json({ message: err.message || "Nieznany błąd." });
      }
    }
  }

  return { sendTask, messages, getTasks, deleteTask, updateTask };
};

module.exports = Todo();
