// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

import"./StakingHelper.sol";
/*
interface IUniswap {
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function WETH() external pure returns (address);
}*/

contract TestSwap {

    //section of my code I am too noob to better style:
    address payable sushiRouterAddress = payable(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);
    address wMaticAddress =0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address USDCAddress = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address KlimaAddress = 0x4e78011Ce80ee02d2c3e649Fb657E45898257815;
    address staking = 0x25d28a24Ceb6F81015bB0b2007D795ACAc411b4d;
    address stakehelper = 0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227;


    constructor() public {
    }


    function testSwapExactETHForTokens() 
            external payable returns (uint amount) {
        require(msg.value == 1 ether, "Msg.value too low!");
        IUniswapV2Router02 sushiswap 
            = IUniswapV2Router02(sushiRouterAddress);
        address[] memory path = new address[](2);
        path[0] = sushiswap.WETH();
        path[1] = USDCAddress;
        uint[] memory amounts = sushiswap
            .swapExactETHForTokens{value:(msg.value/2)}(
            0,
            path,
            msg.sender,
            block.timestamp);
        amount = amounts[amounts.length-1];   
        return amount;
    }
}