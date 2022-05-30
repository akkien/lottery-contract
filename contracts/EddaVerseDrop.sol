// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IEddaVerseDrop.sol";
import "hardhat/console.sol";

contract EddaVerseDrop is
    OwnableUpgradeable,
    PausableUpgradeable,
    IEddaVerseDrop
{
    using Address for address payable;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 private _startTime;

    address public collection;

    mapping(address => bool) public operators;

    address public swapRouter;

    uint256 public constant MAX_INT = 2**256 - 1;

    event Sold(address indexed buyer, uint256 indexed balance);

    function initialize(
        address _collection,
        uint256 _totalSupply,
        uint256 start,
        uint56 end,
        uint256 _price,
        address stableCoin,
        address _whitelist,
        address treasury
    ) public virtual initializer {
        __Ownable_init();
        __Pausable_init();
        collection = _collection;
        totalSupply = _totalSupply;
        _startTime = start;
        _endTime = end;
        price = _price;
        _stable = stableCoin;
        paymentWhitelist = _whitelist;
        _treasury = treasury;

        limitBuy = 1000;
        operators[_msgSender()] = true;
        swapRouter = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff; //polygon quickswap
        freeOneNFTEach = 3;
    }

    /** Modifier */
    modifier onlyOperator() {
        require(operators[_msgSender()] == true, "EddaVerseDrop: Unauthorized");
        _;
    }

    modifier withinTimeWindow() {
        require(
            block.timestamp >= _startTime,
            "EddaVerseDrop: Drop campaign does not start yet"
        );
        require(
            block.timestamp <= _endTime,
            "EddaVerseDrop: Drop campaign ended"
        );
        _;
    }

    /** Operator function */
    function operatorMint(address buyer, uint256 amount)
        external
        onlyOperator
        withinTimeWindow
    {
        require(
            amount > 0 && amount + purchasedNFTs[buyer] <= limitBuy,
            "EddaVerseDrop: Invalid amount of NFT"
        );
        require(
            amount + totalSold <= totalSupply,
            "EddaVerseDrop: Over total supply of NFT"
        );

        uint256 freeNFTs = _calculateFreeNFTs(buyer, amount);

        _mintMultiple(buyer, amount + freeNFTs);
        totalSold += amount + freeNFTs;
        purchasedNFTs[buyer] += amount;
        emit Sold(buyer, purchasedNFTs[buyer]);
    }

    function _swapTokenForETH(address _tokenIn, uint256 amount)
        private
        returns (uint256)
    {
        address[] memory path = getPathFromTokenToToken(_tokenIn, WETH);
        uint256[] memory amounts = IUniswapRouter(swapRouter)
            .swapExactTokensForETH(amount, 0, path, address(this), deadline);
        return amounts[path.length - 1];
    }

    receive() external payable {}
}
