# Security

## Buffer Overflow/Underflow protections

- This project is using the SafeMath library from OpenZepplin in the cost calculation function to mitigate this risk.

## Reentrancy attack mitigation

- There are no external calls to be exploited.
- Contact balance is stored in address.balance and not in a state variable making it impossible to withdrawal more than that contract balance.
- If 2 owners attempt to double withdrawl, it is protected in the same way double spends are on the main Ethereum chain. Only one would be processed in the longest chain.

## Role management

- To start off, the contract owner is registered to the owner variable.
- Others can be added and removed from the owners mapping.
- The owner starts off as a member of all 3 roles: owners, waiters, and cooks.
- Anyone in the owners group can then delegate roles to other addresses.
- As a safety feature, the original owner cannot be removed from the owner role (this is handled in the isOwner function modification.

## Permissions

- As the ordering process follows a particular flow, orders must be signed in a certain order. This ensures that no steps are skipped.
- isOwner, isCook and isWaiter modifiers ensure that only employees with approved roles can modify the order state.

## Other Security thoughts

- A circuit breaker function has been incorporated to prevent further pur
- Only owners can withdraw funds and the money goes directly to their account
- Limiting withdrawals to on the the msg.sender’s account prevents funds from being accidently sent to the wrong account
- Funds are transferred using the safer transfer() function rather than the send function