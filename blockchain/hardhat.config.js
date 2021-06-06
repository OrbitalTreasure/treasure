/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ropsten: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`],
    },
    localhost: {},
  },
};
