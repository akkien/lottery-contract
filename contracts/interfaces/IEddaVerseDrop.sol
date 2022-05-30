// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

interface IEddaVerseDrop {
    /** User function */
    function operatorMint(address, uint256) external;

    function buy(uint256, address) external payable;

    /** Admin function */
    function adminPause() external;

    function adminUnPause() external;

    function addOperator(address) external;

    function removeOperator(address) external;

    function setTimeWindow(uint256, uint256) external;

    /** Getter function */
    function collection() external view returns (address);

    function price() external view returns (uint256);

    function timeWindow() external view returns (uint256, uint256);

    function payment() external view returns (address);
}
