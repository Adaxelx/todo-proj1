const MemoryDatabaseServer = require("../lib/MemoryDBServer");

module.exports = async () => {
  const MemoryDBServer = await MemoryDatabaseServer;
  await MemoryDBServer.stop();
};
