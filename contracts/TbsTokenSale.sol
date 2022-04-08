// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./TbsToken.sol";
contract TbsTokenSale {
    address public admin;
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
        require(y == 0|| (z=x*y)/y==x,"Safe Math ! Values can not be multiplied");
    }

    // Buy Token 
    function buyTokens(uint256 _numberOfTokens) external payable {

        // Require that value is equal to tokens 
        require( msg.value == multiply(_numberOfTokens,tokenPrice),"Amount is not enough to buy the tokens");
        // Require that contract has enough tokens 
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens,"Smart contract having less tokens than to transfer");
        tokenSold += _numberOfTokens;
        emit Sell(msg.sender,_numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens),"Transfer is not successful");
        // require that transfer successfull

        // Keep the track of number of token sold 
        // Trigger sell event 
    }
    // end sale 
    function endSale() external  {
        // Only admin can do this 
        require(msg.sender == admin,"Account is not admin");
        // Transfer amount of token in sale back to the admin 
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),"Failed to transfer remaining tokens to the admin");
        // Destroy Contract 
        selfdestruct(payable(address(this)));
    }
}