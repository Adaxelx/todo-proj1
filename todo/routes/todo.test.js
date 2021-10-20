const supertest = require("supertest");

const app = require("../app");

const TodoModel = require("../models/Todo");
const { messages } = require("../controllers/todo");
const request = supertest(app);
const { build, fake } = require("@jackfranklin/test-data-bot");
const { disconnect } = require("../helpers/database");
const toDo = build("Todo", {
  fields: {
    description: fake((f) => f.lorem.sentence()),
  },
});

const createTask = async (task) => {
  const response = await request.post("/todo").send(task);
  expect(response.body).toEqual(messages.sendTask.success);
  expect(response.status).toBe(201);
};

const exacly100Letters =
  "A9nYQTzzWzOhszNmohNkyFycbarWVzLwiVB5mWcaDVBg1WSSu4mpQJj5qhKnAN5XUq07YZ6bO4c97SmJTI0oNaXhvUuTXxyTU61H";

describe("Todo", () => {
  describe("POST - add task", () => {
    it("should create task", async () => {
      await createTask(toDo());
      const almostToLong = toDo({
        overrides: { description: exacly100Letters },
      });
      await createTask(almostToLong);
    });

    it("should return error message if body is empty", async () => {
      const response = await request.post("/todo").send();

      expect(response.body).toEqual(messages.sendTask.required("description"));
      expect(response.status).toBe(400);
    });

    it("should return error message if description is not unique", async () => {
      const todoObject = toDo();
      const response1 = await request.post("/todo").send(todoObject);
      const response2 = await request.post("/todo").send(todoObject);

      expect(response2.body).toEqual(messages.sendTask.notUnique);
      expect(response2.status).toBe(409);
    });

    it("should return error message if description is to long (more than 100 characters)", async () => {
      const todoObject = toDo({
        overrides: { description: fake((f) => f.lorem.sentence(120)) },
      });
      const response = await request.post("/todo").send(todoObject);

      expect(response.body).toEqual(
        messages.sendTask.toLong("description", 100)
      );
      expect(response.status).toBe(400);
    });

    it("should handle unexpected error (for example not connected db)", async () => {
      await disconnect();
      const response = await request.post("/todo").send(toDo());

      expect(response.body.message).toMatchInlineSnapshot(
        `"MongoClient must be connected to perform this operation"`
      );
      expect(response.status).toBe(500);
    });

    it("should return error message if description is passed as empty string", async () => {
      const response = await request.post("/todo").send({ description: "" });

      expect(response.body).toEqual(messages.sendTask.required("description"));
      expect(response.status).toBe(400);
    });
  });
});
