const WebAuthnStrategy = require("passport-fido2-webauthn");

class PassportService {
  init(store) {
    // TODO: Add ability to configure passport to use webauthn strategy
    // TODO: Add ability to serialize user
    // TODO: Add ability to deserialize user
  }

  useWebauthnStrategy(store) {
    return new WebAuthnStrategy({ store }, this.verify, this.register);
  }

  async verify(id, userHandle, done) {}

  async register(user, id, publicKey, done) {}
}

module.exports = PassportService;
