// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface ILottery {
    /** User function */
    function bet(uint256) external payable;

    /** Admin function */
    function adminStop() external;

    /** Getter function */
    function getPlayers() external view returns (address[] memory);

    function getBalance() external view returns (uint256);
}
