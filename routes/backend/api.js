const express = require("express");

const router = express.Router();

router.get("/:id", (req, res) => {
  res.json(["hi"]);
});

module.exports = router;
