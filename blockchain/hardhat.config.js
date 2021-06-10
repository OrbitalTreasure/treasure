/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");

const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.7.3",
    settings: { optimizer: { enabled: true, runs: 1000 } },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ropsten: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`],
    },
    localhost: {},
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    diambiguatePaths: false,
  },
};
