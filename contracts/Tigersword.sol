// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

import"./StakingHelper.sol";

contract Tigersword is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable {
    
    //section of my code I am too noob to better style:
    address payable sushiRouterAddress = payable(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);
    address wMaticAddress =0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address USDCAddress = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address KlimaAddress = 0x4e78011Ce80ee02d2c3e649Fb657E45898257815;
    address staking = 0x25d28a24Ceb6F81015bB0b2007D795ACAc411b4d;
    address stakehelper = 0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227;

    //adapted from Net2Dev contract to save braintime:
    string public baseURI = "https://gateway.pinata.cloud/ipfs/QmWok8gdKaU8uYCS6vtB8kRJ7rKoZLDNNhh6KW1bT9HDoZ/";
    string public baseExtension = ".json";
    uint256 public cost = 1 ether; //1 MATIC cost to mint
    uint256 public maxSupply = 1000;
    uint256 public maxMintAmount = 5;
    //bool public paused = false;
    //We still have to adapt the contract logic to assign metadata etc.


    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Tigersword", "TSWORD") 
    {
        
    }

    function pause() public onlyOwner 
    {
        _pause();
    }

    function unpause() public onlyOwner 
    {
        _unpause();
    }

    function safeMint(address to) public onlyOwner 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        string memory uri = string(abi.encodePacked( baseURI, 
                            Strings.toString(tokenId),
                                ".json"));
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, 
                                    address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) 
                internal 
                override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }



     function stake( uint _amount ) internal whenNotPaused {
        IERC20( KlimaAddress ).approve( staking, _amount );
        IStaking( staking ).stake( _amount, address(this) );
        IStaking( staking ).claim( address(this) );
    }

    function mintToken(address to, uint minKlima) 
        public 
        whenNotPaused
        payable
    {
        require(msg.value >= cost, "Minimum of 1 Matic payment needed");
    
        UniswapV2Router02 sushiRouter = UniswapV2Router02(sushiRouterAddress);    
        
        address [] memory path = new address[](3);
        path[0] = wMaticAddress;
        path[1] = USDCAddress;
        path[2] = KlimaAddress;

        IERC20(wMaticAddress).approve(msg.sender,msg.value/2);
        uint [] memory amounts = sushiRouter.swapExactETHForTokens{value: msg.value/2}(
                            minKlima,
                            path,
                            address(this),
                            block.timestamp + 10*5
                            );
        stake(amounts[amounts.length-1]);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender,tokenId);
        string memory uri = string(abi.encodePacked( baseURI, 
                            Strings.toString(tokenId),
                                ".json"));
        _setTokenURI(tokenId, uri);

    }
}
