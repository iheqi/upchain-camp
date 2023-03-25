const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require('hardhat');
const { assert } = require("chai");

describe("Test contract", function () {

  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const ERC20V1 = await ethers.getContractFactory("ERC20V1");
    const ERC20V2 = await ethers.getContractFactory("ERC20V2");

    const erc20V1Proxy = await upgrades.deployProxy(ERC20V1); // 第一次部署时，会调用 initialize
    const erc20V2Proxy = await upgrades.upgradeProxy(erc20V1Proxy.address, ERC20V2); // 升级时不会再调用 initialize 了（调用的话也会报错）
    // console.log(await erc20V2Proxy.initialize()); // error: Initializable: contract is already initialized

    // TransparentUpgradeableProxy 合约的 admin 是 ProxyAdmin，而 owner 是 ProxyAdmin 的 owner。
    // 用 owner 直接去调 TransparentUpgradeableProxy 是会走到逻辑合约（噢，这样设计更可以避免 owner 修改到代理合约）
    // console.log(await erc20V2Proxy.admin()); // TypeError: erc20V2Proxy.admin is not a function

    // console.log("name", await erc20V1Proxy.name()); // erc20V1
    // console.log("name", await erc20V2Proxy.name()); // erc20V1

    return { erc20V1Proxy, erc20V2Proxy, owner, addr1 };
  }


  it("expect proxy's address and name equal", async function () {
    await loadFixture(deployFixture)
    const { erc20V1Proxy, erc20V2Proxy, owner, addr1 } = await loadFixture(deployFixture);

    assert.equal(await erc20V1Proxy.name(), await erc20V2Proxy.name(), "expect name equal 'erc20V1'");
    assert.equal(erc20V1Proxy.address, erc20V2Proxy.address, "expect proxy address equal");
  });

  it("expect mint 200 tokens", async function () {
    const { erc20V1Proxy, erc20V2Proxy, owner, addr1 } = await loadFixture(deployFixture);

    await erc20V1Proxy.mint(100);
    await erc20V2Proxy.mint(100);

    assert.equal(await erc20V1Proxy.balanceOf(owner.address), 200, "expect mint equal");
    assert.equal(await erc20V2Proxy.balanceOf(owner.address), 200, "expect mint equal");
  })

  it("expect new logic contract has 'transferWithCallback' function", async function () {
    const { erc20V1Proxy, erc20V2Proxy, owner, addr1 } = await loadFixture(deployFixture);

    await erc20V2Proxy.mint(100);
    await erc20V2Proxy.mint(100);
    await erc20V2Proxy.transferWithCallback(addr1.address, 100);

    assert.equal(await erc20V2Proxy.balanceOf(owner.address), 100, "expect mint equal");
    assert.equal(await erc20V2Proxy.connect(addr1).balanceOf(owner.address), 100, "expect mint equal");
  })

});