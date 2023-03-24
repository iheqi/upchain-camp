const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require('hardhat');
const { assert } = require("chai");

describe("Test contract", function () {

  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const ERC20V1 = await ethers.getContractFactory("ERC20V1");
    const erc20V1 = await upgrades.deployProxy(ERC20V1);
    console.log("erc20V1 token address:", erc20V1.address);


    return { erc20V1, owner, addr1 };
  }

  it("test mint gaga token", async function () {
    const { erc20V1, owner, addr1 } = await loadFixture(deployFixture);
    console.log(await erc20V1.name());
    console.log(await erc20V1.getProxyAdmin());


    // await gaga.mint(10000);
    // expect(await gaga.balanceOf(owner.address)).to.equal(10000);

    // await expect(gaga.mint(90001)).to.be.revertedWith('Max totalSupply is 100000');
  });


});