# Design Patterns

## Menu Layout

- Eventually the menu will be dynamic created, allowing owners to add and remove menu items on the fly. In order to propperly display the items on a website or dapp we need to be able to get the length of the menu.
- `getMenuLength` will return the menu's length for this reason.
- At the moment the menu is statically created.
- After the dapp gets the number of menu entries, then it can index through them 1 at a time to get the menu item name and item price using `getMenu(index)`. This avoids implementing loops to display unknown lengths of arrays.

## Customer Purchase

- Dynamic arrays paramers for inputs isn't allowed yet so `customerSubmitOrder(unit, uint, uint, unit)` has a static number of inputs, tableID, QTY1, QTY2, and QTY3 for the number of each item that a customer would like to order.
- On the Smart Contract side SafeMath helps with the order calculation to check if the customer paid the correct ammount.
- If the circuit breaker is turned on, then no more orders will be able to be submitted.

## Tracking Orders

- Each order is tracked on 3 seperate variables. `orders`, `openOrders`, and `custOpenOrders`.

### Orders

- `Orders` contains every order ever made. Including all details of the order.
- `getOrderStatus(ID)` will return the order status of any order in the `orders` variable.

### Open Orders

- `getOpenOrders(relative index)` This function will return the absolute index of the order requested as well as the number of open orders.
- Example, if there are 3 open orders, then the relative index might map to 0=>3, 1=>6, 2=10. Then `getOrderStatus()` can be called on the resulting ID.
- This mapping saves the expense of looping through the entire `order` listing looking for open orders.

### Customer Open Orders

- This is the same as the Open Orders above, but it will only show orders that belong to the requesting customer.
- `getCustomerOpenOrders(relative index)` This function will return the absolute index of the order requested as well as the number of open orders.
- Example, if a customer had 3 open orders, then the relative index might map to 0=>3, 1=>6, 2=10. This mapping saves the expense of looping through each order looking for one related to the customer.
- The second paramater returned is the QTY of open orders so that the dapp will know how many times it will need to run the query.

## Order processing

- The order's state is tracked in the `state` enum. 0-Ordrered, 1-Approved, 2-Cooking, 3-Ready, 4-Delivered.
- After an order has been placed, the waiter must approved it with the `waiterApprove(ID)` only a waiter can do this.
- Then a cook begins cooking and uses `cookStart(ID)` to set the state, then `cookFinish(ID)` when finished.
- The Waiter's final step is to deliver the food and update the state with `waiterDeliver(ID)`

## Roles

- There are 3 roles on this contract: Owner, Cook and Waiter. To check if an address is one of these, `getOwner(address)`, `getWaiter(address)` or `getCook(address)` can be used.

### Owner

- Contract creator starts off as the only owner.
- Owner can then promote other accounts with `addOwner(address)`, `addWaiter(address)`, and `addCook`
- Owner can also demote with `removeOwner(address)`, `removeWaiter(address)`, and `removeCook(address)`
- Most importantly, owners can take funds out of the account with withdrawal.
- Can enable/disable the circuit breaker to temporarily prevent future orders. Example: When the store is closing for the night, no more orders should be placed. Circuit breaker can be used in this instance.
- Owner can also SelfDestuct and perminantly disable the contract with the `Destroy` function.

### Waiter

- Can only approve and deliver orders.

### Cook

- Can only start cooking and finish cooking.
