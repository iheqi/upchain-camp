// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract Vault is ERC20, ERC4626 {
  constructor(IERC20 asset) ERC20("LP", "LP") ERC4626(asset) {

  }
  // Derived contract must override function "decimals". Two or more base classes define function with same name and parameter types。
  // 简单来说，这个错误提示通常是由于你的合约继承了多个父合约，并且这些父合约中都定义了一个名为“decimals”的函数，因此你需要在你的合约中覆盖这个函数，来消除这个错误提示。
  function decimals() public view virtual override(ERC20, ERC4626) returns (uint8) {
    return ERC20.decimals();
  }

}