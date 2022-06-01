import { ethers, upgrades } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { Lottery } from "../typechain/Lottery";
import { LotteryFactory } from "../typechain/LotteryFactory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "../test/lib/utils";

const BN = ethers.BigNumber;

async function main() {
  const tokenName = "Kien USD";
  const tokenSymbol = "USDK";
  const tokenSupply = ethers.utils.parseEther("1000");
  const approveAmount = ethers.utils.parseEther("10");

  const betPrice = ethers.utils.parseEther("5");

  let deployer: SignerWithAddress;
  let creator: SignerWithAddress;
  let user1: SignerWithAddress;

  let erc20: ERC20;
  let lotteryContract: Lottery;
  let factory: LotteryFactory;

  [deployer, creator, user1] = await ethers.getSigners();

  // ERC20
  const ERC20 = await ethers.getContractFactory("ERC20");

  erc20 = await ERC20.deploy(tokenName, tokenSymbol, tokenSupply);
  await erc20.deployed();
  console.log("erc20", erc20.address);

  // Transfer to user1
  const transferTx = await erc20.transfer(
    user1.address,
    ethers.utils.parseEther("100")
  );
  await transferTx.wait();

  // Deploy factory
  const LotteryFactory = await ethers.getContractFactory("LotteryFactory");
  factory = await LotteryFactory.deploy();
  await factory.deployed();
  console.log("Factory", factory.address);

  // Create lottery
  const createLotteryTx = await factory
    .connect(creator)
    .createLottery(erc20.address, betPrice);
  await createLotteryTx.wait();

  // Retrieve lottery instance
  const myLotteryList = await factory.getMyLotteries(creator.address);

  const Lottery = await ethers.getContractFactory("Lottery");
  lotteryContract = Lottery.attach(myLotteryList[0]);
  console.log("lotteryContract", lotteryContract.address);

  // User1 approve token for contract
  const approveTx = await erc20
    .connect(user1)
    .approve(lotteryContract.address, approveAmount);
  await approveTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
