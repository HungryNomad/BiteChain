# BiteChain (Work in progress)

BiteChain allows customers to walk into a store, scan a barcode on the table, order a few items directly from their phone, then a few minutes later the food arrives at their table. On the back end, waiters and cooks will see orders immediately as they are placed and they can update the order's status as it is being prepared, streamlining the entire ordering process.

Allow your resturant to run 100% cashless! Utilizing BiteChain's smart contract to manage your orders will increase speed, reduce operation costs and give owners better visibility of everything going on. This is initially designed to track and process simple orders. In the future, it would be possible to track entire franchises.

### Future features (to-do)

- Track store inventories and display only items that are available.
- Automate re-ordering of supplies based on how much is sold.
- Customer loyalty system, award discounts to frequent visitors.
- Implement Uport review system, like Yelp but with only verified purchases.

## Reasons to use blockchain in the food industry

### Benefits for everyone

- Eco friendly by reducing paper waste from menus and receipts.
- Customers, waiters, cooks, and owners are able to view the status of any order at any time.
- Promotions / point cards can be linked to customer accounts (UPort), no more need to issue or save cards.

### Benefits for customers

- Less chance of incorrect orders since the customer is the one submitting the order.
- Customers can order at their leisure, they don't need to worry about staff coming too often or not often enough.
- Speed! Orders are verified and then sent directly to the cook. This can shave off a few minutes from the ordering and delivery process.

### Benefits for owners

- Owners can track many stores in real time.
- Tracking inventories allows for optimized ordering.
- Cashless stores reduces the risk of internal and external theft.

## How to set it up

### Testing and Deployment

Please ensure that you have Truffle version > 0.5.0 installed. If not, simply run:

```
npm install -g truffle
```

To get started, clone or download the repository. Then open a new terminal and navigate to the downloaded project and run the following command:

```
truffle develop
```

(Optional) If you wish to test on your local network, please note which port your truffle development is running on also copy your seed mnemonics down for later. Alternatively, there is a copy of this contact running on Ropsten network that you can play around with. Back to the truffle(develop) window:

```
compile
migrate
test
```

At this point BiteChain should have passed all tests and has migrated to your development network.

```
truffle(develop)> test
Using network 'develop'.

Compiling .\contracts\SafeMath.sol...

  Contract: TestBiteChain
    √ Pulling Menu info (200ms)
    √ Customer making an order (231ms)
    √ Assigning Workers roles (417ms)
    √ Check roles of workers (735ms)

  4 passing (2s)
```

### Accessing the contract from the web

Web design is not my strong suit and I can't quite grasp how to properly use React. For the demo, I have a bare-bones proof of concept website that will show what foods are available, how much they cost, how many open orders there are, etc.

Navigate to the `./react-app` folder and run `npm run start` This will launch a web server operation at `localhost:3000` Please navigate there with your browser.

From here, you can test making orders and modifying employee roles. There is also a copy of the contract running on Rinkeby network. Make sure that BiteChain.json is pointing to this address on Rinkby to try it out:

```
  "networks": {
    "4": {
      "events": {},
      "links": {},
      "address": "0x0A40eAeFd7Ad69E5E8b8307a33295019173b70Ec",
      "transactionHash": "0xe86a358e179a638131ef68fbd17a750b7668b864d91e6dd1db4deec6908496f8"
    },
  }
```

Missing components:

- Dynamically rendering orders so that they move across the html table as they change state
- Being able to properly read order inputs in the order food section.

Workarounds:

- Ordering food is static, you will only be able to order one set thing for now. But it will be submitted to the blockchain and reflected in the Open Order Status section.
- Open orders will just stay where they are in the table.

Bonus:

- ETH / USD price is pulled from an Oracle (WolframAlpa)

```

```
