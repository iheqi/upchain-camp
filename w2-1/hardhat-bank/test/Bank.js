const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Bank contract", function () {
  // 虽然每个测试用例使用的都是同一个合约实例，但是每个测试用例执行完成后，都会有一个回滚操作，
  // 将测试用例中的所有状态更改都清除。这种机制确保了每个测试用例的独立性，避免了测试用例之间的相互干扰。
  // 所以每个 it 函数不会相互影响

  async function deployBankFixture() {
    const [owner, addr1] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    return { Bank, bank, owner, addr1 };
  }

  it("test deposit", async function () {
    const { bank, owner, addr1 } = await loadFixture(deployBankFixture);
    const amount = ethers.utils.parseEther('1');

    await owner.sendTransaction({
      to: bank.address,
      value: amount,
    });

    expect(await bank.balances(owner.address)).to.equal(amount);
    expect(await bank.balances(addr1.address)).to.equal(0);
  });

  it("test withdraw", async function () {
    const { bank, owner, addr1 } = await loadFixture(deployBankFixture);
    const amount = ethers.utils.parseEther('1');

    await owner.sendTransaction({
      to: bank.address,
      value: amount,
    });

    expect(await bank.balances(owner.address)).to.equal(amount);
    await bank.withdraw(amount);
    expect(await bank.balances(owner.address)).to.equal(0);

  });

  it("test withdrawAll", async function () {
    const { bank, owner, addr1 } = await loadFixture(deployBankFixture);
    const amount = ethers.utils.parseEther('1');

    await owner.sendTransaction({
      to: bank.address,
      value: amount,
    });

    await addr1.sendTransaction({
      to: bank.address,
      value: amount,
    });

    await expect(bank.connect(addr1).withdrawAll()).to.be.revertedWith('not owner');
    await bank.connect(owner).withdrawAll();
  });

});