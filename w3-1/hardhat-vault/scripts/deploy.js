// const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
// const ERC4626 = require("@openzeppelin/contracts/build/contracts/ERC4626.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 抽象合约不能被实例化，还是写一下继承吧
  // const ERC20Contract = await ethers.getContractFactory(ERC20.abi, ERC20.bytecode, deployer);
  // const erc20 = await ERC20Contract.deploy("GAGA", "GAGA");
  // console.log("erc20 address:", erc20.address);

  // const ERC4626Contract = await ethers.getContractFactory(ERC4626.abi, ERC4626.bytecode, deployer);
  // const erc4626 = await ERC4626Contract.deploy();
  // console.log("erc4626 address:", erc4626.address);

  const GaGa = await ethers.getContractFactory("GaGa");
  const gaga = await GaGa.deploy("GAGA", "GAGA");
  console.log("gaga token address:", gaga.address);

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(gaga.address);
  console.log("vault address:", vault.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });