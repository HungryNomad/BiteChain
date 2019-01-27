import React, { Component } from "react";
import BiteChainContract from "./contracts/BiteChain.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    owner: null,
    menuLength: null,
    menuName0: null,
    menuPrice0: null,
    menuName1: null,
    menuPrice1: null,
    menuName2: null,
    menuPrice2: null,
    isOwner: null,
    isWaiter: null,
    isCook: null,
    custOpenOrders: null
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

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
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
    const _isWaiter = await contract.methods
      .getCook(this.state.accounts[0])
      .call();
    const _isCook = await contract.methods
      .getWaiter(this.state.accounts[0])
      .call();
    const _custOpenOrders = await contract.methods
      .customerGetOpenOrders(0)
      .call();

    // Update state with the result.
    this.setState({
      menuLength: _menuLength,
      menuName0: _item0[0],
      menuPrice0: _item0[1],
      menuName1: _item1[0],
      menuPrice1: _item1[1],
      menuName2: _item2[0],
      menuPrice2: _item2[1],
      //owner: _owner,
      isOwner: _isOwner,
      isWaiter: _isWaiter,
      isCook: _isCook,
      custOpenOrders: _custOpenOrders
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // Conditional formatting goees here
    //if (this.state.isWaiter) {
    //  displayOwner = "You are logged in as a Waiter. <br/>";
    //}

    return (
      <div className="App">
        <h1>Welcome to BiteChain Dapp </h1>
        <h2>Deployed to: {this.address}</h2>
        <p>
          Welcome, Acct: {this.state.accounts[0]} <br />
          {this.state.custOpenOrders}
          {this.state.isOwner ? "You are logged in as an Owner\n." : "not"}
          {this.state.isWaiter ? "You are logged in as a Waiter. \r\n" : "not"}
          {this.state.isCook ? "You are logged in as a Cook. \r\n" : "not"}
          {this.state.isCustomer ? "You are logged in as a Customer. \r\n" : ""}
          <br />
          This contract is owned by: {this.state.owner}
        </p>
        <table id="TopTable" align="center" width="800px" border="1">
          <tr>
            <td>
              <table>
                <tr>
                  <th>Owner's Overview</th>
                </tr>
                <tr>
                  <td>Open Orders</td>
                  <td />
                </tr>
                <tr>
                  <td>Total Orders</td>
                  <td />
                </tr>
                <tr>
                  <td>Wei in account</td>
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
                  <th>QTY</th>
                  <th>Cost</th>
                </tr>
                <tr>
                  <td>
                    {this.state.menuName0} - {this.state.menuPrice0}
                  </td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>
                    {this.state.menuName1} - {this.state.menuPrice1}
                  </td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>
                    {this.state.menuName2} - {this.state.menuPrice2}
                  </td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>Submit Order</td>
                  <td />
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <h2>Smart Contract Example</h2>
        <p>Owner of contract: {this.state.owner}</p>
        <p> Open orders: </p>
        <p>
          Today we have {this.state.menuLength} items for sale. <br />
          Menu / Price in wei:{" "}
        </p>
        <p>
          {this.state.menuName0} {this.state.menuPrice0}
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>
          The stored value is: {this.state.storageValue}
          {this.state.owner}
        </div>
      </div>
    );
  }
}

export default App;
