var TbsToken = artifacts.require("./TbsToken.sol")

contract("TbsToken",function(accounts){
    it("sets the total supply upon the deployment",()=>{
        return TbsToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply)=>{
            assert.equal(totalSupply.toNumber(),1000000);
        })
    })
})