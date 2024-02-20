const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";
const path = require("path");
const layouts = require("express-ejs-layouts");

app.use(layouts);
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "src/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

app.use("/", require("./src/config/routes"));

app.listen(port, () => {
  console.log(`Passkeys Express Demo App listening on port ${port}`);
});
