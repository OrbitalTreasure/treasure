require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use("/api/v1", require("../routes/backend/api.js"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log("ExpressJS Server Running at http://localhost:" + port);
});
