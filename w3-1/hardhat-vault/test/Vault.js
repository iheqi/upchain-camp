const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

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
    console.log('domainSeparator', domainSeparator);
    
    const message = ethers.utils.solidityKeccak256(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        domainSeparator,
        ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [ 
              // ethers.utils.id('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'), // 一开始用 keccak256 一直报错。
              domainSeparator,
              owner.address, vault.address, value, nonce, deadline
            ]
          )
        ),
        ethers.utils.keccak256(await gaga.PERMIT_TYPEHASH())
      ]
    );

    // const message = {
    //   owner: owner.address,
    //   spender,
    //   value,
    //   deadline,
    //   nonce,
    //   chainId: 1337, // hardhat node 默认 chainId。如果是在其他链上操作，chainId需要相应修改
    //   verifyingContract: gaga.address
    // };
    // const signature = await ethers.utils.signTypedMessage(
    //   privateKey, {data: message}
    // );

    // 搞不定，验签不过
    const signature = await owner.signMessage(ethers.utils.arrayify(message));
    const { v, r, s } = ethers.utils.splitSignature(signature);



    // await vault.depositWithPermit(
    //   value, 
    //   deadline,
    //   v, 
    //   r, 
    //   s
    // );
    // expect(await gaga.balanceOf(owner.address)).to.equal(0);
    // expect(await vault.totalAssets()).to.equal(10000);
  });

});