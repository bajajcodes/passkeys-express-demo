const { PrismaClient } = require("@prisma/client");
const WebAuthnStrategy = require("passport-fido2-webauthn");
const prisma = new PrismaClient();

class PassportService {
  init(_) {
    // TODO: Add ability to configure passport to use webauthn strategy
    // TODO: Add ability to serialize user
    // TODO: Add ability to deserialize user
  }

  useWebauthnStrategy(store) {
    return new WebAuthnStrategy({ store }, this.verify, this.register);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verify = (_id, _userHandle, _done) => {
    return;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register = (_user, _id, _publicKey, _done) => {};
}

module.exports = { PassportService };
