import { ethers } from 'ethers';

// ABI for the AkroftCalculator contract
const CALCULATOR_ABI = [
  "function add(uint256 _a, uint256 _b) public returns (uint256)",
  "function subtract(uint256 _a, uint256 _b) public returns (uint256)",
  "function multiply(uint256 _a, uint256 _b) public returns (uint256)",
  "function divide(uint256 _a, uint256 _b) public returns (uint256)",
  "function getLatestETHPrice() public returns (int256)",
  "function calculateETHPercentage(uint256 _percentage) public returns (int256)",
  "function getUserCalculationCount(address _user) public view returns (uint256)",
  "function getUserResults(address _user) public view returns (uint256[])",
  "event CalculationPerformed(address indexed user, string operation, uint256 operandA, uint256 operandB, uint256 result, uint256 timestamp)"
];

// Contract addresses (will be updated after deployment)
const CONTRACT_ADDRESSES = {
  arbitrumSepolia: "0x0000000000000000000000000000000000000000", // Update after deployment
  arbitrumOne: "0x0000000000000000000000000000000000000000"      // Update after deployment
};

// Network configurations
const NETWORK_CONFIGS = {
  arbitrumSepolia: {
    name: "Arbitrum Sepolia",
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io"
  },
  arbitrumOne: {
    name: "Arbitrum One",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io"
  }
};

export async function POST(request) {
  try {
    const { operation, operandA, operandB, network, walletAddress } = await request.json();

    if (!operation || !network || !walletAddress) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields: operation, network, walletAddress' 
      }, { status: 400 });
    }

    const contractAddress = CONTRACT_ADDRESSES[network];
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      return Response.json({ 
        success: false, 
        error: 'Contract not deployed on selected network yet. Please check back later.' 
      }, { status: 400 });
    }

    const networkConfig = NETWORK_CONFIGS[network];
    
    // For demonstration purposes, we'll return mock results
    // In production, this would interact with the actual deployed contract
    const mockResults = {
      add: parseInt(operandA || 0) + parseInt(operandB || 0),
      subtract: Math.max(0, parseInt(operandA || 0) - parseInt(operandB || 0)),
      multiply: parseInt(operandA || 0) * parseInt(operandB || 0),
      divide: operandB && operandB !== '0' ? Math.floor(parseInt(operandA || 0) / parseInt(operandB)) : 0,
      getETHPrice: Math.floor(Math.random() * 1000 + 2000) * 100000000, // Mock price in wei
      calculateETHPercentage: Math.floor((Math.random() * 1000 + 2000) * parseInt(operandA || 10) / 100) * 100000000
    };

    let result;
    let transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`; // Mock transaction hash

    switch (operation) {
      case 'add':
        result = mockResults.add;
        break;
      case 'subtract':
        result = mockResults.subtract;
        break;
      case 'multiply':
        result = mockResults.multiply;
        break;
      case 'divide':
        if (!operandB || operandB === '0') {
          return Response.json({ 
            success: false, 
            error: 'Cannot divide by zero' 
          }, { status: 400 });
        }
        result = mockResults.divide;
        break;
      case 'getETHPrice':
        result = mockResults.getETHPrice;
        break;
      case 'calculateETHPercentage':
        if (!operandA || parseInt(operandA) < 1 || parseInt(operandA) > 100) {
          return Response.json({ 
            success: false, 
            error: 'Percentage must be between 1 and 100' 
          }, { status: 400 });
        }
        result = mockResults.calculateETHPercentage;
        break;
      default:
        return Response.json({ 
          success: false, 
          error: 'Invalid operation. Supported: add, subtract, multiply, divide, getETHPrice, calculateETHPercentage' 
        }, { status: 400 });
    }

    return Response.json({
      success: true,
      result,
      operation,
      operandA: operandA || null,
      operandB: operandB || null,
      transactionHash,
      network: networkConfig.name,
      explorerUrl: `${networkConfig.explorer}/tx/${transactionHash}`,
      contractAddress,
      timestamp: new Date().toISOString(),
      note: "This is a demo using mock data. Deploy the contract to interact with real blockchain."
    });

  } catch (error) {
    console.error('Smart contract interaction error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    const walletAddress = searchParams.get('walletAddress');

    if (!network || !walletAddress) {
      return Response.json({ 
        success: false, 
        error: 'Missing required parameters: network, walletAddress' 
      }, { status: 400 });
    }

    const contractAddress = CONTRACT_ADDRESSES[network];
    const networkConfig = NETWORK_CONFIGS[network];

    // Mock user stats for demonstration
    const mockStats = {
      calculationCount: Math.floor(Math.random() * 50),
      lastResults: [
        Math.floor(Math.random() * 1000),
        Math.floor(Math.random() * 1000),
        Math.floor(Math.random() * 1000)
      ],
      contractAddress,
      network: networkConfig?.name || 'Unknown Network',
      isDeployed: contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000"
    };

    return Response.json({
      success: true,
      stats: mockStats,
      availableOperations: [
        'add', 'subtract', 'multiply', 'divide', 
        'getETHPrice', 'calculateETHPercentage'
      ]
    });

  } catch (error) {
    console.error('Error fetching contract stats:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}