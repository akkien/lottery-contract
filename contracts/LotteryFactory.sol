// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/ILotteryFactory.sol";
import "./Lottery.sol";
import "hardhat/console.sol";

/** TO UPDATE
 *  set treasury address insteadof owner address
 */

contract LotteryFactory is ILotteryFactory {
    uint256 public totalLottery;

    struct LotteryGame {
        address creator;
        address paymentToken;
        uint256 price;
    }

    mapping(address => LotteryGame) public lottery;
    mapping(address => address[]) public lotteries;

    event LotteryCreate(
        address indexed creator,
        address indexed paymentToken,
        uint256 indexed price
    );

    /** User function */
    function createLottery(address paymentToken, uint256 price) external {
        Lottery newLottery = new Lottery(paymentToken, price);
        newLottery.transferOwnership(msg.sender);

        lottery[address(newLottery)] = LotteryGame(
            msg.sender,
            paymentToken,
            price
        );
        lotteries[msg.sender].push(address(newLottery));
        emit LotteryCreate(msg.sender, paymentToken, price);
    }

    /** Getter function */
    function getMyLotteries(address user)
        external
        view
        returns (address[] memory)
    {
        return lotteries[user];
    }
}
