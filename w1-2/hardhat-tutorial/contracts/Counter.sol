// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Counter {
  uint public counter;
  address owner;

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call add() function");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function add(uint x)  public onlyOwner {
    counter = counter + x;

    // https://hardhat.org/tutorial/debugging-with-hardhat-network#solidity-console-log
    console.log("Log from Counter.sol:", counter);
  } 
}
