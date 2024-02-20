const express = require("express");
const router = express.Router();

const pages = new (require("../controllers/pages"))();
const auth = new (require("../controllers/auth"))();
const admin = new (require("../controllers/admin"))();

const PassportService = require("../services/passport-service");
const SessionChallengeStore =
  require("passport-fido2-webauthn").SessionChallengeStore;

const passportService = new PassportService();
const store = new SessionChallengeStore();

passportService.init(store);

router.get("/", pages.welcome, admin.dashboard);
router.get("/register", auth.register);
router.get("/login", auth.login);

module.exports = router;
