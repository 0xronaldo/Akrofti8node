// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Akroft Calculator
 * @dev A demonstration smart contract for Akroft i8 Node platform
 * @dev Performs basic calculations with Chainlink price feed integration
 */
contract AkroftCalculator {
    AggregatorV3Interface internal priceFeed;
    
    // Events for logging calculations
    event CalculationPerformed(
        address indexed user,
        string operation,
        uint256 operandA,
        uint256 operandB,
        uint256 result,
        uint256 timestamp
    );
    
    event PriceRequested(
        address indexed user,
        int256 price,
        uint256 timestamp
    );
    
    // Mapping to store user calculation history
    mapping(address => uint256[]) public userResults;
    mapping(address => uint256) public userCalculationCount;
    
    // Owner for admin functions
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        // ETH/USD price feed for Arbitrum Sepolia testnet
        // Address: 0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08
        priceFeed = AggregatorV3Interface(0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08);
    }
    
    /**
     * @dev Add two numbers
     */
    function add(uint256 _a, uint256 _b) public returns (uint256) {
        uint256 result = _a + _b;
        userResults[msg.sender].push(result);
        userCalculationCount[msg.sender]++;
        
        emit CalculationPerformed(
            msg.sender,
            "ADD",
            _a,
            _b,
            result,
            block.timestamp
        );
        
        return result;
    }
    
    /**
     * @dev Subtract two numbers
     */
    function subtract(uint256 _a, uint256 _b) public returns (uint256) {
        require(_a >= _b, "Result cannot be negative");
        uint256 result = _a - _b;
        userResults[msg.sender].push(result);
        userCalculationCount[msg.sender]++;
        
        emit CalculationPerformed(
            msg.sender,
            "SUBTRACT",
            _a,
            _b,
            result,
            block.timestamp
        );
        
        return result;
    }
    
    /**
     * @dev Multiply two numbers
     */
    function multiply(uint256 _a, uint256 _b) public returns (uint256) {
        uint256 result = _a * _b;
        userResults[msg.sender].push(result);
        userCalculationCount[msg.sender]++;
        
        emit CalculationPerformed(
            msg.sender,
            "MULTIPLY",
            _a,
            _b,
            result,
            block.timestamp
        );
        
        return result;
    }
    
    /**
     * @dev Divide two numbers
     */
    function divide(uint256 _a, uint256 _b) public returns (uint256) {
        require(_b != 0, "Cannot divide by zero");
        uint256 result = _a / _b;
        userResults[msg.sender].push(result);
        userCalculationCount[msg.sender]++;
        
        emit CalculationPerformed(
            msg.sender,
            "DIVIDE",
            _a,
            _b,
            result,
            block.timestamp
        );
        
        return result;
    }
    
    /**
     * @dev Get the latest ETH price from Chainlink
     */
    function getLatestETHPrice() public returns (int256) {
        (
            ,
            int256 price,
            ,
            uint256 timeStamp,
            
        ) = priceFeed.latestRoundData();
        
        require(timeStamp > 0, "Round not complete");
        
        emit PriceRequested(msg.sender, price, block.timestamp);
        
        return price;
    }
    
    /**
     * @dev Calculate percentage of ETH price
     */
    function calculateETHPercentage(uint256 _percentage) public returns (int256) {
        require(_percentage > 0 && _percentage <= 100, "Percentage must be between 1 and 100");
        
        int256 ethPrice = getLatestETHPrice();
        int256 result = (ethPrice * int256(_percentage)) / 100;
        
        // Store as calculation result
        userResults[msg.sender].push(uint256(result > 0 ? result : -result));
        userCalculationCount[msg.sender]++;
        
        emit CalculationPerformed(
            msg.sender,
            "ETH_PERCENTAGE",
            uint256(ethPrice),
            _percentage,
            uint256(result > 0 ? result : -result),
            block.timestamp
        );
        
        return result;
    }
    
    /**
     * @dev Get user's calculation history
     */
    function getUserResults(address _user) public view returns (uint256[] memory) {
        return userResults[_user];
    }
    
    /**
     * @dev Get user's total calculation count
     */
    function getUserCalculationCount(address _user) public view returns (uint256) {
        return userCalculationCount[_user];
    }
    
    /**
     * @dev Emergency function to update price feed address (owner only)
     */
    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_newPriceFeed);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() public view returns (
        address contractOwner,
        address priceFeedAddress,
        uint256 totalUsers
    ) {
        return (owner, address(priceFeed), address(this).balance);
    }
}