const ParityWallet = artifacts.require("./LastWillParityWallet.sol");

module.exports = function (deployer, _, accounts) {
    const TARGET = accounts[1];
    deployer.deploy(ParityWallet, TARGET, [TARGET], [100], 120);
};
