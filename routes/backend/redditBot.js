const Snoowrap = require("snoowrap");
const axios = require("axios");

const {
  REDDIT_BOT_CLIENT_ID,
  REDDIT_BOT_CLIENT_SECRET,
  REDDIT_USERNAME,
  REDDIT_PASSWORD,
} = process.env;

const makeRequester = () => {
  return new Snoowrap({
    userAgent: "Treasure-Reddit-Bot v1",
    clientId: REDDIT_BOT_CLIENT_ID,
    clientSecret: REDDIT_BOT_CLIENT_SECRET,
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
  });
};

const getPostDetails = async (postId) => {
  const url = `https://api.reddit.com/api/info/?id=t3_${postId}`;
  return axios({ url: url, method: "get", mode: "cors" })
    .then((body) => {
      const data = body.data.data.children[0].data;
      return (({
        title,
        id,
        author,
        selftext,
        ups,
        num_comments,
        created,
        url,
        permalink,
        author_fullname,
        subreddit
      }) => ({
        title,
        id,
        author,
        selftext,
        upvotes: ups,
        num_comments,
        createdAt: created,
        imageUrl: `https://www.reddit.com${permalink}` == url ? null : url,
        url: `https://www.reddit.com${permalink}`,
        authorId: author_fullname.slice(3),
        subreddit
      }))(data);
    })
    .catch((e) => console.log(e));
};

const get20HotPosts = () => {
  const r = makeRequester();
  return r
    .getHot({ limit: 20 })
    .then((listOfPosts) => listOfPosts.map((post) => post.id));
};

module.exports = { getPostDetails, get20HotPosts };
