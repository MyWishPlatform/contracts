const OraclizeProxy = artifacts.require("./LastWillOraclizeProxy.sol");
const Oraclize = artifacts.require("./LastWillOraclize.sol");

module.exports = function (deployer, _, addresses) {
    const TARGET = addresses[1];
    deployer
        .deploy(OraclizeProxy)
        .then(function () {
            return deployer.deploy(Oraclize, TARGET, [TARGET], [100], 120, OraclizeProxy.address);
        });
};
