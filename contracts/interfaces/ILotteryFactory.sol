// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface ILotteryFactory {
    /** User function */
    function createLottery(address, uint256) external;

    /** Getter function */
    function getMyLotteries(address) external view returns (address[] memory);
}
