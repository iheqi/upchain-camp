async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Teacher = await ethers.getContractFactory("Teacher");
  const teacher = await Teacher.deploy();
  console.log("Teacher address:", teacher.address);

  // const Score = await ethers.getContractFactory("Score");
  // const score = await Score.deploy();
  // console.log("Score address:", score.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });