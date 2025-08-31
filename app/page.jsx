'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

export default function AkroftLandingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [email, setEmail] = useState('')
  const [connectionError, setConnectionError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Enhanced MetaMask connection with better error handling for multiple wallets
  const connectWallet = async () => {
    try {
      setConnectionError('')
      setIsLoading(true)
      
      // Check if window.ethereum exists
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      // Wait for providers to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      let provider = window.ethereum

      // Handle multiple wallet providers (common source of the extension error)
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        // Look for MetaMask specifically among multiple providers
        const metamaskProvider = window.ethereum.providers.find(
          p => p.isMetaMask && !p.isBraveWallet && !p.isRabby && !p.isOKExWallet
        )
        
        if (metamaskProvider) {
          provider = metamaskProvider
        } else {
          // Fallback to any provider that claims to be MetaMask
          const anyMetaMask = window.ethereum.providers.find(p => p.isMetaMask)
          if (anyMetaMask) {
            provider = anyMetaMask
          }
        }
      }

      // Double-check we have MetaMask
      if (!provider || !provider.isMetaMask) {
        throw new Error('MetaMask not found. Please ensure MetaMask is installed and enabled.')
      }

      // Request accounts with enhanced error handling
      let accounts
      try {
        accounts = await provider.request({
          method: 'eth_requestAccounts',
        })
      } catch (requestError) {
        if (requestError.code === -32002) {
          throw new Error('MetaMask is already processing a request. Please check your MetaMask extension.')
        } else if (requestError.code === 4001) {
          throw new Error('Please approve the connection request in MetaMask.')
        } else {
          // Try alternative method
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your MetaMask wallet.')
      }

      const address = accounts[0]
      setWalletAddress(address)
      setIsConnected(true)
      setShowWalletModal(false)

      // Register user in database (moved to separate function for security)
      try {
        await registerUserInDatabase(address, email || `${address.slice(0,8)}@akroft.node`)
      } catch (dbError) {
        console.warn('Database registration failed, but continuing...', dbError)
        // Don't block user flow
      }

      // Wait a moment then redirect to workspace
      setTimeout(() => {
        window.location.href = '/workspace'
      }, 1500)

    } catch (error) {
      console.error('Connection error:', error)
      
      // Enhanced error message handling
      if (error.message.includes('avalanche_selectWallet') || 
          error.message.includes('Request already pending') ||
          error.message.includes('Unexpected error')) {
        setConnectionError('Multiple wallet extensions are conflicting. Please disable other wallets (like Phantom, Rabby, etc.) and refresh the page.')
      } else if (error.code === 4001) {
        setConnectionError('Please approve the connection in MetaMask.')
      } else if (error.code === -32002) {
        setConnectionError('MetaMask is processing another request. Please wait and try again.')
      } else {
        setConnectionError(error.message || 'Failed to connect wallet. Please try refreshing the page.')
      }
      
      // Clear error after 8 seconds
      setTimeout(() => {
        setConnectionError('')
      }, 8000)
    } finally {
      setIsLoading(false)
    }
  }

  // Separate function to register user (will be moved to API route for security)
  const registerUserInDatabase = async (address, email) => {
    try {
      // This should be moved to an API route for security
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, email })
      })
      
      if (!response.ok) {
        throw new Error('Failed to register user')
      }
    } catch (error) {
      console.error('Registration error:', error)
      // Don't block the user flow if registration fails
    }
  }

  return (
    <div className="min-h-screen text-white bg-black relative overflow-hidden">
      {/* Fondo negro con efectos de profundidad */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-black to-slate-800/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(30, 64, 175, 0.05) 0%, transparent 70%)`
        }}></div>
      </div>
      
      {/* Elementos decorativos estáticos */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-px h-96 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"></div>
        <div className="absolute top-1/3 right-20 w-px h-64 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/3 w-px h-80 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent"></div>
        <div className="absolute top-1/2 right-1/3 w-px h-48 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
      </div>
      {/* Hero Section - Diseño negro elegante y futurista */}
      <section className="min-h-screen flex items-center justify-center relative z-10">
        {/* Efectos de luz ambiental */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-32 bg-gradient-to-b from-blue-500/60 to-transparent rotate-12 blur-sm"></div>
          <div className="absolute top-40 right-32 w-2 h-24 bg-gradient-to-b from-cyan-400/60 to-transparent -rotate-12 blur-sm"></div>
          <div className="absolute bottom-32 left-1/3 w-2 h-40 bg-gradient-to-b from-blue-600/50 to-transparent rotate-45 blur-sm"></div>
          <div className="absolute bottom-20 right-20 w-2 h-28 bg-gradient-to-b from-cyan-500/50 to-transparent -rotate-45 blur-sm"></div>
        </div>

        <div className="text-center max-w-6xl mx-auto px-6 relative z-20">
          {/* Logo with spectacular effects - Static */}
          <div className="mb-16">
            <div className="w-40 h-40 mx-auto relative group">
              {/* Static energy rings behind logo */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20"></div>
              <div className="absolute inset-2 rounded-full border border-blue-500/30"></div>
              
              <img 
                src="/akroft-logo.png" 
                alt="Akroft Logo" 
                className="w-full h-full object-contain relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 60px rgba(0, 245, 255, 0.4)) brightness(1.2) contrast(1.2)'
                }}
              />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white font-orbitron tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Akroft i8 Node
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-cyan-400 mb-6 font-light tracking-wide">
            Make and design Nodes for Web3 workflows
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            A small but functional development environment to implement constructive functionalities for development in decentralization with automation in nodes a view to the decentralization of information through other sets.
            <br /> This idea was born with the expectation of simplifying the creation of workflows in Web3.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#simple-nodes"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 font-orbitron"
            >
              � Explore Platform
            </a>
            
            <a
              href="#join-platform"
              className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold py-4 px-10 rounded-full transition-all duration-300 text-lg font-orbitron"
            >
              � Join Platform
            </a>
          </div>

        </div>
      </section>

      {/* SIMPLE NODES SECTION */}
      <section id="simple-nodes" className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Flow Automation
            </span>
          </h2>
          
          {/* 3 SIMPLE CONNECTED NODES */}
          <div className="flex justify-center items-center space-x-16 mb-16">
            
            {/* Node 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-gray-400 text-sm mt-2 font-mono">INPUT</span>
            </div>
            
            {/* Connection Arrow 1 */}
            <div className="flex items-center">
              <svg className="w-12 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            {/* Node 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="text-gray-400 text-sm mt-2 font-mono">LOGIC</span>
            </div>
            
            {/* Connection Arrow 2 */}
            <div className="flex items-center">
              <svg className="w-12 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            {/* Node 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-gray-400 text-sm mt-2 font-mono">OUTPUT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Diseño negro profesional */}
      <section className="py-24 px-6 bg-black border-t border-gray-800/30">
        <div className="max-w-7xl mx-auto relative">
          {/* Efectos de fondo sutiles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-1/4 w-1 h-32 bg-gradient-to-b from-cyan-400 to-transparent rotate-45"></div>
            <div className="absolute bottom-20 right-1/4 w-1 h-24 bg-gradient-to-b from-blue-500 to-transparent -rotate-45"></div>
          </div>
          
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Platform Capabilities
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Visual Node Builder
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Create complex workflows using intuitive drag-and-drop visual node interface for seamless automation
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Social Automation Constructor
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Build automated social workflows and community-driven processes with collaborative tools
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Sales Publication Integration
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Seamlessly integrate and publish sales content, services, and automated marketing workflows
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Join Platform Section - Wallet Connection */}
      <section id="join-platform" className="py-24 px-6 bg-black border-t border-gray-800/30">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-cyan-400/30 rounded-3xl p-10 shadow-2xl hover:shadow-[0_30px_80px_rgba(59,130,246,0.15)] transition-all duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-orbitron mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Join the Platform
                </span>
              </h2>
              <p className="text-gray-300">Connect your wallet to access Akroft i8 Node workspace</p>
            </div>
            
            {!isConnected ? (
              <div className="space-y-6">
                <button
                  onClick={() => setShowWalletModal(true)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] disabled:opacity-50 font-orbitron transform hover:scale-105"
                >
                  {isLoading ? 'Connecting...' : '🔌 Connect Wallet'}
                </button>
                
                <p className="text-center text-gray-400 text-sm">
                  Connect with MetaMask to start building Web3 workflows
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Wallet Connected</span>
                </div>
                <p className="text-gray-300 text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                <p className="text-sm text-cyan-400 font-mono">
                  ⚡ Ready to create automated flows
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section className="py-12 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Explore Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/workspace"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛠️</div>
              <h4 className="text-xl font-semibold text-white mb-2">Workspace</h4>
              <p className="text-gray-300 text-sm">
                Build and test your Web3 automation flows with our visual editor
              </p>
            </Link>

            <Link
              href="/collaboration"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
              <h4 className="text-xl font-semibold text-white mb-2">Collaborate</h4>
              <p className="text-gray-300 text-sm">
                Work together in real-time on blockchain automation workflows
              </p>
            </Link>

            <Link
              href="/publications"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-500 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h4 className="text-xl font-semibold text-white mb-2">Marketplace</h4>
              <p className="text-gray-300 text-sm">
                Share, sell, or find collaborators for your Web3 automation projects
              </p>
            </Link>
          </div>
        </div>
      </section>


      {/* CTA Section - Fondo negro elegante */}
      <section className="py-24 px-6 bg-black border-t border-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to Build?
              </span>
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Join the future of Web3 automation with visual flow-based development
            </p>
          </div>
          
          <a
            href="/editor"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_48px_rgba(59,130,246,0.5)] text-xl transform hover:scale-105 font-orbitron group"
          >
            <span>🚀 Enter Flow Editor</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer - Professional black background - FIXED VISIBILITY */}
      <footer className="relative w-full py-16 px-6 border-t-2 border-gray-700 bg-black min-h-[400px] z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo in footer */}
            <div className="flex items-center space-x-4">
              <img 
                src="/akroft-logo.png" 
                alt="Akroft Logo" 
                className="w-12 h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4))'
                }}
              />
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Akroft i8 Node
              </span>
            </div>
            
            {/* Information */}
            <div className="text-center space-y-3">
              <p className="text-gray-300 text-lg">
                Built for Ronaldo Developer • V0 for project Aleph Hackathon 2025 
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <span>Web3 Flow Automation</span>
                <span>•</span>
                <span>DeFi Integration</span>
                <span>•</span>
                <span>AI-Powered Nodes</span>
              </div>
            </div>
            
            {/* Developer Credit */}
            <div className="flex items-center space-x-4 bg-gray-900/60 rounded-full px-6 py-3 border border-cyan-400/30 hover:border-cyan-400/50 transition-all">
              <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <div className="text-left">
                <p className="text-cyan-400 font-semibold text-sm font-orbitron">Developed by</p>
                <a 
                  href="https://github.com/0xronaldo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-cyan-300 font-mono text-sm hover:underline transition-colors"
                >
                  @0xronaldo
                </a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="pt-6 border-t border-gray-800/50 w-full text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Akroft i8 Node. Empowering the future of decentralized automation.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WALLET SELECTION MODAL - MetaMask Only */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold font-orbitron mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Connect MetaMask
                </span>
              </h3>
              <p className="text-gray-300 text-sm">Connect your MetaMask wallet to access Akroft i8 Node</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* MetaMask Only */}
              <button
                onClick={() => connectWallet()}
                disabled={isLoading}
                className="w-full flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-cyan-400/50 rounded-xl p-4 transition-all duration-300 disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">MetaMask</p>
                  <p className="text-xs text-gray-400">{isLoading ? 'Connecting...' : 'Connect using MetaMask wallet'}</p>
                </div>
                {isLoading && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  </div>
                )}
              </button>
              
              {/* Error Display */}
              {connectionError && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 text-xs leading-relaxed">{connectionError}</p>
                </div>
              )}
              
              <div className="text-center py-2">
                <p className="text-xs text-gray-500">
                  Don't have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Install it here</a>
                </p>
                <p className="text-xs text-yellow-400 mt-2">
                  💡 If you have multiple wallets, disable others for better performance
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWalletModal(false)}
              disabled={isLoading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}