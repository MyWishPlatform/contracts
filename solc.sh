echo "LastWillOraclize.sol"
solc --bin --abi --gas --optimize -o target --overwrite LastWillOraclize.sol
echo "WillOraclizeProxy.sol"
solc --bin --abi --gas --optimize -o target --overwrite LastWillOraclizeProxy.sol
echo "LastWillParityWallet.sol"
solc --bin --abi --gas --optimize -o target --overwrite LastWillParityWallet.sol

echo "DelayedPayment.sol"
solc --bin --abi --gas --optimize -o target --overwrite DelayedPayment.sol
