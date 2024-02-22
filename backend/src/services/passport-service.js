const passport = require("passport");
const WebAuthnStrategy = require("passport-fido2-webauthn");
const prisma = require("../db/helpers/init");

//externalId is credentialId of the user.
class PassportService {
  init(store) {
    // TODO: Add ability to configure passport to use webauthn strategy
    passport.use(this.useWebauthnStrategy(store));
    // TODO: Add ability to serialize user
    passport.serializeUser(this.serialiseUserFn);
    // TODO: Add ability to deserialize user
    passport.deserializeUser(this.deserialiseUserFn);
  }

  useWebauthnStrategy = (store) => {
    return new WebAuthnStrategy({ store }, this.verify, this.register);
  };

  serialiseUserFn = (user, done) => {
    process.nextTick(() => {
      return done(null, { id: user.id, email: user.email });
    });
  };

  deserialiseUserFn = (user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  };

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

  /**
   * The id is used as externalId here, for the publicKeyCredentials record.
   * Also the id will be used to idenitfy publicKeyCredentials.
   */
  register = (user, id, publicKey, done) => {
    return prisma.$transaction(async (tx) => {
      //create new user using username
      // now i am getting to make sense id or externalId or handle  is id from userdevice to idenitfy user assocaiation with the domain (i guess)
      const newUser = await tx.user.create({
        data: {
          username: user.name,
          handle: user.id,
        },
      });

      if (!newUser) {
        return done(null, false, { message: "Could not create user. " });
      }

      //create new publicKeyCredentials from newUser.id, passed in id, and the passed-in publicKey

      const newCredentials = await tx.publicKeyCredentials.create({
        data: {
          userId: newUser.id,
          externalId: id,
          publicKey: publicKey,
        },
      });

      if (!newCredentials) {
        return done(null, false, { message: "Could not create public key. " });
      }

      return done(null, newUser);
    });
  };
}

module.exports = { PassportService };
