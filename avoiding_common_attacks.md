# Security

## Role managment

- To start off, the contract creator is perm
- To start off, the contract owner is permanently registered to the owner variable.
- Others can be added and removed from the owners mapping.
- The owner starts off as a member of all 3 roles: owners, waiters, and cooks.
- Anyone in the owners group can then delegate roles to other addresses.
- As a safety feature, the original owner cannot be removed from the owner role (this is handled in the isOwner function modification.

## Permissions

- As the ordering process follows a particular flow, orders must be signed in a certain order. This ensures that no steps are skipped.
- isOwner, isCook and isWaiter modifiers ensure that only employees with approved roles can modify the order state.

## Other Security thoughts

- Only owners can withdraw funds and the money goes directly to their account
- Limiting withdrawals to on the the msg.sender’s account prevents funds from being accidently sent to the wrong account
- Funds are transferred using the safer transfer() function rather than the send function
