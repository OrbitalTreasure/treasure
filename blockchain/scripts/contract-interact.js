require('dotenv').config();
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_API_URL);