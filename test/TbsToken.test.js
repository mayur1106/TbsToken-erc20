var TbsToken = artifacts.require("./TbsToken.sol")

contract("TbsToken",function(accounts){
    it("Initializes the contract with the correct parameter",()=>{
        return TbsToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.name();
        }).then((name)=>{
            assert.equal(name,"Tbs Token");
            return tokenInstance.symbol()
        }).then((symbol)=>{
            assert.equal(symbol,"TBS");
            return tokenInstance.standard()
        }).then(standard=>{
            assert.equal(standard,'TBS Token v1.0')
        })
    })
    it("sets the total supply upon the deployment",()=>{
        return TbsToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply)=>{
            assert.equal(totalSupply.toNumber(),2000000);
            return tokenInstance.balanceOf(accounts[0])
        }).then((adminBalance)=>{
            assert.equal(adminBalance.toNumber(),2000000);
        })
    });

    it("transfers the token ownership",function(){
        return TbsToken.deployed().then(instance=>{
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],999999999999)
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'error message must contain revert');
            return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]})
        }).then((reciept)=>{
            assert.equal(reciept.logs.length,1)
            assert.equal(reciept.logs[0].event,'Transfer')
            assert.equal(reciept.logs[0].args._from,accounts[0])
            assert.equal(reciept.logs[0].args._to,accounts[1])
            assert.equal(reciept.logs[0].args._value,250000)
            return tokenInstance.balanceOf(accounts[1])
        }).then((balance)=>{
            assert.equal(balance.toNumber(),250000)
            return tokenInstance.balanceOf(accounts[0])
        }).then(balance=>{
            assert.equal(balance.toNumber(),1750000)
        })
    })

    it("It approves token for delegated transfer",()=>{
            return TbsToken.deployed().then((instance)=>{
                tokenInstance = instance;
                return tokenInstance.approve.call(accounts[1],100)
            }).then((success)=>{
                assert.equal(success,true)
                return tokenInstance.approve(accounts[1],100,{from:accounts[0]})
            }).then((reciept)=>{
                assert.equal(reciept.logs.length,1)
                assert.equal(reciept.logs[0].event,'Approval')
                assert.equal(reciept.logs[0].args._owner,accounts[0])
                assert.equal(reciept.logs[0].args._spender,accounts[1])
                assert.equal(reciept.logs[0].args._value,100)
                return tokenInstance.allowance(accounts[0],accounts[1]);
            }).then((allowance)=>{
                assert.equal(allowance.toNumber(),100);
            })
    })
    it("handles delegated token transfer",()=>{
        return TbsToken.deployed().then((instance)=>{
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            // Transfer some tokens to fromaccount
            return tokenInstance.transfer(fromAccount,100,{from:accounts[0]})
        }).then((reciept)=>{
            // Approve spendingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount,10,{from:fromAccount})
        }).then((reciept)=>{
            return tokenInstance.transferFrom(fromAccount,toAccount,999,{from:spendingAccount});
        }).then(assert.fail).catch((error)=>{
            assert(error.message.indexOf('revert') >= 0,"cant tansfer")
            return tokenInstance.transferFrom(fromAccount,toAccount,20,{from:spendingAccount})
        }).then(assert.fail).catch((error)=>{
            assert(error.message.indexOf('revert') >= 0,error)
            return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from:spendingAccount})
        }).then((success)=>{
            assert.equal(success,true)
            return tokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount})
        }).then((reciept)=>{
            assert.equal(reciept.logs.length,1)
            assert.equal(reciept.logs[0].event,'Transfer')
            assert.equal(reciept.logs[0].args._from,fromAccount)
            assert.equal(reciept.logs[0].args._to,toAccount)
            assert.equal(reciept.logs[0].args._value,10)
            return  tokenInstance.balanceOf(fromAccount)
        }).then((balance)=>{
            assert.equal(balance.toNumber(),90)
            return tokenInstance.balanceOf(toAccount)
        }).then((balance)=>{
            assert.equal(balance.toNumber(),10)
            return tokenInstance.allowance(fromAccount,spendingAccount)
        }).then((allowance)=>{
            assert.equal(allowance.toNumber(),0)
        })
    })














})