var BiteChain = artifacts.require("./BiteChain.sol");

contract("TestBiteChain", function(accounts) {
  const owner = accounts[0];
  const customer = accounts[1];
  const waiter = accounts[2];
  const cook = accounts[3];
  const owner2 = accounts[4];

  it("Pulling Menu info", async () => {
    const restaurant = await BiteChain.deployed();

    // Customer requests menu length
    const getMenuLength = await restaurant.getMenuLength({ from: customer });
    assert.equal(
      getMenuLength,
      3,
      "should get the correct number of items on the menu"
    );

    // Customer requests the first item off the menu
    const getMenu = await restaurant.getMenu(0, { from: customer });
    assert.equal(getMenu[0], "Sandwich", "should return the first item name");
    assert.equal(getMenu[1], 1, "should return the first item cost");
  });

  it("Customer making an order", async () => {
    const restaurant = await BiteChain.deployed();
    await restaurant.customerSubmitOrder("1", "1", "", "", {
      from: customer,
      value: 1
    });

    // Grabs orderID and qty of orders on record
    let custGetOrder = await restaurant.customerGetOpenOrders(0, {
      from: customer
    });

    // Get customer orders, check that qty is greater than 0
    let orderExists = false;
    if (custGetOrder[1] > 0) {
      orderExists = true;
    }
    assert.equal(
      orderExists,
      true,
      "should return true if there is at least 1 order"
    );
  });

  it("Assigning Workers roles", async () => {
    const restaurant = await BiteChain.deployed();

    // Add and check owner status
    await restaurant.addOwner(owner2, { from: owner });
    let isOwner = await restaurant.getOwner(owner2, { from: owner });
    assert.equal(isOwner, true, "should be a member of the owners group");

    // Add and check waiter status
    await restaurant.addWaiter(waiter, { from: owner });
    let isWaiter = await restaurant.getWaiter(waiter, { from: owner2 });
    assert.equal(isWaiter, true, "should be a member of the owners group");

    // Add and check cook status
    await restaurant.addCook(cook, { from: owner });
    let isCook = await restaurant.getCook(cook, { from: owner2 });
    assert.equal(isCook, true, "should be a member of the owners group");
  });

  it("Check roles of workers", async () => {
    const restaurant = await BiteChain.deployed();

    // Elevate thier roles
    await restaurant.addWaiter(waiter, { from: owner });
    await restaurant.addCook(cook, { from: owner });

    // Order some food
    await restaurant.customerSubmitOrder("1", "1", "", "", {
      from: customer,
      value: 1
    });
    let custGetOrder = await restaurant.customerGetOpenOrders(0, {
      from: customer
    });
    let status = await restaurant.getOrderStatus(custGetOrder[0], {
      from: customer
    });
    assert.equal(status, 0, "order should be in status 0: Ordered");

    // Waiter approves, then check status
    restaurant.waiterApprove(custGetOrder[0], { from: waiter });
    status = await restaurant.getOrderStatus(custGetOrder[0], {
      from: customer
    });
    assert.equal(status, 1, "order should be in status 1: Approved");

    // Cook cooks the check status
    restaurant.cookStart(custGetOrder[0], { from: cook });
    status = await restaurant.getOrderStatus(custGetOrder[0], {
      from: customer
    });
    assert.equal(status, 2, "order should be in status 2: Cooking");

    // Cook completes, check status
    restaurant.cookFinish(custGetOrder[0], { from: cook });
    status = await restaurant.getOrderStatus(custGetOrder[0], {
      from: customer
    });
    assert.equal(status, 3, "order should be in status 3: Food is ready");

    // Waiter delivers, check status
    restaurant.waiterDeliver(custGetOrder[0], { from: waiter });
    status = await restaurant.getOrderStatus(custGetOrder[0], {
      from: customer
    });
    assert.equal(status, 4, "order should be in status 4: Delivered");
  });
});
