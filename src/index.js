console.log("hi");

const express = require("express");
const app = express();
const path = require("path");
const port = 4000;

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api/v1", require("../routes/backend/api.js"));

app.get("*", (req, res) => {
  res.sendfile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => {
  console.log("ExpressJS Server Running at http://localhost:" + port);
});
