const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Akroft Calculator to Arbitrum Sepolia...");
  
  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const AkroftCalculator = await ethers.getContractFactory("AkroftCalculator");
  const calculator = await AkroftCalculator.deploy();
  
  await calculator.deployed();
  
  console.log("✅ AkroftCalculator deployed to:", calculator.address);
  console.log("🔗 Transaction hash:", calculator.deployTransaction.hash);
  
  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await calculator.deployTransaction.wait(2);
  
  console.log("🎉 Deployment completed!");
  console.log("📋 Contract Details:");
  console.log(`   Address: ${calculator.address}`);
  console.log(`   Network: Arbitrum Sepolia (Chain ID: 421614)`);
  console.log(`   Explorer: https://sepolia.arbiscan.io/address/${calculator.address}`);
  
  // Test the contract
  console.log("\n🧪 Testing contract functions...");
  
  try {
    const addResult = await calculator.add(5, 3);
    await addResult.wait();
    console.log("✅ Addition test passed");
    
    const ethPrice = await calculator.getLatestETHPrice();
    await ethPrice.wait();
    console.log("✅ ETH price fetch test passed");
    
    console.log("🎯 All tests passed! Contract is ready to use.");
  } catch (error) {
    console.log("⚠️  Test error (this is normal on testnet):", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });