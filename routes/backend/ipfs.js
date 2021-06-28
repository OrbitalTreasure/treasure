const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY
);

const pinJSONToIPFS = (JSON) => {
  return pinata.pinJSONToIPFS(JSON, {pinataMetadata: {name: JSON.id}});
};

module.exports = { pinJSONToIPFS };
