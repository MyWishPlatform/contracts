module.exports = {
    increaseTime: (web3, addSeconds) => {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync(
                [{jsonrpc: "2.0", method: "evm_increaseTime", params: [addSeconds], id: 0},
                {jsonrpc: "2.0", method: "evm_mine", params: [], id: 0}],
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        // initTime(NOW + addSeconds);
                        resolve(result);
                    }
                }
            );
        });
    },
    mine: (web3) => {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync(
                {jsonrpc: "2.0", method: "evm_mine", params: [], id: 0},
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        // initTime(NOW + addSeconds);
                        resolve(result);
                    }
                }
            );
        });
    },
    web3async: (that, func, ...args) => {
        return new Promise((resolve, reject) => {
            args.push(
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        // initTime(NOW + addSeconds);
                        resolve(result);
                    }
                }
            );
            console.log(args);
            func.apply(that, args);
        });
    }
};