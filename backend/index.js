const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Passkeys Express Demo App listening on port ${port}`);
});
