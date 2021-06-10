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
const { getPostDetails, get20HotPosts } = require("./redditBot.js");
const { pinJSONToIPFS } = require("./ipfs.js");

router.post("/users", (req, res) => {
  const data = req.body;
  data.forEach((e) => {
    db.collection("Users").doc(e.id).set({ metamaskAddress: e.metamaskId });
  });
});

//Used to add a post to the db, as well as upload the post onto ipfs
router.post("/posts/:postId", (req, res) => {
  const postDetailsPromise = getPostDetails(req.params.postId);
  const ipfsDetailsPromise = postDetailsPromise.then((postDetails) =>
    pinJSONToIPFS(postDetails)
  );
  Promise.all([postDetailsPromise, ipfsDetailsPromise]).then(
    ([postDetails, ipfsDetails]) => {
      const combinedData = {
        ...postDetails,
        ipfsHash: ipfsDetails.IpfsHash,
        createdAt: Date.parse(ipfsDetails.Timestamp),
      };
      db.collection("Posts")
        .doc(req.params.postId)
        .set(combinedData)
        .then(() => res.status(200).json(combinedData))
        .catch(console.log);
    }
  );
});

// Used to get post details from the postId
router.get("/posts/:postId", (req, res) => {
  db.collection("Posts")
    .doc(req.params.postId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404);
      }
    })
    .catch((error) => console.log(error));
});

router.get("/posts/ipfs/:ipfsHash", (req, res) => {
  db.collection("Posts")
    .where("ipfsHash", "==", req.params.ipfsHash)
    .get()
    .then((data) => {
      if (data.exists) {
        res.json(data.docs[0].data());
      } else {
        res.status(404).json("Document not found");
      }
    })
    .catch(console.log);
});

router.get("/posts", (req, res) => {
  const limit = req.query.limit || 10;
  db.collection("Posts")
    .orderBy("createdAt")
    .limit(limit)
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.size > 0) {
        const docs = docSnapshot.docs.map(doc => doc.data());
        res.json(docs)
      } else {
        res.status(404).json("Document not found");
      }
    })
    .catch((e) => res.status(500).json(e));
});

// Remove in the future
router.get("/getPosts", (req, res) => {
  get20HotPosts().then((data) => {
    const postIds = [...data];
    postIds.map((id) => {
      const postDetailsPromise = getPostDetails(id);
      const ipfsDetailsPromise = postDetailsPromise.then((postDetails) =>
        pinJSONToIPFS(postDetails)
      );
      Promise.all([postDetailsPromise, ipfsDetailsPromise]).then(
        ([postDetails, ipfsDetails]) => {
          const combinedData = {
            ...postDetails,
            ipfsHash: ipfsDetails.IpfsHash,
            createdAt: Date.parse(ipfsDetails.Timestamp),
          };
          db.collection("Posts")
            .doc(id)
            .set(combinedData)
            .then(() => res.status(200).json(combinedData))
            .catch(console.log);
        }
      );
    });
  });
});

module.exports = router;
