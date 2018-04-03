echo "LastWillOraclize.sol"
solc --bin --abi --gas --optimize -o target --overwrite contracts/LastWillOraclize.sol
echo "WillOraclizeProxy.sol"
solc --bin --abi --gas --optimize -o target --overwrite contracts/LastWillOraclizeProxy.sol
echo "LastWillParityWallet.sol"
solc --bin --abi --gas --optimize -o target --overwrite contracts/LastWillParityWallet.sol

echo "DelayedPayment.sol"
solc --bin --abi --gas --optimize -o target --overwrite contracts/DelayedPayment.sol

echo "Pizza.sol"
solc --bin --abi --gas --optimize -o target --overwrite contracts/Pizza.sol
