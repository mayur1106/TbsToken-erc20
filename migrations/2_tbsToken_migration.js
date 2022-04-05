const TbsToken = artifacts.require("TbsToken");

module.exports = function (deployer) {
  deployer.deploy(TbsToken,2000000);
};
