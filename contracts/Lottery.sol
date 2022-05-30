// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/ILottery.sol";
import "hardhat/console.sol";

/** TO UPDATE
 * set treasury address insteadof owner address
 * block.timestamp is better for random
 */

contract Lottery is Ownable, ILottery {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public paymentToken;
    uint256 public price;

    uint256 public winNumber;
    bool public ended;

    address[] public players;
    mapping(address => bool) public isPlayers;
    mapping(address => uint256) public betNumber;

    event Bet(address indexed player, uint256 indexed number);
    event LotteryEnd(uint256 indexed timestamp);

    constructor(address paymentToken_, uint256 price_) Ownable() {
        price = price_;
        paymentToken = paymentToken_;
    }

    /** Modifier */
    modifier notEnded() {
        require(!ended, "Lottery: Lottery ended");
        _;
    }

    /** User function */
    function bet(uint256 number) external payable notEnded {
        require(players.length <= 100, "Lottery: Max number of players reach");
        require(msg.sender != owner(), "Lottery: Owner cannot play");

        IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), price);

        isPlayers[msg.sender] = true;
        betNumber[msg.sender] = number;
        players.push(msg.sender);

        emit Bet(msg.sender, number);
    }

    /** Admin function */
    function adminStop() external notEnded onlyOwner {
        uint256 balance = IERC20(paymentToken).balanceOf(address(this));

        uint256 _winNumber = block.number % 100;
        winNumber = _winNumber;

        uint256 numberOfWinners = 0;
        for (uint256 i = 0; i < players.length; i++) {
            address p = players[i];
            if (betNumber[p] == _winNumber) {
                numberOfWinners++;
            }
        }

        if (numberOfWinners != 0) {
            uint256 tokenPerWinner = IERC20(paymentToken)
                .balanceOf(address(this))
                .mul(90)
                .div(100)
                .div(numberOfWinners);

            for (uint256 i = 0; i < players.length; i++) {
                address p = players[i];
                if (betNumber[p] == _winNumber) {
                    IERC20(paymentToken).transfer(p, tokenPerWinner);
                }
            }
        }

        uint256 remainToken = IERC20(paymentToken).balanceOf(address(this));
        IERC20(paymentToken).transfer(owner(), remainToken);

        ended = true;
        emit LotteryEnd(block.number);
    }

    /** Getter function */
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getBalance() external view returns (uint256) {
        return IERC20(paymentToken).balanceOf(address(this));
    }
}
