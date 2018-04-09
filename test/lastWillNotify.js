let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

const LastWillNotify = artifacts.require("./LastWillNotify.sol");
const incTime = seconds => new Promise(next =>
    web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0}, () =>
        web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_mine", id: 0}, next)
    )
);
const getTime = () => new Promise(next => web3.eth.getBlock("latest", (err, block) => next(block.timestamp)));
const getBalance = address => new Promise(next => web3.eth.getBalance(address, (err, balance) => next(balance)));

contract('LastWillNotify', async accounts => {
    const OWNER = accounts[0];
    const TARGET = accounts[1];
    const contract = await LastWillNotify.deployed();

    it("test fallback", async () => {
        let time = await contract.lastActiveTs();
        await incTime(3600);
        await contract.sendTransaction({value: "50", from: OWNER});
        assert.equal((await contract.lastActiveTs()).toString(), time.toString());
        await incTime(3600);
        await contract.sendTransaction({value: "50", from: TARGET});
        time = await getTime();
        assert.equal((await contract.lastActiveTs()).toString(), time.toString());
    });

    it("test check", async () => {
        let balances = [await getBalance(accounts[3]), await getBalance(accounts[4])];
        await incTime(60);
        await contract.check();
        assert.equal((await getBalance(accounts[3])).toString(), balances[0].toString());
        assert.equal((await getBalance(accounts[4])).toString(), balances[1].toString());
        await incTime(60);
        await contract.check();
        assert.equal((await getBalance(accounts[3])).toString(), balances[0].add(25).toString());
        assert.equal((await getBalance(accounts[4])).toString(), balances[1].add(75).toString());
    });

    it("test kill", async () => {
        let balance = await getBalance(TARGET);
        let gas = (await contract.kill.estimateGas({from: TARGET})) * 10**11;
        await contract.kill({from: TARGET});
        assert.equal(balance.toString(), (await getBalance(TARGET)).add(gas).toString());
        let canSend = true;
        try {
            await contract.sendTransaction({value: "50", from: OWNER});
        } catch(e) {
            canSend = false;
        }
        assert.equal(canSend, false);
    });
});
