var BiteChain = artifacts.require("./BiteChain.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, BiteChain);
  deployer.deploy(BiteChain);
};
