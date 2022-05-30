import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20 } from "../typechain/ERC20";

describe("ERC20", () => {
  const tokenName = "Tether USD";
  const tokenSymbol = "USDT";
  const supply = 1000000;

  let deployer: any;
  let erc20: ERC20;

  beforeEach("Init contract", async () => {
    [deployer] = await ethers.getSigners();

    // ERC20
    const ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.deploy(tokenName, tokenSymbol, supply);
    await erc20.deployed();
  });

  it("Should init successfully", async () => {
    const receivedName = await erc20.name();
    expect(receivedName).to.equal(tokenName);

    const ownerBalance = await erc20.balanceOf(deployer.address);
    expect(ownerBalance).to.equal(supply);
  });
});
