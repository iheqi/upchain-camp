// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Vault is ERC20, ERC4626 {
  ERC20Permit immutable erc20Asset;

  constructor(ERC20Permit _asset) ERC20("LP", "LP") ERC4626(_asset) {
    erc20Asset = _asset;
  }
  // Derived contract must override function "decimals". Two or more base classes define function with same name and parameter types。
  // 简单来说，这个错误提示通常是由于你的合约继承了多个父合约，并且这些父合约中都定义了一个名为“decimals”的函数，因此你需要在你的合约中覆盖这个函数，来消除这个错误提示。
  function decimals() public view virtual override(ERC20, ERC4626) returns (uint8) {
    return ERC20.decimals();
  }

  function depositWithPermit(
    uint256 amount, 
    uint deadline,
    uint8 v, 
    bytes32 r, 
    bytes32 s
  ) public returns (uint256) {
    
    erc20Asset.permit(msg.sender, address(this), amount, deadline, v, r, s);
    uint256 shares = deposit(amount, msg.sender);
    return shares;
  }

}