pragma solidity ^0.4.16;

import "./SoftDestruct.sol";
import "./Checkable.sol";

/**
 * The base LastWill contract. Check method must be overridden.
 */
contract LastWill is SoftDestruct, Checkable {
    struct RecipientPercent {
        address recipient;
        uint8 percent;
    }
    /**
     * Recipient addresses and corresponding % of funds.
     */
    RecipientPercent[] private percents;

    // ------------ CONSTRUCT -------------
    function LastWill(address _targetUser, address[] _recipients, uint[] _percents)
            SoftDestruct(_targetUser) {
        assert(_recipients.length == _percents.length);
        percents.length = _recipients.length;
        // check percents
        uint summaryPercent = 0;
        for (uint i = 0; i < _recipients.length; i ++) {
            address recipient = _recipients[i];
            uint percent = _percents[i];

            assert(recipient != 0x0);
            summaryPercent += percent;
            percents[i] = RecipientPercent(recipient, uint8(percent));
        }
        assert(summaryPercent == 100);
    }

    // ------------ EVENTS ----------------
    // Occurs when contract was killed.
    event Killed(bool byUser);
    // Occurs when founds were sent.
    event FundsAdded(address indexed from, uint amount);
    // Occurs when accident leads to sending funds to recipient.
    event FundsSent(address recipient, uint amount, uint8 percent);

    // ------------ FALLBACK -------------
    // Must be less than 2300 gas
    function() payable onlyAlive() notTriggered {
        FundsAdded(msg.sender, msg.value);
    }

    // ------------ INTERNAL -------------
    /**
     * Calculate amounts to transfer corresponding to the percents.
     */
    function calculateAmounts(uint balance, uint[] amounts) internal constant
                    returns (uint change) {
        change = balance;
        for (uint i = 0; i < percents.length; i ++) {
            var amount = balance * percents[i].percent / 100;
            amounts[i] = amount;
            change -= amount;
        }
    }

    /**
     * Distribute funds between recipients in corresponding by percents.
     */
    function distributeFunds() internal {
        uint[] memory amounts = new uint[](percents.length);
        uint change = calculateAmounts(this.balance, amounts);

        for (uint i = 0; i < amounts.length; i ++) {
            var amount = amounts[i];
            var recipient = percents[i].recipient;
            var percent = percents[i].percent;

            if (amount == 0) {
                continue;
            }

            recipient.transfer(amount + change);
            FundsSent(recipient, amount, percent);
        }
    }

    /**
     * @dev Do inner action if check was success.
     */
    function internalAction() internal {
        distributeFunds();
    }

    /**
     * Extends super method to add event producing.
     */
    function kill() public {
        super.kill();
        Killed(true);
    }
}
