pragma solidity ^0.4.16;

import "./LastWill.sol";
import "./ERC20Wallet.sol";

contract LastWillWallet is LastWill, ERC20Wallet {

    uint64 private lastOwnerActivity;
    uint64 private noActivityPeriod;

    event Withdraw(address _sender, uint256 amount, address _beneficiary);

    function LastWillWallet(address _targetUser, address[] _recipients, uint8[] _percents, uint64 _noActivityPeriod)
        LastWill(_targetUser, _recipients, _percents) {

        noActivityPeriod = _noActivityPeriod;
        lastOwnerActivity = uint64(block.timestamp);
    }

    function check() payable public {
        // we really do not need payable in this implementation
        require(msg.value == 0);
        super.check();
    }

    function internalCheck() internal returns (bool) {
        return block.timestamp > lastOwnerActivity && (block.timestamp - lastOwnerActivity) >= noActivityPeriod;
    }

    function sendFunds(uint256 _amount, address _receiver) onlyTarget() onlyAlive() external returns (uint256) {
        require(this.balance >= _amount);
        require(_receiver != address(0));
        require(_receiver.send(_amount));

        Withdraw(msg.sender, _amount, _receiver);
        lastOwnerActivity = uint64(block.timestamp);
        return this.balance;
    }

    function tokenTransfer(address _token, address _to, uint _value) onlyTarget() returns (bool success) {
        return super.tokenTransfer(_token, _to, _value);
    }

    function tokenTransferFrom(address _token, address _from, address _to, uint _value) onlyTarget() returns (bool success) {
        return super.tokenTransferFrom(_token, _from, _to, _value);
    }

    function tokenApprove(address _token, address _spender, uint256 _value) onlyTarget() returns (bool success) {
        return super.tokenApprove(_token, _spender, _value);
    }
}
