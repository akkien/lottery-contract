import { expect } from "chai";
import { ethers, network, upgrades } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "./lib/utils";

describe("Lottery", () => {
  const tokenName = "Tether USD";
  const tokenSymbol = "USDT";
  const tokenSupply = ethers.utils.parseEther("1000");

  const totalSupply = 1000000;
  const startTime = time.now();
  const endTime = time.timeFromNow(2 * 24 * 3600); // 2 days
  const nftPrice = ethers.utils.parseEther("0.5");

  let deployer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;

  let erc20: ERC20;

});
