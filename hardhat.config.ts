import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: [
        process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "",
        process.env.PRIVATE_KEY_2 ? process.env.PRIVATE_KEY_2 : "",
        process.env.PRIVATE_KEY_3 ? process.env.PRIVATE_KEY_3 : "",
      ],
      timeout: 8000000,
      gasPrice: 20000000000, // 20 Gwei
    },
    bscTest: {
      url: "https://data-seed-prebsc-1-s1.binance.org",
      accounts: [
        process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "",
        process.env.PRIVATE_KEY_2 ? process.env.PRIVATE_KEY_2 : "",
        process.env.PRIVATE_KEY_3 ? process.env.PRIVATE_KEY_3 : "",
      ],
      timeout: 8000000,
      gasPrice: 20000000000, // 20 Gwei
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
