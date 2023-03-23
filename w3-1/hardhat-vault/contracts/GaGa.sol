// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol"; // 妈的。v4.8.3 删除了 ERC20Permit.sol

contract GaGa is ERC20, ERC20Permit {
  bytes32 public constant PERMIT_TYPEHASH =
    keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

  constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name) {

  }

  function mint(uint256 amount) public {
    require(totalSupply() + amount <= 100000, "Max totalSupply is 100000");
    _mint(msg.sender, amount);
  }
}