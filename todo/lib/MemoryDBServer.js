const { MongoMemoryServer } = require("mongodb-memory-server");

const config = async () => {
  const mongod = await MongoMemoryServer.create();

  return {
    mongod,
    // start: () => mongod.start(),
    stop: () => mongod.stop(),
    getUri: () => mongod.getUri(),
  };
};

module.exports = config();
