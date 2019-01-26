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

### Testing and Deployment

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

At this point BiteChain should have passed all tests and has migrated to your development network.

### Accessing the contract from the web

Web design is not my stong suit and I can't quite grasp how to propperly use React. For the demo, I have a bare-bones proof of concept website that will show what foods are available, how much they cost, how many open orders there are, etc.

Navigate to the `./react-app` folder and run `npm run start` This will launch a web server operation at `localhost:3000` Please navigate there with your browser.

Missing components:

- Dynamically rendering orders so that they move across the html table as they change state
- Being able to propperly read order inputs in the order food section.

Work arounds:

- Ordering food is static, you will only be able to order 1 set thing for now. But it will be submitted to the blockchain and reflected in the Open Order Status section.
- Open orders will just stay where they are in the table.

Bonus:

- ETH / USD price is pulled from an Oracle (WolframAlpa)
