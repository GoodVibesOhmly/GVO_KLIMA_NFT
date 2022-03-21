const { expect } = require("chai");
const { hexStripZeros } = require("ethers/lib/utils");
const { ethers, run } = require("hardhat");
require('dotenv').config({path:__dirname+'../.env'});
const url = "http://localhost:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
const sKlima = "0xb0C22d8D350C67420f06F48936654f567C73E8C8";
const ERC20ABI = require('./erc20.json');

describe("Tigersword", function () {
  //following syntax from James Bachini 
  //https://www.youtube.com/watch?v=R91Uhw07W3U&t=266s
  let Tigersword;

  beforeEach( async function(){
    const admin = await provider.getSigner(process.env.Account0);
    const contractName = 'Tigersword';
    await run("compile");
    const smartContract = await ethers.getContractFactory(contractName,
                                                  admin);
    Tigersword = await smartContract.deploy();
    await Tigersword.deployed();
    console.log(`${contractName}.sol deployed to: ${Tigersword.address}`);
  });


  it("Should return correct name", async function () {
    expect(await Tigersword.name()).to.equal("Tigersword");
  });

  it("Should return correct symbol", async function () {
    expect(await Tigersword.symbol()).to.equal("TSWORD");
  });

 it("Should show token balance as zero before minting", async function(){
  const admin = await provider.getSigner(process.env.Account0);
  expect(await Tigersword.balanceOf(admin._address)).to.equal(0);
   });

  it("Should mint token", async function(){ 
    const Address1 = await provider.getSigner(process.env.Account1);
    //Address1.address = Address1._address;
    Tigersword = Tigersword.connect(Address1);
    const mintToken = 
      await Tigersword.mintToken(Address1._address, 
                    0,
                    {value:ethers.utils.parseEther("1") 
                    });
  });

    it("Should mint token to buyer", async function(){
    
    const Address1 = await provider.getSigner(process.env.Account1);
    //Address1.address = Address1._address;
    Tigersword = Tigersword.connect(Address1);
    const mintToken = 
      await Tigersword.mintToken(Address1._address, 
                    0,
                    {value:ethers.utils.parseEther("1")});
    //const testString = await Tigersword.balanceOf(Address1._address);
    
    //console.log(testString);
    expect (await Tigersword.balanceOf(Address1._address)).to.above(0);
  });

  it("Should stake klima for buyer", async function(){
    
    const Address1 = await provider.getSigner(process.env.Account3);
    //Address1.address = Address1._address;
    Tigersword = Tigersword.connect(Address1);
    await Tigersword.mintToken(Address1._address, 
                    0,
                    {value:ethers.utils.parseEther("1")});
    
    //Now for sKlima stuff
    sKlimaContract = await ethers.getContractAt(ERC20ABI,
                                                sKlima,
                                                Address1);
    const sKlimaBalance = await sKlimaContract.balanceOf(Address1._address); 
    expect(sKlimaBalance).to.above(0);
    console.log(ethers.utils.formatUnits(sKlimaBalance,9));
  });

});

