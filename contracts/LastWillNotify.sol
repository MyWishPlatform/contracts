pragma solidity ^0.4.21;

import "./LastWill.sol";

contract LastWillNotify is LastWill {
    /**
     * Period of time (in seconds) without activity.
     */
    uint32 public noActivityPeriod;
    /**
     * Last active timestamp.
     */
    uint64 public lastActiveTs;

    /**
     * Occurs when user notify that he is available.
     */
    event Notified();

    // ------------ CONSTRUCT -------------
    function LastWillNotify(address _targetUser, address[] _recipients, uint[] _percents, uint32 _noActivityPeriod)
             LastWill(_targetUser, _recipients, _percents) {
        noActivityPeriod = _noActivityPeriod;
        lastActiveTs = uint64(block.timestamp);
    }

    // ------------ INTERNAL --------------
    function internalCheck() internal returns (bool) {
        require(block.timestamp >= lastActiveTs);
        // if there was any fund - return back; we do not need payable in this implementation
        msg.sender.transfer(msg.value);
        if (block.timestamp - lastActiveTs >= noActivityPeriod) {
            return true;
        }
        return false;
    }

    // ------------ FALLBACK -------------
    function() payable onlyAlive notTriggered {
        FundsAdded(msg.sender, msg.value);
        markAvailable();
    }


    function imAvailable() public {
        require(msg.sender == targetUser);
        markAvailable();
    }

    function markAvailable() internal {
        lastActiveTs = uint64(block.timestamp);
    }
}
