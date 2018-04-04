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
    function LastWillNotify(address _targetUser, address[] _recipients, uint[] _percents, uint32 _noActivityPeriod) public
             LastWill(_targetUser, _recipients, _percents) {
        noActivityPeriod = _noActivityPeriod;
        lastActiveTs = uint64(block.timestamp);
    }

    // ------------ INTERNAL --------------
    function internalCheck() internal returns (bool) {
        require(block.timestamp >= lastActiveTs);
        // we do not need payable
        require(msg.value == 0);
        if (block.timestamp - lastActiveTs >= noActivityPeriod) {
            return true;
        }
        return false;
    }

    // ------------ FALLBACK -------------
    function() public payable onlyAlive notTriggered {
        FundsAdded(msg.sender, msg.value);
        if (msg.sender != targetUser) {
            return;
        }
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
