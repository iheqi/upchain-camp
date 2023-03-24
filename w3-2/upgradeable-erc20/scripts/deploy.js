const { ethers, upgrades } = require("hardhat");

// https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);


  const ERC20V1 = await ethers.getContractFactory("ERC20V1");
  const [account1] = await ethers.getSigners();

  // const erc20V1 = await ERC20V1.deploy(); // 常规部署
  const erc20V1 = await upgrades.deployProxy( // 这里得到的，是代理合约。默认是透明代理部署
    ERC20V1,

    //Since the logic contract has an initialize() function
    // we need to pass in the arguments to the initialize()
    // function here.
    // [42], // initialize 函数的参数 

    // We don't need to expressly specify this
    // as the Hardhat runtime will default to the name 'initialize'
    // { initializer: "initialize" } // 指定 initialize 函数
  );
  await erc20V1.deployed();

  console.log("erc20V1 deployed to:", erc20V1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });