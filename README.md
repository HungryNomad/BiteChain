# BiteChain

Manage restaurant orders using blockchain technologies to increase speed and reduce operation costs. This is initailly designed to track and process simple orders.

### Future features (to-do)

- Track store inventories and display only item that are available
- Customer loyalty system, award disounts to frequent visitors
- Implement Uport review system, like Yelp but with only verified purchases

## Reasons to use blockchain in the food industry

### Benifits for everyone

- Eco friendly by reducing paper waste from menus and reciepts
- Customers, wait staff, cooks, and owners are able to view the status of any order at any time.
- Promotions / point cards can be linked to customer accounts (UPort), no more need to issue or save cards.

### Benifits for customers

- Less chance of incorrect orders since the customer is the one submitting the order.
- Customers can order at their leisure, they don't need to worry about staff coming too often or not often enough.
- Speed! Orders are verified and then sent directly to the cook. This can shave off a few minutes from the ordering and delivery process

### Benifits for owners

- Owners can track many stores in real time
- Tracking invetories allows for optimized ordering.
- Cashless stores reduces the risk of internal and external theft.

## How to set it up

Please ensure that you have Truffle version > 0.5.0 installed. If not, simply run:

```
npm install -g truffle
```

To get started, clone or download the repository. Then open a new terminal and navigate to the downloaded project and run the following command

```
truffle develop
```

(Opional) If you wish to test on your local network, please note which port your truffle development is running on also copy your seed mnemonics down for later. Alternatively, there is a copy of this contact running on Ropsten network that you can play around with. Back to the truffle(develop) window:

```
compile
migrate
test
```
