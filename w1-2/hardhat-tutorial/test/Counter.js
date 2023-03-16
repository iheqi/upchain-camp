const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Counter contract", function () {
  // 您可以通过使用固定装置来避免代码重复并提高测试套件的性能。 
  // fixture 是一个设置函数，仅在第一次调用时运行。
  async function deployCounterFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const Counter = await ethers.getContractFactory("Counter");

    const hardhatCounter = await Counter.deploy();

    return { Counter, hardhatCounter, owner, addr1 };
  }

  it("Only owner can call add() function", async function () {
    const { hardhatCounter, addr1 } = await loadFixture(deployCounterFixture);
    await hardhatCounter.add(1);
    expect(await hardhatCounter.counter()).to.equal(1);

    // https://hardhat.org/hardhat-chai-matchers/docs/overview
    await expect(hardhatCounter.connect(addr1).add(1)).to.be.revertedWith('Only owner.');
    expect(await hardhatCounter.counter()).to.equal(1);

    // try {
    //   await hardhatCounter.connect(addr1).add(1);
    // } catch (error) { }
    // expect(await hardhatCounter.counter()).to.equal(1);
  });
});