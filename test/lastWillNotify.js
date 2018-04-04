let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

// const utils = require('./utils')
const LastWill = artifacts.require("./LastWillNotify.sol");

const DAY = 24 * 3600;
let NOW, YESTERDAY, DAY_BEFORE_YESTERDAY, TOMORROW, DAY_AFTER_TOMORROW;

const initTime = (now) => {
    NOW = now;
    YESTERDAY = now - DAY;
    DAY_BEFORE_YESTERDAY = YESTERDAY - DAY;
    TOMORROW = now + DAY;
    DAY_AFTER_TOMORROW = TOMORROW + DAY;
};

initTime(Math.ceil(new Date("2017-10-10T15:00:00Z").getTime() / 1000));

contract('LastWillNotify', function(accounts) {
    const OWNER = accounts[0];
    const TARGET = accounts[1];

    const increaseTime = addSeconds => {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync(
                {jsonrpc: "2.0", method: "evm_increaseTime", params: [addSeconds], id: 0},
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        initTime(NOW + addSeconds);
                        resolve(result);
                    }
                }
            );
        });
    };
    const snapshot = () => {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync(
                {jsonrpc: "2.0", method: "evm_snapshot", params: [], id: 0},
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    };
    const restore = (id) => {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync(
                {jsonrpc: "2.0", method: "evm_restore", params: [id], id: 0},
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    };


});