const passport = require("passport");
const WebAuthnStrategy = require("passport-fido2-webauthn");
const prisma = require("../db/helpers/init");

class PassportService {
  init(store) {
    // TODO: Add ability to configure passport to use webauthn strategy
    passport.use(this.useWebauthnStrategy(store));
    // TODO: Add ability to serialize user
    // TODO: Add ability to deserialize user
  }

  useWebauthnStrategy(store) {
    return new WebAuthnStrategy({ store }, this.verify, this.register);
  }

  verify = (externalId, userHandle, done) => {
    return prisma.$transaction(async (tx) => {
      const currentCredentials = await tx.publicKeyCredentials.findUnique({
        where: {
          //I am 100% externalId is not userID
          //How it will be used IDK, let' see
          externalId: externalId,
        },
      });

      if (!currentCredentials) {
        return done(null, false, { message: "Invalid key. " });
      }

      const currentUser = await tx.user.findUnique({
        where: {
          id: credentials.userId,
        },
      });

      if (!currentUser) {
        return done(null, false, { message: "No such user. " });
      }

      //IDK why binaries is stored and compared here, req to check video.
      //DivRhnio comment: Compare user record's handle to the handle we pass in
      //Assumption: handler, userHandle both are usernames, as originally author has used emailId as primary source of unique user identification from public directory
      if (Buffer.compare(currentUser.handle, userHandle) !== 0) {
        return done(null, false, { message: "Handles do not match. " });
      }

      return done(null, currentCredentials, currentCredentials.publicKey);
    });
  };

  register = (user, id, publicKey, done) => {};
}

module.exports = { PassportService };
