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
      
      {/* Elementos decorativos dinámicos */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-px h-96 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-pulse" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-20 w-px h-64 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-px h-80 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-px h-48 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent animate-pulse" style={{animationDelay: '3s'}}></div>
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
          {/* Logo con efectos espectaculares */}
          <div className="mb-16">
            <div className="w-40 h-40 mx-auto relative group">
              {/* Anillo de energía detrás del logo */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-spin" style={{animationDuration: '8s'}}></div>
              <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
              
              <img 
                src="/akroft-logo.png" 
                alt="Akroft Logo" 
                className="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 60px rgba(0, 245, 255, 0.4)) brightness(1.2) contrast(1.2)',
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white font-orbitron tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent animate-pulse">
              Akroft i8 Node
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-cyan-400 mb-6 font-light tracking-wide">
            Web3 Flow Automation Platform
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            🚀 Construye, colabora y despliega flujos blockchain sin programar.
            <br />✨ Automatiza DeFi e IA con nodos visuales inteligentes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#demo-nodos"
              className="group bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-700 hover:via-cyan-400 hover:to-blue-700 text-white font-bold py-5 px-12 rounded-full transition-all duration-500 text-xl shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transform hover:scale-110 border border-cyan-400/20 font-orbitron"
              style={{backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease-in-out infinite'}}
            >
              <span className="flex items-center space-x-3">
                <span>🔮 Explorar Plataforma</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-black/50 hover:bg-black/70 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 hover:text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 text-lg backdrop-blur-sm hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? 'Conectando...' : isConnected ? `✅ ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '🔗 Conectar Wallet'}
            </button>
          </div>
          
          {isConnected && (
            <p className="text-sm text-cyan-400 font-mono mt-4 animate-pulse">
              ⚡ Listo para crear flujos automáticos
            </p>
          )}
        </div>
      </section>

      {/* SECCIÓN DEMO DINÁMICO DE NODOS - LA JOYA DE LA PÁGINA */}
      <section id="demo-nodos" className="py-32 px-6 relative bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold font-orbitron mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                ¿Cómo Funcionan los Nodos?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              🧠 Observa en tiempo real cómo los datos fluyen a través de nodos inteligentes
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-8 rounded-full"></div>
          </div>
          
          {/* DEMO INTERACTIVO DINÁMICO */}
          <div className="bg-gradient-to-br from-gray-900/50 via-black to-gray-800/30 rounded-3xl border border-cyan-400/20 p-12 backdrop-blur-sm shadow-2xl">
            
            {/* Panel de Control */}
            <div className="mb-12 text-center">
              <button 
                onClick={() => {
                  // Reinicia la animación del demo
                  const elements = document.querySelectorAll('.demo-animation');
                  elements.forEach(el => {
                    el.style.animation = 'none';
                    setTimeout(() => el.style.animation = '', 10);
                  });
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:scale-105 font-orbitron"
              >
                ▶️ Ejecutar Demo
              </button>
            </div>
            
            {/* FLUJO DE NODOS DINÁMICO */}
            <div className="relative h-96 bg-black/30 rounded-2xl border border-gray-700/50 overflow-hidden">
              
              {/* Líneas de conexión animadas */}
              <svg className="absolute inset-0 w-full h-full z-10" style={{animation: 'fadeIn 1s ease-out'}}>
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Conexiones principales */}
                <path d="M120 200 Q250 150 400 200" stroke="url(#flowGradient)" strokeWidth="3" fill="none" filter="url(#glow)" className="demo-animation" style={{strokeDasharray: '10 5', animation: 'dash-flow 2s linear infinite'}} />
                <path d="M400 200 Q550 150 700 200" stroke="url(#flowGradient)" strokeWidth="3" fill="none" filter="url(#glow)" className="demo-animation" style={{strokeDasharray: '10 5', animation: 'dash-flow 2s linear infinite', animationDelay: '0.5s'}} />
                <path d="M700 200 Q850 150 980 200" stroke="url(#flowGradient)" strokeWidth="3" fill="none" filter="url(#glow)" className="demo-animation" style={{strokeDasharray: '10 5', animation: 'dash-flow 2s linear infinite', animationDelay: '1s'}} />
                
                {/* Datos fluyendo */}
                <circle r="4" fill="#06B6D4" className="demo-animation" style={{animation: 'data-flow-1 3s ease-in-out infinite'}}>
                  <animateMotion dur="3s" repeatCount="indefinite" path="M120 200 Q250 150 400 200 Q550 150 700 200 Q850 150 980 200" />
                </circle>
                <circle r="3" fill="#3B82F6" className="demo-animation" style={{animation: 'data-flow-2 3s ease-in-out infinite', animationDelay: '1s'}}>
                  <animateMotion dur="3s" repeatCount="indefinite" path="M120 200 Q250 150 400 200 Q550 150 700 200 Q850 150 980 200" />
                </circle>
              </svg>
              
              {/* NODOS INTERACTIVOS */}
              {/* Nodo 1: Input */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-20">
                <div className="group relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl border-2 border-green-400 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 cursor-pointer demo-animation" style={{animation: 'node-pulse 2s ease-in-out infinite'}}>
                    <div className="flex items-center justify-center h-full text-white text-2xl">
                      📊
                    </div>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-green-400 font-semibold text-sm">INPUT</p>
                    <p className="text-gray-400 text-xs">Datos DeFi</p>
                  </div>
                  {/* Tooltip al hover */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-400/30">
                    🔍 Recibe datos del mercado
                  </div>
                </div>
              </div>
              
              {/* Nodo 2: Processing */}
              <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="group relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl border-2 border-blue-400 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer demo-animation" style={{animation: 'node-pulse 2s ease-in-out infinite', animationDelay: '0.5s'}}>
                    <div className="flex items-center justify-center h-full text-white text-2xl">
                      🧠
                    </div>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-blue-400 font-semibold text-sm">IA PROCESSOR</p>
                    <p className="text-gray-400 text-xs">Análisis Smart</p>
                  </div>
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-blue-400/30">
                    ⚡ Procesa con IA
                  </div>
                </div>
              </div>
              
              {/* Nodo 3: Decision */}
              <div className="absolute right-1/3 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-20">
                <div className="group relative">
                  <div className="w-22 h-22 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl border-2 border-purple-400 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer demo-animation" style={{animation: 'node-pulse 2s ease-in-out infinite', animationDelay: '1s'}}>
                    <div className="flex items-center justify-center h-full text-white text-xl">
                      ⚖️
                    </div>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-purple-400 font-semibold text-sm">DECISION</p>
                    <p className="text-gray-400 text-xs">Lógica Smart</p>
                  </div>
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-purple-400/30">
                    🎯 Decide estrategia
                  </div>
                </div>
              </div>
              
              {/* Nodo 4: Output */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 z-20">
                <div className="group relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl border-2 border-orange-400 shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 cursor-pointer demo-animation" style={{animation: 'node-pulse 2s ease-in-out infinite', animationDelay: '1.5s'}}>
                    <div className="flex items-center justify-center h-full text-white text-2xl">
                      🚀
                    </div>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-orange-400 font-semibold text-sm">OUTPUT</p>
                    <p className="text-gray-400 text-xs">Ejecución</p>
                  </div>
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-orange-400/30">
                    💫 Ejecuta operación
                  </div>
                </div>
              </div>
              
              {/* Indicadores de estado */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full border border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-mono">ACTIVO</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full border border-cyan-400/30">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-cyan-400 text-xs font-mono">PROCESANDO</span>
                </div>
              </div>
            </div>
            
            {/* Explicación del flujo */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center bg-green-500/10 p-6 rounded-xl border border-green-400/20">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-green-400 font-bold mb-2 font-orbitron">1. CAPTURA</h4>
                <p className="text-gray-300 text-sm">Los nodos input recolectan datos en tiempo real desde múltiples fuentes DeFi</p>
              </div>
              <div className="text-center bg-blue-500/10 p-6 rounded-xl border border-blue-400/20">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="text-blue-400 font-bold mb-2 font-orbitron">2. PROCESA</h4>
                <p className="text-gray-300 text-sm">IA analiza patrones complejos y calcula estrategias óptimas automáticamente</p>
              </div>
              <div className="text-center bg-purple-500/10 p-6 rounded-xl border border-purple-400/20">
                <div className="text-3xl mb-3">⚖️</div>
                <h4 className="text-purple-400 font-bold mb-2 font-orbitron">3. DECIDE</h4>
                <p className="text-gray-300 text-sm">Lógica inteligente evalúa riesgos y selecciona la mejor acción a ejecutar</p>
              </div>
              <div className="text-center bg-orange-500/10 p-6 rounded-xl border border-orange-400/20">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="text-orange-400 font-bold mb-2 font-orbitron">4. EJECUTA</h4>
                <p className="text-gray-300 text-sm">Smart contracts ejecutan operaciones DeFi de forma segura y automática</p>
              </div>
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
                Capacidades de la Plataforma
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <img 
                      src="/icons/nodes.svg" 
                      alt="Visual Flows"
                      className="w-8 h-8 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Constructor Visual de Flujos
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Crea flujos DeFi complejos usando una interfaz intuitiva de arrastrar y soltar
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <img 
                      src="/icons/ai.svg" 
                      alt="AI Automation"
                      className="w-8 h-8 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Automatización con IA
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Genera smart contracts y automatiza decisiones con nodos potenciados por IA
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <img 
                      src="/icons/blockchain.svg" 
                      alt="Multi-Chain"
                      className="w-8 h-8 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Soporte Multi-Chain
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Despliega en redes Arbitrum, Ethereum, Stellar y Starknet
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:bg-gray-900/60 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-400/20">
                    <img 
                      src="/icons/wallet.svg" 
                      alt="DeFi Integration"
                      className="w-8 h-8 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-orbitron">
                  Integración DeFi
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Conéctate sin problemas a protocolos y gestiona activos digitales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Visualization Section - Fondo negro elegante */}
      <section className="py-24 relative overflow-hidden bg-black border-t border-gray-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Visualización de Flujo de Nodos
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Observa cómo los datos fluyen a través de nodos interconectados en tiempo real
            </p>
          </div>
          
          <div className="relative h-80 max-w-5xl mx-auto">
            {/* Líneas de conexión entre nodos */}
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: 1}}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d="M200 160 Q400 100 600 160" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" opacity="0.7" />
              <path d="M200 160 Q400 220 600 160" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" opacity="0.7" />
            </svg>
            
            {/* Nodos principales con posicionamiento profesional */}
            <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{zIndex: 2}}>
              <div className="medusa">
                <div className="medusa-core"></div>
                <div className="medusa-tentacle tentacle-1"></div>
                <div className="medusa-tentacle tentacle-2"></div>
                <div className="medusa-tentacle tentacle-3"></div>
              </div>
            </div>
            
            <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2" style={{zIndex: 2}}>
              <div className="medusa" style={{animationDelay: '-2s'}}>
                <div className="medusa-core" style={{animationDelay: '-1s'}}></div>
                <div className="medusa-tentacle tentacle-1" style={{animationDelay: '-1.5s'}}></div>
                <div className="medusa-tentacle tentacle-2" style={{animationDelay: '-2s'}}></div>
                <div className="medusa-tentacle tentacle-3" style={{animationDelay: '-2.5s'}}></div>
              </div>
            </div>
            
            <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2" style={{zIndex: 2}}>
              <div className="medusa" style={{animationDelay: '-4s'}}>
                <div className="medusa-core" style={{animationDelay: '-2s'}}></div>
                <div className="medusa-tentacle tentacle-1" style={{animationDelay: '-3s'}}></div>
                <div className="medusa-tentacle tentacle-2" style={{animationDelay: '-4s'}}></div>
                <div className="medusa-tentacle tentacle-3" style={{animationDelay: '-5s'}}></div>
              </div>
            </div>
            
            {/* Efectos de partículas sutiles */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-24 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-32 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section - Fondo negro elegante */}
      <section className="py-24 px-6 bg-black border-t border-gray-800/30">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-cyan-400/30 rounded-3xl p-10 shadow-2xl hover:shadow-[0_30px_80px_rgba(59,130,246,0.15)] transition-all duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-orbitron mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Únete a la Plataforma
                </span>
              </h2>
              <p className="text-gray-300">Obtén acceso temprano a Akroft i8 Node</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Correo electrónico (opcional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-black/70 border border-cyan-400/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-black/90 transition-all duration-300"
                />
              </div>
              
              <button
                onClick={registerUser}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] disabled:opacity-50 font-orbitron transform hover:scale-105"
              >
                {isLoading ? 'Registrando...' : '🚀 Registrar con Wallet'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contract Demo - Fondo negro profesional */}
      <section className="py-24 px-6 relative overflow-hidden bg-black border-t border-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Demo de Smart Contract
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Experimenta la automatización DeFi con nuestro demo de smart contract en Arbitrum Sepolia
            </p>
          </div>
          
          <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto hover:shadow-[0_30px_80px_rgba(59,130,246,0.1)] transition-all duration-500">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-mono text-sm">Arbitrum Sepolia Network</span>
            </div>
            
            <div className="text-left bg-black/60 rounded-xl p-6 mb-6 border border-gray-700/30">
              <code className="text-cyan-400 text-sm block">
                <span className="text-gray-400">// Smart Contract Function</span><br/>
                <span className="text-blue-400">function</span> <span className="text-cyan-300">executeSwap</span>(<br/>
                &nbsp;&nbsp;<span className="text-purple-400">address</span> tokenIn,<br/>
                &nbsp;&nbsp;<span className="text-purple-400">address</span> tokenOut,<br/>
                &nbsp;&nbsp;<span className="text-purple-400">uint256</span> amountIn<br/>
                ) <span className="text-blue-400">external</span>
              </code>
            </div>
            
            <button
              onClick={testSwapContract}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] transform hover:scale-105 font-orbitron text-lg"
            >
              ⚡ Ejecutar Demo Swap
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section - Fondo negro elegante */}
      <section className="py-24 px-6 bg-black border-t border-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ¿Listo para Construir?
              </span>
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Únete al futuro de la automatización Web3 con desarrollo basado en flujos visuales
            </p>
          </div>
          
          <a
            href="/editor"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_48px_rgba(59,130,246,0.5)] text-xl transform hover:scale-105 font-orbitron group"
          >
            <span>🚀 Ingresar al Editor de Flujos</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer - Fondo negro profesional */}
      <footer className="py-16 px-6 border-t border-gray-800/50 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo en el footer */}
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
            
            {/* Información */}
            <div className="text-center space-y-3">
              <p className="text-gray-300 text-lg">
                Construido para Aleph Hackathon • V0 by Vercel Track
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <span>Automatización de Flujos Web3</span>
                <span>•</span>
                <span>Integración DeFi</span>
                <span>•</span>
                <span>Nodos Potenciados por IA</span>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="pt-6 border-t border-gray-800/30 w-full text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Akroft i8 Node. Potenciando el futuro de la automatización descentralizada.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}