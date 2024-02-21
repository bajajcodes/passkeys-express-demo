const express = require("express");
const layouts = require("express-ejs-layouts");
const path = require("path");
const router = require("./src/config/routes");

const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.use(layouts);
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "/src/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`Passkeys Express Demo App listening on port ${port}`);
});
