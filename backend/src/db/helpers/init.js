class Db {
  constructor() {
    this.client = require("@prisma/client");
  }

  init() {
    return new this.client.PrismaClient();
  }
}

module.exports = new Db().init();
