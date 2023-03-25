const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require('hardhat');
const { assert } = require("chai");

describe("Test contract", function () {

  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const ERC20V1 = await ethers.getContractFactory("ERC20V1");
    const ERC20V2 = await ethers.getContractFactory("ERC20V2");

    const erc20V1Proxy = await upgrades.deployProxy(ERC20V1);
    const erc20V2Proxy = await upgrades.upgradeProxy(erc20V1Proxy.address, ERC20V2);

    console.log(await erc20V1Proxy.name()); // erc20V1

    // console.log(await erc20V2Proxy.initialize()); // error: Initializable: contract is already initialized
    console.log(); // erc20V1

    assert.equal(await erc20V2Proxy.name(), erc20V2Proxy.address, "expect name changed");
    return { erc20V1Proxy, erc20V2Proxy, owner, addr1 };
  }

  it("expect proxy address equal", async function () {

    const { erc20V1Proxy, erc20V2Proxy, owner, addr1 } = await loadFixture(deployFixture);
    assert.equal(erc20V1Proxy.address, erc20V2Proxy.address, "expect proxy address equal");
  });

  it("expect mint 200 tokens", async function () {
    const { erc20V1Proxy, erc20V2Proxy, owner, addr1 } = await loadFixture(deployFixture);

    await erc20V1Proxy.mint(100);
    await erc20V2Proxy.mint(100);

    assert.equal(await erc20V1Proxy.balanceOf(owner.address), 200, "expect mint equal");
    assert.equal(await erc20V2Proxy.balanceOf(owner.address), 200, "expect mint equal");
  })

});