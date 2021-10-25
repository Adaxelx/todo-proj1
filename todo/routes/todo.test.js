const supertest = require("supertest");

const app = require("../app");

const TodoModel = require("../models/Todo");
const { messages } = require("../controllers/todo");
const request = supertest(app);
const { build, fake } = require("@jackfranklin/test-data-bot");
const { disconnect, connect } = require("../helpers/database");
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

const updateTask = async (task) => {
  await request.post("/todo").send(task);
  const beforeGetResponse = await request.get("/todo");
  const taskId = beforeGetResponse.body.data[0]._id;
  const response = await request.patch("/todo/" + taskId + "/toggle");
  const afterGetResponse = await request.get("/todo");

  return {
    beforeTask: beforeGetResponse.body.data[0],
    afterTask: afterGetResponse.body.data[0],
    patchResponse: response,
  };
};

const deleteTask = async (task) => {
  await request.post("/todo").send(task);
  const beforeGetResponse = await request.get("/todo");
  const taskId = beforeGetResponse.body.data[0]._id;
  const response = await request.delete("/todo/" + taskId);
  const afterGetResponse = await request.get("/todo");

  return {
    beforeTask: beforeGetResponse.body.data[0],
    afterTask: afterGetResponse.body.data[0],
    deleteResponse: response,
    taskId: taskId,
  };
};

const getTask = async (task) => {
  const response = await request.get("/todo");
  expect(response.body.message).toEqual(messages.getTask.success.message);
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

  describe("PATCH - update task", () => {
    beforeAll(async () => {
      await connect();
    });

    it("should update task", async () => {
      const { beforeTask, afterTask, patchResponse } = await updateTask(toDo());
      const isDoneBefore = beforeTask.isDone;
      const isDoneAfter = afterTask.isDone;

      expect(isDoneAfter).toEqual(!isDoneBefore);
      expect(patchResponse.body).toEqual(messages.updateTask.success);
      expect(patchResponse.status).toBe(200);
    });

    it("should not change not changeable params", async () => {
      const { beforeTask, afterTask } = await updateTask(toDo());
      const descriptionBefore = beforeTask.description;
      const descriptionAfter = afterTask.description;

      expect(descriptionAfter).toEqual(descriptionBefore);
    });

    it("should return error message if task don't exist", async () => {
      const id = "000000000000000000000000";
      const response = await request.patch("/todo/" + id + "/toggle");

      expect(response.body).toEqual(messages.updateTask.notExists);
      expect(response.status).toBe(404);
    });

    it("should return error message if id is not 24 characters string", async () => {
      const invalidId = "a1";
      const response = await request.patch("/todo/" + invalidId + "/toggle");

      expect(response.body).toEqual(messages.updateTask.invalidId);
      expect(response.status).toBe(404);
    });

    it("should handle unexpected error (for example not connected db)", async () => {
      await request.post("/todo").send(toDo());
      const getResponse = await request.get("/todo");
      const taskId = getResponse.body.data[0]._id;

      await disconnect();
      const response = await request.patch("/todo/" + taskId + "/toggle");

      expect(response.body.message).toMatchInlineSnapshot(
        `"MongoClient must be connected to perform this operation"`
      );
      expect(response.status).toBe(500);
    });
  });

  describe("GET - get tasks", () => {
    beforeAll(async () => {
      await connect();
    });

    it("should get tasks", async () => {
      await getTask(toDo());
    });

    it("should get current list", async () => {
      const beforeGetResponse = await request.get("/todo");
      await createTask(toDo());
      const afterGetResponse = await request.get("/todo");
      expect(Object.keys(beforeGetResponse.body.data).length + 1).toEqual(
        Object.keys(afterGetResponse.body.data).length
      );
    });

    it("should handle unexpected error (for example not connected db)", async () => {
      await disconnect();
      const response = await request.get("/todo");

      expect(response.body.message).toMatchInlineSnapshot(
        `"MongoClient must be connected to perform this operation"`
      );
      expect(response.status).toBe(500);
    });
  });

  describe("DELETE - get tasks", () => {
    beforeAll(async () => {
      await connect();
    });

    it("should delete task", async () => {
      const { beforeTask, afterTask, deleteResponse } = await deleteTask(
        toDo()
      );

      expect(deleteResponse.body).toEqual(messages.deleteTask.success);
      expect(deleteResponse.status).toBe(200);
    });

    it("should return error message if id is uncorrect", async () => {
      await request.post("/todo").send(toDo());
      const beforeGetResponse = await request.get("/todo");
      const id = "00000000000";
      const response = await request.delete("/todo/" + id);

      expect(response.body).toEqual(messages.updateTask.invalidId);
      expect(response.status).toBe(404);
    });

    it("should return error message if object was delete earlier", async () => {
      const { beforeTask, afterTask, deleteResponse, taskId } =
        await deleteTask(toDo());
      const response = await request.delete("/todo/" + taskId);

      expect(response.body).toEqual(messages.deleteTask.notExists);
      expect(response.status).toBe(404);
    });

    it("should handle unexpected error (for example not connected db)", async () => {
      await request.post("/todo").send(toDo());
      const beforeGetResponse = await request.get("/todo");
      const taskId = beforeGetResponse.body.data[0]._id;

      await disconnect();
      const response = await request.delete("/todo/" + taskId);

      expect(response.body.message).toMatchInlineSnapshot(
        `"MongoClient must be connected to perform this operation"`
      );
      expect(response.status).toBe(500);
    });
  });
});
