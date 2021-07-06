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
const {
  getPostDetails,
  generateAuthUrl,
  generateAccessToken,
  getUser,
} = require("./redditBot.js");
const {
  mapUser,
  getUserAddress,
  verifyOffer,
  decodeLogs,
} = require("./blockchain.js");
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
  getPostDetails(req.params.postId)
    .then((post) => {
      res.json(post);
    })
    .catch((redditError) => {
      db.collection("Posts")
        .doc(req.params.postId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            res.json({ ...doc.data(), live: false });
          } else {
            throw Error("This post does not exist!");
          }
        })
        .catch((firebaseError) => {
          res.status(404).json({
            errors: [redditError, firebaseError].map((e) => e.message),
          });
        });
    });
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
        const docs = docSnapshot.docs.map((doc) => doc.data());
        res.json(docs);
      } else {
        res.status(404).json("Document not found");
      }
    })
    .catch((e) => res.status(500).json(e));
});

router.get("/offers", (req, res) => {
  const limit = req.query.limit || 10;
  db.collection("Offers")
    .orderBy("createdAt")
    .limit(limit)
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.size > 0) {
        const docs = docSnapshot.docs.map((doc) => doc.data());
        res.json(docs);
      } else {
        res.status(404).json("Document not found");
      }
    })
    .catch((e) => res.status(500).json(e));
});

router.get("/getAuthUrl", (req, res) => {
  const state = req.query.state || "/";
  generateAuthUrl(state)
    .then((url) => {
      res.status(200).json(url);
    })
    .catch((e) => res.status(500).json);
});

router.get("/generateAccessToken", (req, res) => {
  const code = req.query.code;
  const accessPromise = generateAccessToken(code);
  const userPromise = accessPromise.then((r) => r.getMe());
  Promise.all([accessPromise, userPromise])
    .then(([token, userDetails]) => {
      res.status(200).json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        username: userDetails.name,
        userId: userDetails.id,
      });
    })
    .catch((e) => res.status(500).json(e));
});

//Blockchain endpoints

router.post("/blockchain/mapUser", (req, res) => {
  const data = req.body;
  mapUser(data.userId, data.userAddress)
    .then((receipt) => {
      const decoded = decodeLogs(
        [
          {
            indexed: false,
            internalType: "string",
            name: "userId",
            type: "string",
          },
          {
            indexed: false,
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
        ],
        receipt.logs[0].data,
        receipt.logs[0].topics
      );
      db.collection("Users")
        .doc(decoded.userId)
        .set({ metamaskAddress: decoded.userAddress });
      res.json({ userId: decoded.userId, userAddress: decoded.userAddress });
    })
    .catch((e) => {
      console.error(e);
      res.status(400).json(e.toString());
    });
});

router.get("/blockchain/getUserAddress/:userId", (req, res) => {
  const userId = req.params.userId;
  getUserAddress(userId)
    .then((e) => {
      res.json(e);
    })
    .catch(console.log);
});

router.get("/offers/from/:userId", (req, res) => {
  const userId = req.params.userId;
  db.collection("Offers")
    .where("userId", "==", userId)
    .get()
    .then((documentSnapshot) => documentSnapshot.docs.map((doc) => doc.data()))
    .then((offers) => {
      offers.sort((a, b) => b.createdAt - a.createdAt);
      res.json(offers);
    })
    .catch(console.error);
});

router.get("/offers/to/:sellerId", (req, res) => {
  const sellerId = req.params.sellerId;
  db.collection("Offers")
    .where("sellerId", "==", sellerId)
    .get()
    .then((documentSnapshot) => documentSnapshot.docs.map((doc) => doc.data()))
    .then((offers) => {
      offers.sort((a, b) => b.createdAt - a.createdAt);
      res.json(offers);
    })
    .catch(console.error);
});

router.get("/offers/for/:postId", (req, res) => {
  const postId = req.params.postId;
  db.collection("Offers")
    .where("post.id", "==", postId)
    .get()
    .then((documentSnapshot) => documentSnapshot.docs.map((doc) => doc.data()))
    .then((offers) => {
      offers.sort((a, b) => b.createdAt - a.createdAt);
      res.json(offers);
    })
    .catch(console.error);
});

router.post("/tokens/mint/:offerId", (req, res) => {
  const offerId = req.params.offerId;
  db.collection("Offers")
    .where("offerId", "==", parseInt(offerId))
    .get()
    .then((documentSnapshot) => documentSnapshot.docs.map((doc) => doc.data()))
    .then((offers) => {
      if (offers.length <= 0) {
        throw Error("No such offer");
      }
      const id = offers[0].post.id;
      const token = {
        ...offers[0].post,
        mintedAt: offers[0].createdAt,
        ownerId: offers[0].userId,
      };
      return [db.collection("Tokens").add(token), id];
    })
    .then(([docRef, id]) => {
      return db.collection("Offers").where("post.id", "==", id).get();
    })
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
        res.status(200).json("Successfully minted");
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(404).json(e);
    });
});

router.post("/tokens/changeOwner/:offerId", (req, res) => {
  const offerId = req.params.offerId;
  db.collection("Offers")
    .where("offerId", "==", parseInt(offerId))
    .get()
    .then((documentSnapshot) => documentSnapshot.docs.map((doc) => doc.data()))
    .then((offers) => {
      if (offers.length <= 0) {
        throw Error("No such offer");
      }
      const postId = offers[0].post.id;
      const ownerId = offers[0].userId;
      const deleteFromDbPromise = db
        .collection("Offers")
        .where("post.id", "==", postId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            throw Error("Change owner failed: no offer with this post");
          }
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
            console.log(`Successfull deleted offers with post id of ${postId}`);
          });
          return { status: "success" };
        });
      const changeTokenOwnerPromise = db
        .collection("Tokens")
        .where("id", "==", postId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            throw Error("Change owner failed: this post has no token");
          }
          querySnapshot.forEach((doc) => {
            db.collection("Tokens").doc(doc.id).update({ ownerId: ownerId });
            res.json({ status: "Successful" });
          });
          return { status: "success" };
        });
      Promise.all([deleteFromDbPromise, changeTokenOwnerPromise])
        .then(([succes1, success2]) => {
          res.json({ status: "success" });
        })
        .catch(console.log);
    });
});

router.get("/tokens/:userId", (req, res) => {
  const userId = req.params.userId;
  db.collection("Tokens")
    .where("ownerId", "==", userId)
    .get()
    .then((docSnapshot) => {
      return docSnapshot.docs.map((doc) => doc.data());
    })
    .then((tokens) => {
      res.json(tokens);
    })
    .catch((e) => res.status(404).json({ error: e }));
});

router.post("/blockchain/verify", (req, res) => {
  const body = req.body;
  const offerId = body.offerId;
  const postId = body.postId;
  const offer = parseInt(body.offer);
  const userId = body.userId;
  const username = body.username;
  const postDetailsPromise = getPostDetails(postId);
  const ipfsDetailsPromise = postDetailsPromise.then((postDetails) =>
    pinJSONToIPFS(postDetails)
  );
  Promise.all([postDetailsPromise, ipfsDetailsPromise]).then(
    ([postDetails, ipfsDetails]) => {
      const PostDetails = {
        ...postDetails,
        ipfsHash: ipfsDetails.IpfsHash,
      };
      const OfferDetails = {
        user: username,
        userId: userId,
        status: "offered",
        price: offer,
        post: PostDetails,
        createdAt: Date.parse(ipfsDetails.Timestamp),
      };
      verifyOffer(offerId, PostDetails.ipfsHash, PostDetails.authorId)
        .then((receipt) => {
          const decodedEvent = decodeLogs(
            [
              {
                indexed: false,
                internalType: "uint256",
                name: "offerId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "tokenUri",
                type: "string",
              },
              {
                indexed: false,
                internalType: "string",
                name: "sellerid",
                type: "string",
              },
            ],
            receipt.logs[0].data,
            receipt.logs[0].topics
          );
          const finalOffer = {
            ...OfferDetails,
            sellerId: decodedEvent.sellerid,
            offerId: parseInt(decodedEvent.offerId),
          };
          db.collection("Offers")
            .add(finalOffer)
            .then((e) => res.json(finalOffer))
            .catch((e) => res.status(400).json(e));
        })
        .catch((e) => {
          console.log(e);
          res.status(400).json(e);
        });
    }
  );
});

router.delete("/offers/:offerId", (req, res) => {
  const offerId = parseInt(req.params.offerId);
  db.collection("Offers")
    .where("offerId", "==", offerId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
        res.status(200).json("Successfully deleted");
      });
    })
    .catch(console.error);
});

router.delete("/offers/post/:postId", (req, res) => {
  const postId = req.params.postId;
  db.collection("Offers")
    .where("post.id", "==", postId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
        res.status(200).json("Successfully deleted");
      });
    })
    .catch(console.error);
});

//Test APIs
router.get("/reddit/user/:username", (req, res) => {
  const username = req.params.username;
  getUser(username)
    .then((e) => {
      res.json(e);
    })
    .catch(console.log);
});

module.exports = router;
