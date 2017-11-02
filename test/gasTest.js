const chai = require("chai");
const utils = require("./utils.js");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

const DelayedPayment = artifacts.require("./DelayedPayment.sol");
const ParityWallet = artifacts.require("./LastWillParityWallet.sol");

const estimateConstructGas = (target, ...args) => {
    return new Promise((resolve, reject) => {
        const web3contract = target.web3.eth.contract(target.abi);
        args.push({
            data: target.unlinked_binary
        });
        const constructData = web3contract.new.getData.apply(web3contract.new, args);
        web3.eth.estimateGas({data: constructData}, function (err, gas) {
            if (err) {
                reject(err);
            }
            else {
                resolve(gas);
            }
        });
    });
};

contract('Gas Calculating', function(accounts) {

    const TARGET = accounts[1];

    it('#0 DelayedPayment', async() => {
        let gas = await estimateConstructGas(DelayedPayment, TARGET, TARGET, -1, 120);
        console.info("Construct:", gas);

        const delayedPayment = await DelayedPayment.new(TARGET, TARGET, -1, 120);
        gas = await delayedPayment.check.estimateGas();
        console.info("Check:", gas);

        await delayedPayment.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});

        await utils.increaseTime(web3, 200);

        gas = await delayedPayment.check.estimateGas();
        console.info("Check and send:", gas);
    });

    it('#1 ParityWallet', async() => {
        let gas = await estimateConstructGas(ParityWallet, TARGET, [TARGET], [100], 120);
        console.info("Construct 1:", gas);
        let gas2 = await estimateConstructGas(ParityWallet, TARGET, [TARGET, TARGET], [50, 50], 120);
        let delta = gas2 - gas;
        let baseGas = gas - delta;
        console.info("Construct 2:", gas2, delta);
        let gas3 = await estimateConstructGas(ParityWallet, TARGET, [TARGET, TARGET, TARGET], [30, 30, 40], 120);
        console.info("Construct 3:", gas3, (gas3 - baseGas) / 3);
        let gas4 = await estimateConstructGas(ParityWallet, TARGET, [TARGET, TARGET, TARGET, TARGET], [25, 25, 25, 25], 120);
        console.info("Construct 4:", gas4, (gas4 - baseGas) / 4);
        let gas5 = await estimateConstructGas(ParityWallet, TARGET, [TARGET, TARGET, TARGET, TARGET, TARGET], [20, 20, 20,20,20], 120);
        console.info("Construct 5:", gas5, (gas5 - baseGas) / 5);

        console.info("Construct base: ", baseGas,", constructor per user:", delta);

        const parityWallet = await ParityWallet.new(TARGET, [TARGET], [100], 120);
        await parityWallet.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
        let checkGas = await parityWallet.check.estimateGas();
        console.info("Check:", checkGas);

        const parityWallet2 = await ParityWallet.new(TARGET, [TARGET, TARGET], [50, 50], 120);
        await parityWallet2.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
        gas = await parityWallet2.check.estimateGas();
        console.info("Check2:", gas);

        const parityWallet3 = await ParityWallet.new(TARGET, [TARGET, TARGET, TARGET], [30, 30, 40], 120);
        await parityWallet3.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
        gas = await parityWallet3.check.estimateGas();
        console.info("Check3:", gas);
        await utils.increaseTime(ParityWallet.web3, 600);

        // do it twice, because after time shift it somehow brakes
        await parityWallet.check.estimateGas();
        let checkAndSendGas = await parityWallet.check.estimateGas();
        console.info("Check and send:", checkAndSendGas);
        let checkAndSendGas2 = await parityWallet2.check.estimateGas();
        let deltaCheck = checkAndSendGas2 - checkAndSendGas;
        let baseCheckAndSend = checkAndSendGas - deltaCheck;
        let delta2 = checkAndSendGas2 - baseCheckAndSend;
        console.info("Check and send2:", checkAndSendGas2, 'Base:', baseCheckAndSend, 'delta:', deltaCheck, 'delta calc:', delta2 / 2);
        gas = await parityWallet3.check.estimateGas();
        let delta3 = gas - baseCheckAndSend;
        console.info("Check and send3:", gas, 'delta:', delta3, 'delta calc:', delta3 / 3);
        // const delayedPayment = await DelayedPayment.new(TARGET, TARGET, -1, 120);
        // gas = await delayedPayment.check.estimateGas();
        // console.info("Check:", gas);
        //
        // await delayedPayment.sendTransaction({value: web3.toWei(1, 'ether'), from: accounts[2]});
        //
        //
        // gas = await delayedPayment.check.estimateGas();
        // console.info("Check and send:", gas);
    });
});