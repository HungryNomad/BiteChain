pragma solidity ^0.5.0;

import "./SafeMath.sol";

/// @title A restaurant order managment system
/// @author Nanoshi
/// @notice You can use this contract for testing purposes only
/// @notice For prodution, lockdown the addWaiter and addCook with isOwner modifier
/// @dev All function calls are currently implement without side effects
contract BiteChain {

    using SafeMath for uint256;
    /* State Variables */
    address owner;
    // Tracks open orders at a table
    uint[] openOrders;
    bool circuitBreaker;

    // Orders specific to a customer
    mapping (address => uint[]) custOpenOrders;
    // Tracking of owners, cooks and waiters
    mapping (address => bool) owners;
    mapping (address => bool) cooks;
    mapping (address => bool) waiters;

    // Menu stuct for holding items as cost
    struct Menu {
        string name;
        uint cost;
    }
    Menu[] menu;

    // Tracks the flow of orders as they progress
    enum State { ordered, accpeted, cooking, ready, delivered }

    // Holds all info of an order
    // menuChoices is 2d array for item number and quantity
    struct Order {
        address customer;
        uint tableID;
        uint[2][3] menuChoices;
        uint custRelID;
        uint openRelID;
        State state;
    }
    Order[] orders;

    /* Modifiers */    
    // Checks if the sender is an owner, cook, waiter or customer
    // *The contractor is ALWAYS the owner, cannot be demoted*  
    modifier isOwner(){
        require(owners[msg.sender] == true || (msg.sender == owner), "Only an owner can modify this");
        _;
    }
    modifier isCook(){
        require(cooks[msg.sender] == true, "Only cooks can modify this");
        _;
    }
    modifier isWaiter(){
        require(waiters[msg.sender] == true, "Only an waiters can modify this");
        _;
    }

    /* Initialize Contract */
    /// @notice Initializing the contract
    /// @dev No starting paramaters needed
    constructor() public {
        // Give initial control to contract owner
        // Owner starts with all roles
        owners[msg.sender] = true;
        cooks[msg.sender] = true;
        waiters[msg.sender] = true;
        circuitBreaker = false;
        // Backdoor in case you delete yourself, you will still be an owner
        owner = msg.sender;

        // Set up the menu
        menu.push(Menu("Sandwich",1));
        menu.push(Menu("Taco", 3));
        menu.push(Menu("Chicken",2));
    }   

    /// @notice Tells you how many items are on the menu
    /// @return count of menu items
    function getMenuLength() public view returns (uint){
        return (menu.length);
    }

    /// @notice Get menu item info based on thier index (starting from 0)
    /// @dev Look up by index rather than loops is more economical
    /// @param index The index of the menu item to look up
    /// @return name of item at the index requested
    /// @return cost of the item at index requested
    function getMenu(uint index) public view returns(string memory, uint) {
        return (menu[index].name, menu[index].cost);   
    }
    
    /// @notice Submit order with tablie ID and quantity of each item requested. Payable
    /// @dev The order will be checked to ensure that that correct ammount has been paid
    /// @param tableID The ID of the Table, where the food should be sent
    /// @param qty0 How many orders of food from menu index 0
    /// @param qty1 How many orders of food from menu index 1
    /// @param qty2 How many orders of food from menu index 2
    /// @return orderID The ID of the order placed
    function customerSubmitOrder(uint table, uint qty0, uint qty1, uint qty2) 
        public payable returns(uint orderID){

        //Quick check if the circuit breaker is on
        require(circuitBreaker == false, "Sorry, currently not taking orders.");

        // Prep info to be stored into order[x].memuChoices
        uint[2][3] memory choices;
        choices[0] = [0,qty0];
        choices[1] = [1,qty1];
        choices[2] = [2,qty2];

        // Using SafeMath for cost calculation
        uint256 _cost;
        // QtyOf0 * CostOf0
        _cost = choices[0][1].mul(menu[0].cost);
        // Cost += QtyOf1 * CostOf1 ... 
        _cost = _cost.add(choices[1][1].mul(menu[1].cost));
        _cost = _cost.add(choices[2][1].mul(menu[2].cost));

        require(_cost >= msg.value, "Paid too much.");
        require(_cost <= msg.value, "Paid too little.");

        // Add a reference to the customer relative ID 
        uint _custRelID = custOpenOrders[msg.sender].length;

        // Length - 1; might resut in buffer underflow. Check for 0 value first, then decriment
        if (_custRelID != 0){_custRelID--;}
        uint _openRelID = openOrders.length;
        if (_openRelID != 0){_openRelID--;}

        // Create records in all 3 variables
        orderID = orders.push(Order(msg.sender,table,choices,_custRelID,_openRelID,State.ordered)) - 1;
        openOrders.push(orderID);
        custOpenOrders[msg.sender].push(orderID);
    }

    /// @notice Returns the absolute global orderID and quantity of orders on record for this customer
    /// @dev Maps customer relative ID to global ID
    /// @param relativeID The customer relative order ID starting from 0
    /// @return ID The global order ID
    /// @return qty The number of orders that the customer has under thier address
    function customerGetOpenOrders(uint relativeID) public view returns(uint ID, uint qty){
        if (openOrders.length == 0){
            return (0,0);
        }
        return(custOpenOrders[msg.sender][relativeID], custOpenOrders[msg.sender].length);
    }
    
    /// @notice Updates the status of an order from Ordered to Approved
    /// @param orderID The order ID to be changed to Approved
    /// @return success true if the order change succeeded 
    function waiterApprove(uint orderID) public isWaiter {
        require(orderID < orders.length, "ID is invalid.");
        require(orders[orderID].state == State.ordered, "This order is not in the ordered state");
        orders[orderID].state = State.accpeted;
    }
    
    /// @notice Updates the status of an order from Approved to Cooking
    /// @param orderID The order ID to be changed to Cooking
    /// @return success true if the order change succeeded 
    function cookStart(uint orderID) public isCook {
        require(orderID < orders.length, "ID is invalid.");
        require(orders[orderID].state == State.accpeted, "This order is not in the ordered state");
        orders[orderID].state = State.cooking;
    }
    
    /// @notice Updates the status of an order from Cooking to Ready
    /// @param orderID The order ID to be changed to Ready
    /// @return success true if the order change succeeded 
    function cookFinish(uint orderID) public isCook {
        require(orderID < orders.length, "ID is invalid.");
        require(orders[orderID].state == State.cooking, "This order is not in the ordered state");
        orders[orderID].state = State.ready;
    }
    
    /// @notice Updates the status of an order from Ready to delivered
    /// @param orderID The order ID to be changed to Ready
    /// @return success true if the order change succeeded 
    function waiterDeliver(uint orderID) public isWaiter {
        require(orderID < orders.length, "ID is invalid.");
        require(orders[orderID].state == State.ready, "This order is not in the ordered state.");
        orders[orderID].state = State.delivered;

        // Clean up custOpenOrders state variable
        address _customer = orders[orderID].customer;
        uint _custRelID = orders[orderID].custRelID;
        uint _custLastOrder = custOpenOrders[_customer].length - 1;
        // Check to see if the relID is the last in the array
        if (_custLastOrder != _custRelID){
            // If not, then copy the last item overwriting the one being deleted
            custOpenOrders[_customer][_custRelID] = custOpenOrders[_customer][_custRelID];            
            // Get absolute order ID of the moved item
            uint _absOrderID = custOpenOrders[_customer][_custRelID];
            // Adjust the info in order state variable
            orders[_absOrderID].custRelID = _custRelID;
        }
        // Shrink the array clearing moved ID or said relID
        custOpenOrders[_customer].length--;

        // Clean up openOrders state variable
        uint _openRelID = orders[orderID].openRelID;
        uint _openLastOrder = openOrders.length - 1;
        // Check to see if the relID is the last in the array
        if (_openRelID != _openLastOrder){
            // If not, then copy the last item overwriting the one being deleted
            openOrders[_openRelID] = openOrders[_openLastOrder];            
        }
        // Shrink the array clearing moved ID or said relID
        openOrders.length--;
    }

    /// @notice Tells you the state of an odrer 0:Ordered 1:Approved 2:Cooking 3:Ready 4:Delivered
    /// @param orderID The ID of the order that is being looked up
    /// @return state The state of the order. 0:Ordered 1:Approved 2:Cooking 3:Ready 4:Delivered
    function getOrderStatus(uint orderID) public view returns(uint state){
        require(orderID < orders.length, "ID is invalid.");
        return(uint(orders[orderID].state));
    }

    /// @notice Tells you the state of an odrer 0:Ordered 1:Approved 2:Cooking 3:Ready 4:Delivered
    /// @param orderID The ID of the order that is being looked up
    /// @return state The state of the order. 0:Ordered 1:Approved 2:Cooking 3:Ready 4:Delivered
    function getOpenOrders(uint relIndex) public view returns (uint ID, uint qty){
        if (openOrders.length == 0){
            return (0,0);
            }
        require(relIndex < openOrders.length, "ID is invalid.");
        return(openOrders[relIndex],openOrders.length);
    }

    /// @notice Adds the role of Owner to the specified address
    /// @param ownerAddress The address of the new Owner
    /// @return success true if the address was promoted to the new role 
    function  addOwner(address ownerAddress) public isOwner returns (bool){
        owners[ownerAddress] = true;
        return(true);
    }
    /// @notice Adds the role of Waiter to the specified address
    /// @param addWaiter The address of the new Waiter
    /// @return success true if the address was promoted to the new role 
    function  addWaiter(address waiterAddress) public returns (bool success){
        waiters[waiterAddress] = true;
        return(true);
    }
    /// @notice Adds the role of Cook to the specified address
    /// @param addCook The address of the new Cook
    /// @return success true if the address was promoted to the new role 
    function  addCook(address cookAddress) public returns (bool success){
        cooks[cookAddress] = true;
        return(true);
    }
    /// @notice Removes the role of Owner to the specified address
    /// @param ownerAddress The address of the Owner to be removed
    /// @return success true if the address was removed from the role 
    function  removeOwner(address ownerAddress) public isOwner returns (bool success){
        owners[ownerAddress] = false;
        return(true);
    }
    /// @notice Removes the role of Waiter to the specified address
    /// @param waiterAddress The address of the Waiter to be removed
    /// @return success true if the address was removed from the role 
    function  removeWaiter(address waiterAddress) public returns (bool success){
        waiters[waiterAddress] = false;
        return(true);
    }
    /// @notice Removes the role of Cook to the specified address
    /// @param cookAddress The address of the Cook to be removed
    /// @return success true if the address was removed from the role 
    function  removeCook(address cookAddress) public returns (bool success){
        cooks[cookAddress] = false;
        return(true);
    }

    /// @notice Checks to see if the requested address is a waiter
    /// @param queryAddress The address that you want to confirm
    /// @return success true if address is a member of waiters
    function  getWaiter(address queryAddress) public view returns (bool success){
        return(waiters[queryAddress]);
    }

    /// @notice Checks to see if the requested address is a cook
    /// @param queryAddress The address that you want to confirm
    /// @return success true if address is a member of cooks
    function  getCook(address queryAddress) public view returns (bool success){
        return(cooks[queryAddress]);
    }

    /// @notice Checks to see if the requested address is an owner
    /// @param queryAddress The address that you want to confirm
    /// @return success true if address is a member of owners
    function  getOwner(address queryAddress) public view returns (bool success){
        return(owners[queryAddress]);
    }

    /// @notice Checks to see if the requested address is a waiter
    /// @param queryAddress The address that you want to confirm
    /// @return success true if address is a member of waiters
    function withdraw(uint withdrawAmount) public isOwner {
        require (address(this).balance >= withdrawAmount, "Requested more money than the contract has.");
        msg.sender.transfer(withdrawAmount);
    }

    /// @notice Destroy contract
    /// @dev Any user in the owners map can destroy
    function destroyContract() public isOwner{
        selfdestruct(msg.sender);
    }

    /// @notice Disable circuit breaker and prevent any additional orders from being placed
    function disableBreaker() public isOwner{
        circuitBreaker = false;
    }

    /// @notice Enable circuit breaker and prevent any additional orders from being placed
    function enableBreaker() public isOwner{
        circuitBreaker = true;
    }

    /// @notice Fallback function
    /// @dev No params nor returns. This is here just in case no functions are called
    function () external payable{}


} // End contract