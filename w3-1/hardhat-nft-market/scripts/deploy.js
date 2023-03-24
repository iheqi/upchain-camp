// const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
// const ERC4626 = require("@openzeppelin/contracts/build/contracts/ERC4626.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);


  const NftMarket = await ethers.getContractFactory("NftMarket");
  const nftMarket = await NftMarket.deploy();
  console.log("nftMarket address:", nftMarket.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });