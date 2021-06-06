const express = require("express");
const firebase = require("firebase");
require("firebase/firestore");
const router = express.Router();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};
firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

router.use("/redditBot", require());

router.post("/users", (req, res) => {
  const data = req.body;
  data.forEach((e) => {
    db.collection("users").doc(e.id).set({ metamaskId: e.metamaskId });
  });
  // db.collection("users").set(r)
  res.json(["hi"]);
});

module.exports = router;
