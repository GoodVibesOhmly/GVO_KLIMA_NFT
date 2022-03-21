const { expect } = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { ethers, run } = require("hardhat");
require('dotenv').config({path:__dirname+'../.env'});
const url = "http://localhost:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
const sKlima = "0xb0C22d8D350C67420f06F48936654f567C73E8C8";
const ERC20ABI = require('./erc20.json');
const SUSHIABI = require('./sushirouter.json');
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  const wMaticAddress ="0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  const USDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const KlimaAddress = "0x4e78011Ce80ee02d2c3e649Fb657E45898257815";
 const SushiAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
  KlimaDecs = 9;
  USDCDecs = 6;
  wMaticDecs = 18;


  //const admin = await provider.getSigner(process.env.Account0);

  // We get the contract to deploy
  /*const TestSwap = await hre.ethers.getContractFactory("TestSwap",
                                      admin);*/
  //const TestSwap = await hre.ethers.getContractFactory("TestSwap");
  //var testSwap = await TestSwap.deploy();

  //await testSwap.deployed();
  //console.log("TestSwap.sol deployed to:", testSwap.address);

  const Address1 = await provider.getSigner(process.env.Account2);
  sushiswap = await ethers.getContractAt(SUSHIABI,
    SushiAddress,
    Address1);
  sushiswap = await sushiswap.connect(Address1);
  sushiWeth = String(await sushiswap.WETH());
  var checkvals = await sushiswap.swapExactETHForTokens(
            0,
            [sushiWeth, KlimaAddress],
            Address1._address,
            Date.now()+300,
            {value:ethers.utils.parseEther("10")}
        );
    console.log("Returned value is: ", JSON.stringify(checkvals[checkvals.length-1]));
 
  tokenContract = await ethers.getContractAt(ERC20ABI,
      KlimaAddress,
      Address1);
var tokenBalance = await tokenContract.balanceOf(Address1._address);
//tokenBalance = tokenBalance *10**(18-USDCDecs);
console.log("Actual token balance is: ", 
              ethers.utils.formatUnits(tokenBalance, KlimaDecs));

const balance = await provider.getBalance(process.env.Account2);
console.log(ethers.utils.formatEther(balance));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
