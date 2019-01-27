import React, { Component } from "react";
import BiteChainContract from "./contracts/BiteChain.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    owner: null,
    //Menu Info
    menuLength: null,
    menuName0: null,
    menuPrice0: null,
    menuName1: null,
    menuPrice1: null,
    menuName2: null,
    menuPrice2: null,
    // Role info
    isOwner: null,
    isWaiter: null,
    isCook: null,
    // Customer Order info
    custOpenOrders: null,
    inputValue: "",
    item1qty: 0,
    item1sub: 5,
    // Get open order info
    openOrderQty: 0,
    // Can't figure out how to optimize, will just get state for EVERYTHING!
    orderID1: null,
    orderID2: null,
    orderID3: null,
    orderStatus1: null,
    orderStatus2: null,
    orderStatus3: null,
    orderTable1: null,
    orderTable2: null,
    orderTable3: null,
    orderCustomer1: null,
    orderCustomer2: null,
    orderCustomer3: null,
    orderQty11: null,
    orderQty12: null,
    orderQty13: null,
    orderQty21: null,
    orderQty22: null,
    orderQty23: null,
    orderQty31: null,
    orderQty32: null,
    orderQty33: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BiteChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BiteChainContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.loadMenu);
      //this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  loadMenu = async () => {
    const { accounts, contract } = this.state;

    //const _owner = await contract.methods.getowner().call();

    const _menuLength = await contract.methods.getMenuLength().call();

    // Replace with a clever foreach js loop later
    const _item0 = await contract.methods.getMenu(0).call();
    const _item1 = await contract.methods.getMenu(1).call();
    const _item2 = await contract.methods.getMenu(2).call();

    // Get Roles
    const _isOwner = await contract.methods.getOwner(accounts[0]).call();
    const _isWaiter = await contract.methods.getWaiter(accounts[0]).call();
    const _isCook = await contract.methods.getCook(accounts[0]).call();
    // const _item1sub = this.refs.item1qty;

    // Get Qty of open orders
    const _openOrderQty = await contract.methods.getOpenOrders(0).call();

    // Update state with the result.
    this.setState({
      menuLength: _menuLength,
      menuName0: _item0[0],
      menuPrice0: _item0[1],
      menuName1: _item1[0],
      menuPrice1: _item1[1],
      menuName2: _item2[0],
      menuPrice2: _item2[1],
      isOwner: _isOwner,
      isWaiter: _isWaiter,
      isCook: _isCook,
      openOrderQty: _openOrderQty[1]

      // item1sub: _item1sub
    });
  };

  //onChangeEvent test doesn't work!
  changeQty() {
    this.setState({ item1qty: 1 });
  }

  orderFood1 = async () => {
    const { accounts, contract } = this.state;

    console.log("Ordering item #1");
    //const _isOwner = await contract.methods.getCook(accounts[0]).call();
    await contract.methods
      .customerSubmitOrder("1", "1", "0", "0")
      .send({ from: accounts[0], value: 1 });
  };
  orderFood2 = async () => {
    const { accounts, contract } = this.state;

    console.log("Ordering item #2");
    //const _isOwner = await contract.methods.getCook(accounts[0]).call();
    await contract.methods
      .customerSubmitOrder("1", "0", "1", "0")
      .send({ from: accounts[0], value: 3 });
  };
  orderFood3 = async () => {
    const { accounts, contract } = this.state;

    console.log("Ordering item #3");
    //const _isOwner = await contract.methods.getCook(accounts[0]).call();
    await contract.methods
      .customerSubmitOrder("1", "0", "0", "1")
      .send({ from: accounts[0], value: 2 });
  };

  addWaiter = async () => {
    const { accounts, contract } = this.state;
    console.log("Assigning this account the waiter role");
    await contract.methods.addWaiter(accounts[0]).send({ from: accounts[0] });
  };
  addCook = async () => {
    const { accounts, contract } = this.state;
    console.log("Assigning this account the cook role");
    await contract.methods.addCook(accounts[0]).send({ from: accounts[0] });
  };
  removeWaiter = async () => {
    const { accounts, contract } = this.state;
    console.log("Assigning this account the waiter role");
    await contract.methods
      .removeWaiter(accounts[0])
      .send({ from: accounts[0] });
  };
  removeCook = async () => {
    const { accounts, contract } = this.state;
    console.log("Assigning this account the cook role");
    await contract.methods.removeCook(accounts[0]).send({ from: accounts[0] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // Set up the order table here

    for (var i = 0; i < this.state.openOrderQty; i++) {
      // Iterate over numeric indexes from 0 to 5, as everyone expects.
      console.log(i);
    }

    return (
      <div className="App">
        <h1>Welcome to BiteChain Dapp </h1>
        <p>
          Welcome, Acct: {this.state.accounts[0]} <br />
        </p>
        <p>
          You are currently connected to smart contract:{" "}
          {this.state.contract._address}
        </p>
        <p>
          {this.state.custOpenOrders}
          {this.state.isOwner ? "You are logged in as an Owner. " : ""}
          {this.state.isWaiter ? "You are logged in as a Waiter. " : ""}
          {this.state.isCook ? "You are logged in as a Cook. " : ""}
          {this.state.isCustomer ? "You are logged in as a Customer. " : ""}
        </p>
        <table align="center" border="1">
          <tr>
            <td colSpan="2">
              <strong>Manage employee roles</strong>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={this.addWaiter}>
                Assign the waiter role to this account
              </button>
            </td>
            <td>
              <button onClick={this.removeWaiter}>
                Remove the waiter role from this account
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={this.addCook}>
                Assign the cook role to this account
              </button>
            </td>
            <td>
              <button onClick={this.removeCook}>
                Remove the cook role from this account
              </button>
            </td>
          </tr>
        </table>
        <br />
        <table id="TopTable" align="center" width="800px" border="1">
          <tr>
            <td>
              <table>
                <tr>
                  <th>Owner's Overview</th>
                </tr>
                <tr>
                  <td>Total Open Orders: {this.state.openOrderQty}</td>
                  <td />
                </tr>
                <tr>
                  <td>Your Open Orders:</td>
                  <td />
                </tr>
                <tr>
                  <td>Wei in account:</td>
                  <td />
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <td />
                  <th align="center">Order here!</th>
                </tr>
                <tr>
                  <th>Available Items / Price in Wei</th>
                </tr>
                <tr>
                  <td>
                    {this.state.menuName0} - {this.state.menuPrice0}
                  </td>
                  <td>
                    <button onClick={this.orderFood1}>
                      Order a {this.state.menuName0}
                    </button>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>
                    {this.state.menuName1} - {this.state.menuPrice1}
                  </td>
                  <td>
                    <button onClick={this.orderFood2}>
                      Order a {this.state.menuName1}
                    </button>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>
                    {this.state.menuName2} - {this.state.menuPrice2}
                  </td>
                  <td>
                    <button onClick={this.orderFood3}>
                      Order a {this.state.menuName2}
                    </button>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
              </table>
            </td>
          </tr>
        </table>
        (The payments are very small, you can see the transfered amount on
        etherscan)
        <br />
        To speed things up, you can refresh the page after your transaction has
        been confirmed.
        <h2>Order Tracking and Management</h2>
        <h3>
          (Ordering and tracking not implemented on React yet - please use Remix
          for now)
        </h3>
        <table align="center" border="1" width="800px">
          <tr>
            <th>
              Ordered
              <br />
              For Waiter
            </th>
            <th>
              Approved
              <br />
              For Cook
            </th>
            <th>
              Cooking
              <br />
              For Cook
            </th>
            <th>
              Ready
              <br />
              For Waiter
            </th>
          </tr>
          <tr>
            <td>
              OrderID: x<br />
              Customer: 0x00..1234
              <br />
              Table:5
              <br />
              <u>
                <strong>Order:</strong>
              </u>
              <br /> Sandwich: 1<br /> Chicken:2
              <br />
              <button>Approve Order</button>
            </td>
            <td>
              OrderID: x<br />
              Customer: 0x00..1234
              <br />
              Table:5
              <br />
              <u>
                <strong>Order:</strong>
              </u>
              <br /> Sandwich: 1<br /> Chicken:2
              <br />
              <button>Begin Cooking</button>
            </td>
            <td>
              OrderID: x<br />
              Customer: 0x00..1234
              <br />
              Table:5
              <br />
              <u>
                <strong>Order:</strong>
              </u>
              <br /> Sandwich: 1<br /> Chicken:2
              <br />
              <button>Finished Cooking</button>
            </td>
            <td>
              OrderID: x<br />
              Customer: 0x00..1234
              <br />
              Table:5
              <br />
              <u>
                <strong>Order:</strong>
              </u>
              <br /> Sandwich: 1<br /> Chicken:2
              <br />
              <button>Delivered Food</button>
            </td>
          </tr>
        </table>
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
}

export default App;
