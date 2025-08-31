'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// Enhanced Node Components with Unique Styling
const NodeComponent = ({ node, isSelected, onSelect, onNodePropertiesOpen, position, onPositionChange, isDragging }) => {
  const nodeRef = useRef(null)
  const [localPosition, setLocalPosition] = useState(position)
  
  const getNodeStyle = () => {
    const baseStyle = {
      transform: `translate(${localPosition.x}px, ${localPosition.y}px)`,
      transition: isDragging ? 'none' : 'all 0.2s ease'
    }
    
    switch (node.category) {
      case 'data_input':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${node.color}, ${adjustColor(node.color, -20)})`,
          borderLeft: `4px solid ${adjustColor(node.color, 40)}`,
          boxShadow: `0 8px 32px ${node.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`
        }
      case 'logic':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${node.color}, ${adjustColor(node.color, -20)})`,
          borderRadius: '12px',
          border: `2px solid ${adjustColor(node.color, 30)}`,
          boxShadow: `0 12px 40px ${node.color}25, 0 0 0 1px ${node.color}30`
        }
      case 'defi':
        return {
          ...baseStyle,
          background: `radial-gradient(ellipse at top, ${node.color}, ${adjustColor(node.color, -30)})`,
          borderRadius: '16px 4px 16px 4px',
          border: `1px solid ${adjustColor(node.color, 20)}`,
          boxShadow: `0 16px 48px ${node.color}30, inset 0 1px 0 rgba(255,255,255,0.15)`
        }
      case 'smart_contract':
        return {
          ...baseStyle,
          background: `conic-gradient(from 180deg, ${node.color}, ${adjustColor(node.color, -40)}, ${node.color})`,
          borderRadius: '8px',
          border: `2px dashed ${adjustColor(node.color, 40)}`,
          boxShadow: `0 20px 60px ${node.color}35, 0 0 20px ${node.color}20`
        }
      case 'output':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${node.color}, ${adjustColor(node.color, -25)})`,
          borderRadius: '50px 10px 50px 10px',
          border: `3px solid ${adjustColor(node.color, 30)}`,
          boxShadow: `0 10px 35px ${node.color}25`
        }
      default:
        return baseStyle
    }
  }

  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  const getNodeIcon = () => {
    const iconMap = {
      // Data Input Icons
      'API': '�', 'WEBHOOK': '🎣', 'DATABASE': '🗄️', 'FILE_INPUT': '📁',
      'COINGECKO': '🦎', 'CHAINLINK': '🔗',
      // Logic Icons  
      'CONDITION': '🔀', 'LOOP': '🔄', 'SWITCH': '🎛️', 'FILTER': '🔍',
      'CALCULATOR': '🧮', 'JSON_PARSER': '📋',
      // DeFi Icons
      'UNISWAP': '🦄', 'AAVE': '👻', 'COMPOUND': '🏛️', 'SUSHISWAP': '🍣',
      'ARBITRUM_BRIDGE': '🌉', 'CHAINLINK_PRICE': '💰',
      // Smart Contract Icons
      'DEPLOY_CONTRACT': '🚀', 'CONTRACT_CALL': '📞', 'EVENT_LISTENER': '👂',
      'WALLET_CONNECT': '👛',
      // Output Icons
      'WEBHOOK_SEND': '📤', 'EMAIL': '📧', 'DATABASE_WRITE': '💾',
      'FILE_EXPORT': '📤', 'NOTIFICATION': '🔔'
    }
    return iconMap[node.type] || '⚡'
  }

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-pointer select-none group ${isSelected ? 'z-20' : 'z-10'}`}
      style={getNodeStyle()}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(node.id)
      }}
      onDoubleClick={() => onNodePropertiesOpen(node)}
    >
      {/* Node Content */}
      <div className="relative p-4 min-w-[180px] min-h-[80px] flex flex-col justify-center items-center text-white">
        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${node.isActive ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`}></div>
        </div>
        
        {/* Main Icon */}
        <div className="text-2xl mb-2 filter drop-shadow-lg">
          {getNodeIcon()}
        </div>
        
        {/* Node Name */}
        <div className="text-sm font-semibold text-center leading-tight font-orbitron">
          {node.name}
        </div>
        
        {/* Node Type Badge */}
        <div className="absolute bottom-1 left-2 text-xs opacity-70 font-mono">
          {node.category.replace('_', ' ').toUpperCase()}
        </div>

        {/* Connection Points */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white shadow-lg -translate-x-1/2"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow-lg translate-x-1/2"></div>

        {/* Selection Border */}
        {isSelected && (
          <div className="absolute inset-0 border-3 border-cyan-400 rounded-lg pointer-events-none animate-pulse"></div>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-1">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onNodePropertiesOpen(node)
          }}
          className="bg-gray-800 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
        >
          ⚙️ Props
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            // Clone node functionality
          }}
          className="bg-gray-800 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
        >
          📋 Copy
        </button>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="bg-black border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-orbitron font-semibold">Back to Home</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="text-2xl font-bold font-orbitron">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Akroft i8 Node Workspace
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={clearCanvas}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={executeWorkflow}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
            >
              🚀 Execute Workflow
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Node Library */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 font-orbitron text-cyan-400">Node Library</h2>
          
          {/* Input Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-400 mb-2 uppercase tracking-wide">Data Inputs</h3>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.category === 'inputs').map(nodeType => (
                <div
                  key={nodeType.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType)}
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div className={`w-10 h-10 ${nodeType.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {nodeType.icon}
                  </div>
                  <div>
                    <p className="font-medium">{nodeType.name}</p>
                    <p className="text-xs text-gray-400">Drag to canvas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logic Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wide">Logic</h3>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.category === 'logic').map(nodeType => (
                <div
                  key={nodeType.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType)}
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div className={`w-10 h-10 ${nodeType.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {nodeType.icon}
                  </div>
                  <div>
                    <p className="font-medium">{nodeType.name}</p>
                    <p className="text-xs text-gray-400">Drag to canvas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DeFi Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wide">DeFi Protocols</h3>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.category === 'defi').map(nodeType => (
                <div
                  key={nodeType.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType)}
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div className={`w-10 h-10 ${nodeType.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {nodeType.icon}
                  </div>
                  <div>
                    <p className="font-medium">{nodeType.name}</p>
                    <p className="text-xs text-gray-400">Drag to canvas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-orange-400 mb-2 uppercase tracking-wide">Outputs</h3>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.category === 'output').map(nodeType => (
                <div
                  key={nodeType.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType)}
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div className={`w-10 h-10 ${nodeType.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {nodeType.icon}
                  </div>
                  <div>
                    <p className="font-medium">{nodeType.name}</p>
                    <p className="text-xs text-gray-400">Drag to canvas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full relative overflow-hidden bg-gray-900"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              backgroundImage: `radial-gradient(circle, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          >
            {/* Canvas Instructions */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Build Your Web3 Workflow</h3>
                  <p className="text-sm">Drag nodes from the sidebar to start building your automation</p>
                </div>
              </div>
            )}

            {/* Render Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-move select-none ${
                  selectedNode === node.id ? 'border-cyan-400' : 'border-gray-300'
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="flex items-center space-x-3 p-4">
                  <div className={`w-12 h-12 ${node.color} rounded-lg flex items-center justify-center text-white text-xl shadow-lg`}>
                    {node.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{node.name}</p>
                    <p className="text-xs text-gray-500">Node ID: {node.id.slice(-4)}</p>
                  </div>
                </div>
                
                {/* Connection Points */}
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Network Switch Component
const NetworkSwitch = ({ currentNetwork, onNetworkChange, isConnected }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400/30">
      <span className="text-sm text-gray-300 font-orbitron">Network:</span>
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onNetworkChange('testnet')}
          className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
            currentNetwork === 'testnet' 
              ? 'bg-yellow-500 text-black' 
              : 'text-yellow-400 hover:bg-yellow-500/20'
          }`}
        >
          🧪 Testnet
        </button>
        <button
          onClick={() => onNetworkChange('mainnet')}
          className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
            currentNetwork === 'mainnet' 
              ? 'bg-green-500 text-black' 
              : 'text-green-400 hover:bg-green-500/20'
          }`}
        >
          🌐 Mainnet
        </button>
      </div>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
      <span className="text-xs text-gray-400">
        {currentNetwork === 'testnet' ? 'Arbitrum Sepolia' : 'Arbitrum One'}
      </span>
    </div>
  )
}

// Enhanced Node Library with Categories
const NodeLibrary = ({ onNodeAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState('data_input')
  
  const nodeCategories = {
    data_input: {
      name: 'Data Inputs',
      icon: '📥',
      nodes: [
        { id: 'api', type: 'API', name: 'API Request', color: '#10B981', category: 'data_input' },
        { id: 'coingecko', type: 'COINGECKO', name: 'CoinGecko API', color: '#059669', category: 'data_input' },
        { id: 'chainlink', type: 'CHAINLINK', name: 'Chainlink Oracle', color: '#3B82F6', category: 'data_input' },
        { id: 'webhook', type: 'WEBHOOK', name: 'Webhook Trigger', color: '#047857', category: 'data_input' },
        { id: 'database', type: 'DATABASE', name: 'Database Query', color: '#065F46', category: 'data_input' }
      ]
    },
    logic: {
      name: 'Logic & Math',
      icon: '🧠',
      nodes: [
        { id: 'condition', type: 'CONDITION', name: 'If/Else Logic', color: '#8B5CF6', category: 'logic' },
        { id: 'calculator', type: 'CALCULATOR', name: 'Math Calculator', color: '#7C2D12', category: 'logic' },
        { id: 'loop', type: 'LOOP', name: 'Loop Iterator', color: '#7C3AED', category: 'logic' },
        { id: 'filter', type: 'FILTER', name: 'Data Filter', color: '#5B21B6', category: 'logic' },
        { id: 'json_parser', type: 'JSON_PARSER', name: 'JSON Parser', color: '#9333EA', category: 'logic' }
      ]
    },
    defi: {
      name: 'DeFi Protocols',
      icon: '🏦',
      nodes: [
        { id: 'uniswap', type: 'UNISWAP', name: 'Uniswap V3', color: '#EC4899', category: 'defi' },
        { id: 'chainlink_price', type: 'CHAINLINK_PRICE', name: 'Price Feed', color: '#3B82F6', category: 'defi' },
        { id: 'arbitrum_bridge', type: 'ARBITRUM_BRIDGE', name: 'Arbitrum Bridge', color: '#1E40AF', category: 'defi' },
        { id: 'aave', type: 'AAVE', name: 'Aave Protocol', color: '#8B5CF6', category: 'defi' },
        { id: 'sushiswap', type: 'SUSHISWAP', name: 'SushiSwap', color: '#F59E0B', category: 'defi' }
      ]
    },
    smart_contract: {
      name: 'Smart Contracts',
      icon: '📜',
      nodes: [
        { id: 'deploy_contract', type: 'DEPLOY_CONTRACT', name: 'Deploy Contract', color: '#DC2626', category: 'smart_contract' },
        { id: 'contract_call', type: 'CONTRACT_CALL', name: 'Contract Call', color: '#B91C1C', category: 'smart_contract' },
        { id: 'event_listener', type: 'EVENT_LISTENER', name: 'Event Listener', color: '#991B1B', category: 'smart_contract' },
        { id: 'wallet_connect', type: 'WALLET_CONNECT', name: 'Wallet Connect', color: '#7F1D1D', category: 'smart_contract' }
      ]
    },
    output: {
      name: 'Outputs',
      icon: '📤',
      nodes: [
        { id: 'webhook_send', type: 'WEBHOOK_SEND', name: 'Send Webhook', color: '#F59E0B', category: 'output' },
        { id: 'notification', type: 'NOTIFICATION', name: 'Push Notification', color: '#78350F', category: 'output' },
        { id: 'database_write', type: 'DATABASE_WRITE', name: 'Database Write', color: '#B45309', category: 'output' },
        { id: 'file_export', type: 'FILE_EXPORT', name: 'Export File', color: '#92400E', category: 'output' }
      ]
    }
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg w-80 h-full border-r border-gray-700 flex flex-col">
      {/* Library Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white font-orbitron">Node Library</h2>
        <p className="text-sm text-gray-400">Drag nodes to canvas</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap p-2 border-b border-gray-700 bg-gray-800/50">
        {Object.entries(nodeCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`flex-1 min-w-0 px-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedCategory === key 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm">{category.icon}</span>
              <span className="truncate">{category.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {nodeCategories[selectedCategory].nodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify(node))
            }}
            onClick={() => onNodeAdd(node)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              borderLeftColor: node.color,
              borderLeftWidth: '4px'
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: node.color }}
              >
                {node.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{node.name}</h3>
                <p className="text-gray-400 text-xs">{node.category.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Node Properties Panel Component
const NodePropertiesPanel = ({ node, onClose, onSave }) => {
  const [properties, setProperties] = useState(node?.properties || {})

  const handlePropertyChange = (key, value) => {
    setProperties(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(node.id, properties)
    onClose()
  }

  if (!node) return null

  const getNodePropertyTemplate = (nodeType) => {
    const templates = {
      'API': [
        { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com' },
        { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
        { key: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Content-Type": "application/json"}' }
      ],
      'COINGECKO': [
        { key: 'coin_id', label: 'Coin ID', type: 'text', placeholder: 'ethereum' },
        { key: 'vs_currency', label: 'Currency', type: 'text', placeholder: 'usd' },
        { key: 'include_market_cap', label: 'Include Market Cap', type: 'checkbox' }
      ],
      'CALCULATOR': [
        { key: 'operation', label: 'Operation', type: 'select', options: ['add', 'subtract', 'multiply', 'divide'] },
        { key: 'precision', label: 'Decimal Places', type: 'number', min: 0, max: 18 }
      ],
      'CONTRACT_CALL': [
        { key: 'contract_address', label: 'Contract Address', type: 'text', placeholder: '0x...' },
        { key: 'function_name', label: 'Function Name', type: 'text', placeholder: 'transfer' },
        { key: 'gas_limit', label: 'Gas Limit', type: 'number', placeholder: '100000' }
      ]
    }
    return templates[nodeType] || []
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-400/30 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-orbitron text-cyan-400">
            {node.name} Properties
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {getNodePropertyTemplate(node.type).map((prop) => (
            <div key={prop.key}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {prop.label}
              </label>
              {prop.type === 'text' && (
                <input
                  type="text"
                  value={properties[prop.key] || ''}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  placeholder={prop.placeholder}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              )}
              {prop.type === 'select' && (
                <select
                  value={properties[prop.key] || prop.options[0]}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {prop.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {prop.type === 'number' && (
                <input
                  type="number"
                  value={properties[prop.key] || ''}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  min={prop.min}
                  max={prop.max}
                  placeholder={prop.placeholder}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              )}
              {prop.type === 'textarea' && (
                <textarea
                  value={properties[prop.key] || ''}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  placeholder={prop.placeholder}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              )}
              {prop.type === 'checkbox' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={properties[prop.key] || false}
                    onChange={(e) => handlePropertyChange(prop.key, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">Enable</span>
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Save Properties
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Workspace Component
export default function WorkspacePage() {
  const router = useRouter()
  const [nodes, setNodes] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showNodeProperties, setShowNodeProperties] = useState(null)
  const [currentNetwork, setCurrentNetwork] = useState('testnet')
  const [isConnected, setIsConnected] = useState(false)
  const canvasRef = useRef(null)

  const addNode = useCallback((nodeTemplate, position) => {
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...nodeTemplate,
      isActive: true,
      properties: {},
      position: position || { x: 300, y: 200 }
    }
    setNodes(prev => [...prev, newNode])
  }, [])

  const handleNodeAdd = (nodeTemplate) => {
    addNode(nodeTemplate)
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    try {
      const nodeData = JSON.parse(e.dataTransfer.getData('application/json'))
      const rect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      addNode(nodeData, position)
    } catch (error) {
      console.error('Error adding node:', error)
    }
  }

  const handleCanvasDragOver = (e) => {
    e.preventDefault()
  }

  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId)
  }

  const handleNodePropertiesOpen = (node) => {
    setShowNodeProperties(node)
  }

  const handleNodePropertiesSave = (nodeId, properties) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, properties } : node
    ))
  }

  const handleNetworkChange = (network) => {
    setCurrentNetwork(network)
    // Here you would implement actual network switching
    console.log(`Switching to ${network}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Top Navigation */}
      <nav className="bg-black border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-orbitron font-semibold">Back to Home</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="text-2xl font-bold font-orbitron">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Akroft i8 Node Workspace
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Network Switch */}
            <NetworkSwitch 
              currentNetwork={currentNetwork}
              onNetworkChange={handleNetworkChange}
              isConnected={isConnected}
            />
            
            <button
              onClick={() => {setNodes([]); setSelectedNode(null)}}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Clear All
            </button>
            
            <button
              onClick={() => alert(`🚀 Executing workflow with ${nodes.length} nodes on ${currentNetwork === 'testnet' ? 'Arbitrum Sepolia' : 'Arbitrum One'}`)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
            >
              ⚡ Execute Workflow
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Enhanced Node Library */}
        <NodeLibrary onNodeAdd={handleNodeAdd} />

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full relative overflow-hidden bg-gray-900"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onClick={() => setSelectedNode(null)}
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px, 20px 20px, 20px 20px'
            }}
          >
            {/* Canvas Instructions */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4 opacity-50">⚡</div>
                  <h3 className="text-2xl font-bold mb-4 font-orbitron">Build Your Web3 Automation</h3>
                  <p className="text-lg mb-2">Drag nodes from the sidebar or click to add them</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Connect APIs, DeFi protocols, and smart contracts</p>
                    <p>• Double-click nodes to configure properties</p>
                    <p>• Switch between Testnet and Mainnet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Render Enhanced Nodes */}
            {nodes.map(node => (
              <NodeComponent
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={handleNodeSelect}
                onNodePropertiesOpen={handleNodePropertiesOpen}
                position={node.position}
                onPositionChange={(newPosition) => {
                  setNodes(prev => prev.map(n => 
                    n.id === node.id ? { ...n, position: newPosition } : n
                  ))
                }}
              />
            ))}
          </div>

          {/* Node count and status */}
          {nodes.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400/30">
              <span className="text-sm text-gray-300 font-orbitron">
                Nodes: <span className="text-cyan-400 font-semibold">{nodes.length}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Node Properties Panel */}
      {showNodeProperties && (
        <NodePropertiesPanel
          node={showNodeProperties}
          onClose={() => setShowNodeProperties(null)}
          onSave={handleNodePropertiesSave}
        />
      )}
    </div>
  )
}