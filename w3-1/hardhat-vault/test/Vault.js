const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Test contract", function () {

  const scoreAbi = [
    // "address immutable public teacher"
    "function teacher() public view returns(address)", // 对于 public 变量，ABI可以这样写
    "function scores(address) public view returns(uint256)", // 对于 public 变量，ABI可以这样写
    // "function getTeacher() public view returns (address)"
    "function setStudentScore(address, uint256) external"
  ]

  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();
    const Teacher = await ethers.getContractFactory("Teacher");
    const teacher = await Teacher.deploy();
    return { Teacher, teacher, owner, addr1 };
  }

  it("test score teacher", async function () {
    const { teacher, owner, addr1 } = await loadFixture(deployFixture);

    const scoreAddress = await teacher.score(); // 虽然合约上变量是实例。这里获取到的是地址
    const score = new ethers.Contract(scoreAddress, scoreAbi, ethers.provider);

    expect(await score.teacher()).to.equal(teacher.address);
  });

  it("test teacher setStudent score ", async function () {
    const { teacher, owner, addr1 } = await loadFixture(deployFixture);

    const scoreAddress = await teacher.score(); // 虽然合约上变量是实例。这里获取到的是地址
    const score = new ethers.Contract(scoreAddress, scoreAbi, ethers.provider);
    expect(await teacher.setStudentScore(owner.address, 100));
    expect(await score.scores(owner.address)).to.be.equal(100);

    await expect(score.connect(addr1).setStudentScore(addr1.address, 100)).to.be.revertedWith('only teacher');
    await expect(teacher.connect(addr1).setStudentScore(addr1.address, 100)).to.be.revertedWith('only teacher');
  });

});