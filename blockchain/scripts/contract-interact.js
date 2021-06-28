require('dotenv').config();
const {ALCHEMY_API_URL, METAMASK_PRIVATE_KEY, METAMASK_PUBLIC_KEY} = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_API_URL);
const contract = require('../artifacts/contracts/TreasureTokenFactory.sol/TreasureTokenFactory.json')

const contractAddress = "0x2Be6AdCf521371e9110740545344C53b5aa9E7A2";
const TreasureFactoryContract = new web3.eth.Contract(contract.abi, contractAddress);

async function linkUser(userId, userAddress) {
    const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest'); // get latest nonce
    const gasEstimate = await TreasureFactoryContract.methods.mapUser(userId, userAddress).estimateGas(); // estimate gas

    // Create the transaction
    const tx = {
      'from': METAMASK_PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': gasEstimate, 
      'data': TreasureFactoryContract.methods.mapUser(userId, userAddress).encodeABI()
    };

    // Sign the transaction
    const signPromise = web3.eth.accounts.signTransaction(tx, METAMASK_PRIVATE_KEY);
    signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise failed:", err);
    });
}

async function main() {
    await linkUser("alehwfhkajfbkhja,ebf", "0xd1D328498cD990EEeF2a3a76302ba35EBc350115");
    console.log("It's done");
  }

  main();