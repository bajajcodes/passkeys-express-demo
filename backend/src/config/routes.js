const express = require("express");
const router = express.Router();

const pages = new (require("../controllers/pages"))();

router.get("/", pages.welcome);

module.exports = router;
