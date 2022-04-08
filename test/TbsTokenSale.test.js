var TbsTokenSale = artifacts.require("./TbsTokenSale.sol")
var TbsToken = artifacts.require("./TbsToken.sol")
contract("TbsTokenSale",function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000;
    var tokenAvailable = 750000;
    var numberOfTokens;

    it("initializes the contract with correct values",()=>{
        return TbsTokenSale.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.address
        }).then((address)=>{
            assert.notEqual(address,0x0);
            return tokenInstance.tokenContract()
        }).then((address)=>{
            assert.notEqual(address,0x0);
            return tokenInstance.tokenPrice();
        }).then((price)=>{
            assert.equal(tokenPrice,price.toNumber())
        });
    });

    it("faciliates token buying",()=>{
        return TbsToken.deployed().then((instance)=>{
        tokenInstance = instance
        return TbsTokenSale.deployed();
    }).then((instance)=>{
            tokenSaleInstance = instance;
            // provision 75% of available tokens to token Sale Contract
            return tokenInstance.transfer(tokenSaleInstance.address,tokenAvailable,{from:admin});
    }).then((reciept)=>{
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:numberOfTokens * tokenPrice})
        }).then((reciept)=>{
            assert.equal(reciept.logs.length,1)
            assert.equal(reciept.logs[0].event,'Sell')
            assert.equal(reciept.logs[0].args.buyer,buyer)
            assert.equal(reciept.logs[0].args.amount,numberOfTokens)
            return tokenSaleInstance.tokenSold()
        }).then((amount)=>{
            assert.equal(amount.toNumber(),numberOfTokens)
            return tokenInstance.balanceOf(buyer);
        }).then((balance)=>{
            assert.equal(balance.toNumber(),numberOfTokens)
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then((balance)=>{
            assert.equal(balance.toNumber(),tokenAvailable-numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:1})
        }).then(assert.fail).catch(err=>{
            assert(err.message.indexOf('revert') >=0 ,'msg.value must be equal to number of tokens in wei')
            return tokenSaleInstance.buyTokens(800000,{from:buyer,value:numberOfTokens})
        }).then(assert.fail).catch(error=>{
            assert(error.message.indexOf('revert')>=0,'Not available')
        })
    });
    it("ends the sale ",()=>{
        return TbsToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return TbsTokenSale.deployed()
        }).then((instance)=>{
            tokenSaleInstance = instance;
            return tokenSaleInstance.endSale({from:buyer});
        }).then(assert.fail).catch((err)=>{
            assert(err.message.indexOf("revert") >= 0 ,'Must be admin to end the sale')
            return tokenSaleInstance.endSale({from:admin});
        }).then(reciept=>{
            return tokenInstance.balanceOf(admin)
        }).then(balance=>{
            assert.equal(balance.toNumber(),1999990,'returns all tokens to admin')
            return web3.eth.getCode(tokenSaleInstance.address);
        }).then((price)=>{
            assert.equal(price,'0x','token price reset');
        })
    });
});