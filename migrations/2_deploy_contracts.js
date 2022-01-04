const GoodsList = artifacts.require("GoodsList");

module.exports = function(deployer) {
  deployer.deploy(GoodsList);
};
