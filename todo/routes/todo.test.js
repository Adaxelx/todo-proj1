const supertest = require("supertest");

const app = require("../app");

const TodoModel = require("../models/Todo");
const { messages } = require("../controllers/todo");
const request = supertest(app);

describe("Todo", () => {
  it("should create task", async () => {
    const response = await request.post("/todo").send({
      description: "Opis",
    });
    expect(response.body).toEqual(messages.sendTask.success);
    expect(response.status).toBe(201);
  });
});
