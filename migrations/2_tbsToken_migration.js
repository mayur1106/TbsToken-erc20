var TbsToken = artifacts.require("./TbsToken.sol");
var TbsTokenSale = artifacts.require("./TbsTokenSale.sol");
module.exports = async (deployer) =>{
  let price = 1000000000000000
  await deployer.deploy(TbsToken,2000000);
  return deployer.deploy(TbsTokenSale,TbsToken.address,price);
};
