// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Bank {
  bool reEntryFlag = false; 

  address public owner = msg.sender;
  mapping(address => uint) public balances;
  
  receive() external payable {
    balances[msg.sender] += msg.value;
  }


  function withdraw(uint amount) external {
    require(!reEntryFlag, "ReentrancyGuard: reentrant call");
    require(balances[msg.sender] >= amount, "not enough balance");

    reEntryFlag = true;
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
    reEntryFlag = false;
  }

  function withdrawAll() external {
    require(msg.sender == owner, "not owner");
    selfdestruct(payable(msg.sender)); // 像小猪存钱罐一样打碎然后取出钱
  }
}
