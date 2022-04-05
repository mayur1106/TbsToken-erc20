const TbsToken = artifacts.require("TbsToken");

module.exports = function (deployer) {
  deployer.deploy(TbsToken);
};
