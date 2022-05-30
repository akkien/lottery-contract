import { ethers, upgrades } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { EddaVerseDrop } from "../typechain/EddaVerseDrop";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "../test/lib/utils";

const BN = ethers.BigNumber;

async function main() {
  const AddressZero = ethers.constants.AddressZero;

  let deployer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;

  let eddaVerseDrop: EddaVerseDrop;

  [deployer, user1, treasury] = await ethers.getSigners();

  // EddaVerseDrop
  console.log("Deploy EddaVerseDrop ...");
  const EddaVerseDrop = await ethers.getContractFactory("EddaVerseDrop");
  eddaVerseDrop = await EddaVerseDrop.deploy();
  await eddaVerseDrop.deployed();
  console.log("eddaVerseDrop address:", eddaVerseDrop.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
