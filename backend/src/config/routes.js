const { Router } = require("express");
const { SessionChallengeStore } = require("passport-fido2-webauthn");
const { AdminController } = require("../controllers/admin");
const { AuthController } = require("../controllers/auth");
const { PagesController } = require("../controllers/pages");
const { PassportService } = require("../services/passport-service");

const router = Router();

/**
 * INFO: using following syntax because of this eslint error message:
 * "Enforce unbound methods are called with their expected scope."
 * REF:https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/unbound-method.md
 */
//TODO: Avoid referencing unbound methods which may cause unintentional scoping of `this`.
const { welcome } = new PagesController();
const { dashboard } = new AdminController();
const auth = new AuthController();

const passportService = new PassportService();
const store = new SessionChallengeStore();

passportService.init(store);

router.get("/", welcome, dashboard);
router.get("/register", auth.register);
router.post("/register/public-key/challenge", auth.createChallengeFrom(store));
router.get("/login", auth.login);
router.post(
  "/login/public-key",
  auth.passportCheck(),
  auth.admitUser,
  auth.denyUser
);
router.post("/logout", auth.logout);

module.exports = router;
