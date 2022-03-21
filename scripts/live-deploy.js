// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, run } = require("hardhat");
require('dotenv').config({path:__dirname+'../.env'});

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  
  //const url = process.env.POLYGON_API + process.env.POLYGON_KEY;
  //const provider = new ethers.providers.StaticJsonRpcProvider(url);
  //const OwnerAccount = await provider.getSigner(0);
  
  const [ deployer ] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Deploying contracts with the account:", deployer.privateKey);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Tigersword = await hre.ethers.getContractFactory("Tigersword");
  const tigersword = await Tigersword.deploy();

  await tigersword.deployed();

  console.log("Tigersword.sol deployed to:", tigersword.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
