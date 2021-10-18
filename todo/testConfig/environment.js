const NodeEnvironment = require("jest-environment-node");

const MemoryDatabaseServer = require("../lib/MemoryDBServer");

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    const MemoryDBServer = await MemoryDatabaseServer;
    this.global.__DB_URL__ = MemoryDBServer.getUri();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
