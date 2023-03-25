// SPDX-License-Identifier: MIT
// https://docs.openzeppelin.com/contracts/4.x/wizard
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract ERC20V2 is Initializable, ERC20Upgradeable {
    using Address for address;
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("ERC20V2", "ERC20V2");
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function transferWithCallback(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);

        if (recipient.isContract()) {
            bool returnValue = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
            require(returnValue, "Recipient is not token receiver");
        }

        return true;
    }
}