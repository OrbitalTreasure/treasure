console.log("hi");

const express = require("express");
const app = express();
const port = 3000;

app.use('/', require("../routes/frontend/dashboard.js"))
app.use("/api/v1", require("../routes/backend/api.js"))

app.listen(port, () => {
  console.log("ExpressJS Server Running");
});
