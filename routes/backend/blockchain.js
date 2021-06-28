const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY, METAMASK_PUBLIC_KEY } =
  process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_API_URL);
const contract = require("../../src/assets/TreasureTokenFactory.json");
const contractAddress = "0x055FBE752E37982476B54321D7BbE0DCA959D980";
const TreasureFactoryContract = new web3.eth.Contract(
  contract.abi,
  contractAddress
);

const mapUser = async (userId, userAddress) => {
  const nonce = await web3.eth.getTransactionCount(
    METAMASK_PUBLIC_KEY,
    "latest"
  ); // get latest nonce
  const gasEstimate = await TreasureFactoryContract.methods
    .mapUser(userId, userAddress)
    .estimateGas({ from: METAMASK_PUBLIC_KEY }); // estimate gas

  const tx = {
    from: METAMASK_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: gasEstimate,
    data: TreasureFactoryContract.methods
      .mapUser(userId, userAddress)
      .encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(
    tx,
    METAMASK_PRIVATE_KEY
  );
  return signPromise.then((signedTx) => {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  });
};

const getUserAddress = (userId) => {
  const address = TreasureFactoryContract.methods.getAddress(userId).call();
  return address;
};

const verifyOffer = async (offerId, tokenUri, sellerId) => {
  const nonce = await web3.eth.getTransactionCount(
    METAMASK_PUBLIC_KEY,
    "latest"
  ); // get latest nonce

  const gasEstimate = await TreasureFactoryContract.methods
    .verifyOffer(offerId, tokenUri, sellerId)
    .estimateGas({ from: METAMASK_PUBLIC_KEY }); // estimate gas

  const tx = {
    from: METAMASK_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: gasEstimate * 3,
    data: TreasureFactoryContract.methods
      .verifyOffer(offerId, tokenUri, sellerId)
      .encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(
    tx,
    METAMASK_PRIVATE_KEY
  );

  return signPromise.then((signedTx) => {
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  });
};

const decodeLogs = (inputs, hexString, topics) => {
  return web3.eth.abi.decodeLog(inputs, hexString, topics);
};

module.exports = { mapUser, getUserAddress, verifyOffer, decodeLogs };
