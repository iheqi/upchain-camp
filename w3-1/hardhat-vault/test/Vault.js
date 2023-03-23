const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');


async function getPermitSignature(signer, token, spender, value, deadline) {
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(signer.address),
    token.name(),
    "1",
    signer.getChainId(),
  ])

  return ethers.utils.splitSignature(
    await signer._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: "owner",
            type: "address",
          },
          {
            name: "spender",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
          },
        ],
      },
      {
        owner: signer.address,
        spender,
        value,
        nonce,
        deadline,
      }
    )
  )
}


describe("Test contract", function () {

  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const GaGa = await ethers.getContractFactory("GaGa");
    const gaga = await GaGa.deploy("GAGA", "GAGA");
    console.log("gaga token address:", gaga.address);

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(gaga.address);
    console.log("vault address:", vault.address);

    expect(await vault.asset()).to.be.equal(gaga.address);

    return { gaga, vault, owner, addr1 };
  }

  it("test mint gaga token", async function () {
    const { gaga, owner, addr1 } = await loadFixture(deployFixture);

    await gaga.mint(10000);
    expect(await gaga.balanceOf(owner.address)).to.equal(10000);

    await expect(gaga.mint(90001)).to.be.revertedWith('Max totalSupply is 100000');
  });

  it("test Vault deposit", async function () {
    const { gaga, vault, owner, addr1 } = await loadFixture(deployFixture);
    await gaga.mint(10000);
    await gaga.approve(vault.address, 10000);

    await vault.deposit(10000, owner.address);
    expect(await gaga.balanceOf(owner.address)).to.equal(0);
    expect(await vault.totalAssets()).to.equal(10000);
  });

  it("test Vault deposit with ERC2612 permit", async function () {
    const { gaga, vault, owner, addr1 } = await loadFixture(deployFixture);
    await gaga.mint(10000);
    // await gaga.approve(vault.address, 10000); // 无需用户手动授权


    // 根据 EIP712 规范进行签名
    // const owner = owner.address;           // Owner的钱包地址
    const spender = vault.address;         // Spender的钱包地址
    const value = 10000;                   // 需要授权的代币数量
    const deadline = ((Date.now() / 1000) | 0) + 10; // deadline时间（timestamp）时间戳后10秒
    const nonce = await gaga.nonces(owner.address); // 获取 Erc20Permit 合约上自己的 nonce
    const domainSeparator = await gaga.DOMAIN_SEPARATOR();


    const { v, r, s } = await getPermitSignature(
      owner,
      gaga,
      vault.address,
      value,
      deadline
    )

    await vault.depositWithPermit(
      value,
      deadline,
      v,
      r,
      s
    );
    expect(await gaga.balanceOf(owner.address)).to.equal(0);
    expect(await vault.totalAssets()).to.equal(10000);
  });

});