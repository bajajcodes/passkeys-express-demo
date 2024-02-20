const express = require("express");
const router = express.Router();

const pages = new (require("../controllers/pages"))();
const auth = new (require("../controllers/auth"))();
const admin = new (require("../controllers/admin"))();

router.get("/", pages.welcome, admin.dashboard);
router.get("/register", auth.register);
router.get("/login", auth.login);

module.exports = router;
