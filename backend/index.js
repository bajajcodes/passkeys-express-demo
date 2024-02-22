const express = require("express");
const layouts = require("express-ejs-layouts");
const path = require("path");
const router = require("./src/config/routes");
const expressSession = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./src/db/helpers/init");

const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(layouts);
app.use(express.static(__dirname + "/public"));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

//check if sessionStore.sync() method require to replicate as
//sessionStore.sync() of SequelizeStore
app.use(passport.authenticate("session"));

app.set("views", path.join(__dirname, "/src/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`Passkeys Express Demo App listening on port ${port}`);
});
