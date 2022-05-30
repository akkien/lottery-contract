import { expect } from "chai";
import { ethers, network, upgrades } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { Lottery } from "../typechain/Lottery";
import { LotteryFactory } from "../typechain/LotteryFactory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "./lib/utils";

describe("Lottery", () => {
  const tokenName = "Tether USD";
  const tokenSymbol = "USDT";
  const tokenSupply = ethers.utils.parseEther("1000");
  const approveAmount = ethers.utils.parseEther("100");

  const betPrice = ethers.utils.parseEther("50");

  let deployer: SignerWithAddress;
  let creator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  let erc20: ERC20;
  let lotteryContract: Lottery;
  let factory: LotteryFactory;

  beforeEach("Init contract", async () => {
    [deployer, creator, user1, user2] = await ethers.getSigners();

    // ERC20
    const ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.deploy(tokenName, tokenSymbol, tokenSupply);
    await erc20.deployed();

    // Transfer to user1
    let transferTx = await erc20.transfer(
      user1.address,
      ethers.utils.parseEther("100")
    );
    await transferTx.wait();

    // Transfer to user2
    transferTx = await erc20.transfer(
      user2.address,
      ethers.utils.parseEther("100")
    );
    await transferTx.wait();

    // Deploy factory
    const LotteryFactory = await ethers.getContractFactory("LotteryFactory");
    factory = await LotteryFactory.deploy();
    await factory.deployed();

    // Create lottery
    const createLotteryTx = await factory
      .connect(creator)
      .createLottery(erc20.address, betPrice);
    await createLotteryTx.wait();

    // Retrieve lottery instance
    const myLotteryList = await factory.getMyLotteries(creator.address);

    const Lottery = await ethers.getContractFactory("Lottery");
    lotteryContract = Lottery.attach(myLotteryList[0]);

    // User1 approve token for contract
    let approveTx = await erc20
      .connect(user1)
      .approve(lotteryContract.address, approveAmount);
    await approveTx.wait();

    // User2 approve token for contract
    approveTx = await erc20
      .connect(user2)
      .approve(lotteryContract.address, approveAmount);
    await approveTx.wait();
  });

  it("Should init successfully", async () => {
    const paymentToken = await lotteryContract.paymentToken();
    expect(paymentToken).to.equal(erc20.address);
  });

  describe("Bet", () => {
    beforeEach(async () => {
      let betTx = await lotteryContract.connect(user1).bet(37);
      await betTx.wait();

      betTx = await lotteryContract.connect(user2).bet(37);
      await betTx.wait();
    });

    it("Should bet successfully", async () => {
      const myBet = await lotteryContract.betNumber(user1.address);
      expect(myBet).to.equal(37);
    });

    it("Should stop fail: not creator", async () => {
      await expect(lotteryContract.adminStop()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should stop successfully", async () => {
      const stopTx = await lotteryContract.connect(creator).adminStop();
      await stopTx.wait();

      const creatorBalance = await erc20.balanceOf(creator.address);
      console.log(
        "creatorBalance",
        ethers.utils.formatUnits(creatorBalance, "ether")
      );
      expect(creatorBalance).to.equal(ethers.utils.parseEther("10"));

      const winnerBalance = await erc20.balanceOf(user2.address);
      console.log(
        "winnerBalance",
        ethers.utils.formatUnits(winnerBalance, "ether")
      );
      expect(winnerBalance).to.equal(ethers.utils.parseEther("95"));
    });

    it("Should bet fail: owner", async () => {
      await expect(lotteryContract.connect(creator).bet(11)).to.be.revertedWith(
        "Lottery: Owner cannot play"
      );
    });

    it("Should bet fail: lottery end", async () => {
      const stopTx = await lotteryContract.connect(creator).adminStop();
      await stopTx.wait();

      await expect(lotteryContract.connect(user1).bet(11)).to.be.revertedWith(
        "Lottery: Lottery ended"
      );
    });
  });
});
