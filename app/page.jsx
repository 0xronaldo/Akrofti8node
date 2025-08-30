'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ethers } from 'ethers'
import { Database } from '@tableland/sdk'

export default function AkroftLandingPage() {
  const [walletAddress, setWalletAddress] = useState('')
  const [email, setEmail] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setIsLoading(true)
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        setWalletAddress(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        alert('Failed to connect MetaMask. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      alert('Please install MetaMask to connect your wallet')
    }
  }

  const registerUser = async () => {
    if (!walletAddress) {
      await connectWallet()
      return
    }

    try {
      setIsLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const db = new Database({ signer })
      
      const tableName = 'users_123'
      
      const { meta: insert } = await db
        .prepare(`INSERT OR REPLACE INTO ${tableName} (wallet, email) VALUES (?, ?);`)
        .bind(walletAddress, email || '')
        .run()

      await insert.txn?.wait()
      alert('Successfully registered!')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const testSwapContract = () => {
    alert('Swap executed on Arbitrum Sepolia! 🎉\n\nContract: executeSwap(WETH, USDC, 1000000000000000000)\nTx Hash: 0x1234...5678 (Mock)')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-400 relative overflow-hidden">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Logo usando el diseño real */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#00FFFF" />
                  </linearGradient>
                </defs>
                {/* Forma fluida inspirada en el logo real */}
                <path 
                  d="M20 30 Q50 10 80 30 Q70 50 50 45 Q30 50 20 30 Z" 
                  fill="url(#logoGradient)"
                  className="drop-shadow-[0_0_20px_#00FFFF]"
                />
                <path 
                  d="M25 60 Q55 40 85 60 Q75 80 55 75 Q35 80 25 60 Z" 
                  fill="url(#logoGradient)"
                  className="drop-shadow-[0_0_20px_#3B82F6]"
                />
                <circle cx="30" cy="45" r="3" fill="#00FFFF" className="animate-pulse" />
                <circle cx="70" cy="45" r="3" fill="#00FFFF" className="animate-pulse" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-orbitron">
            Akroft i8 Node
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Web3 platform for collaborative DeFi and AI flow automation
          </p>
          
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_#00FFFF] transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : isConnected ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 font-orbitron bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Core Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
              <div className="mb-6">
                <img 
                  src="/icons/nodes.svg" 
                  alt="Visual Flow Builder"
                  className="w-12 h-12 filter brightness-0 invert opacity-80 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                Visual Flow Builder
              </h3>
              <p className="text-gray-300 text-sm">
                Create DeFi workflows with drag-and-drop nodes
              </p>
            </div>

            <div className="bg-black border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
              <div className="mb-6">
                <img 
                  src="/icons/ai.svg" 
                  alt="AI Automation"
                  className="w-12 h-12 filter brightness-0 invert opacity-80 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                AI Integration
              </h3>
              <p className="text-gray-300 text-sm">
                Automate decisions with AI-powered smart nodes
              </p>
            </div>

            <div className="bg-black border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
              <div className="mb-6">
                <img 
                  src="/icons/blockchain.svg" 
                  alt="Multi-Chain"
                  className="w-12 h-12 filter brightness-0 invert opacity-80 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                Multi-Chain Support
              </h3>
              <p className="text-gray-300 text-sm">
                Deploy across Arbitrum, Ethereum, and more
              </p>
            </div>

            <div className="bg-black border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
              <div className="mb-6">
                <img 
                  src="/icons/wallet.svg" 
                  alt="DeFi Integration"
                  className="w-12 h-12 filter brightness-0 invert opacity-80 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
                DeFi Integration
              </h3>
              <p className="text-gray-300 text-sm">
                Connect to protocols and manage assets seamlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medusa Visualization */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Flow Visualization
          </h2>
        </div>
        
        <div className="relative h-64 max-w-4xl mx-auto">
          {/* Medusa 1 */}
          <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="medusa">
              <div className="medusa-core"></div>
              <div className="medusa-tentacle tentacle-1"></div>
              <div className="medusa-tentacle tentacle-2"></div>
              <div className="medusa-tentacle tentacle-3"></div>
            </div>
          </div>
          
          {/* Medusa 2 */}
          <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className="medusa" style={{animationDelay: '-2s'}}>
              <div className="medusa-core" style={{animationDelay: '-1s'}}></div>
              <div className="medusa-tentacle tentacle-1" style={{animationDelay: '-1.5s'}}></div>
              <div className="medusa-tentacle tentacle-2" style={{animationDelay: '-2s'}}></div>
              <div className="medusa-tentacle tentacle-3" style={{animationDelay: '-2.5s'}}></div>
            </div>
          </div>
          
          {/* Medusa 3 */}
          <div className="absolute right-1/4 top-2/3 transform translate-x-1/2 -translate-y-1/2">
            <div className="medusa" style={{animationDelay: '-4s'}}>
              <div className="medusa-core" style={{animationDelay: '-2s'}}></div>
              <div className="medusa-tentacle tentacle-1" style={{animationDelay: '-3s'}}></div>
              <div className="medusa-tentacle tentacle-2" style={{animationDelay: '-4s'}}></div>
              <div className="medusa-tentacle tentacle-3" style={{animationDelay: '-5s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 font-orbitron bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Join the Network
          </h2>
          
          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            />
            
            <button
              onClick={registerUser}
              disabled={isLoading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_#00FFFF] disabled:opacity-50 font-orbitron"
            >
              {isLoading ? 'Registering...' : 'Register with Wallet'}
            </button>
          </div>
        </div>
      </section>

      {/* Smart Contract Demo */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 font-orbitron bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DeFi Automation Demo
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Test Solidity smart contract interaction on Arbitrum Sepolia
          </p>
          
          <button
            onClick={testSwapContract}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-300 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_#3B82F6] transform hover:scale-105 font-orbitron"
          >
            Test Swap Contract
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black">
        <div className="text-center">
          <a
            href="/editor"
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-300 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_#3B82F6] text-xl transform hover:scale-105 font-orbitron"
          >
            Enter Flow Editor
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Built for Aleph Hackathon V0 by Vercel
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Akroft i8 Node - Web3 Flow Automation Platform
          </p>
        </div>
      </footer>
    </div>
  )
}