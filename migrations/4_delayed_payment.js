const DelayedPayment = artifacts.require("./DelayedPayment.sol");

module.exports = function (deployer, _, accounts) {
    const TARGET = accounts[1];
    deployer.deploy(DelayedPayment, TARGET, [TARGET], [100], 120);
};
