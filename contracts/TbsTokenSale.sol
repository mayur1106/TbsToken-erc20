// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./TbsToken.sol";
contract TbsTokenSale {
    address admin;
    TbsToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

     constructor(TbsToken _tokenContract,uint256 _price) {
        admin = msg.sender; 
        tokenContract = _tokenContract;
        tokenPrice = _price;
    }

    event Sell(
        address buyer,
        uint256 amount
    );

    // multiply function
    function multiply(uint x,uint y) internal pure returns(uint z){
        require(y == 0|| (z=x*y)/y==x);
    }

    // Buy Token 
    function buyTokens(uint256 _numberOfTokens) public payable {

        // Require that value is equal to tokens 
        require( msg.value == multiply(_numberOfTokens,tokenPrice));
        // Require that contract has enough tokens 
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // require that transfer successfull

        // Keep the track of number of token sold 
        tokenSold += _numberOfTokens;
        // Trigger sell event 
        emit Sell(msg.sender,_numberOfTokens);
    }
}