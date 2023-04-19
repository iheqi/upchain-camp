require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();

const { ALCHEMY_API_KEY, GOERLI_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;


module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
    // mumbai: {
    //   url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
    //   accounts: {
    //     mnemonic: mnemonic,
    //   },
    //   chainId: 80001,
    // },

    // sepolia: {
    //   url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    //   accounts: {
    //     mnemonic: mnemonic,
    //   },
    //   chainId: 11155111,
    // },
  },
  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};
