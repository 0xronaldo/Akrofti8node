// Database Schema for Akroft i8 Node - Enhanced Collaborative System
import { Database } from '@tableland/sdk';

const db = new Database();

export const TABLES = {
  USERS: 'akroft_users_80001',
  NODES: 'akroft_nodes_80001',
  WORKFLOWS: 'akroft_workflows_80001',
  COLLABORATIONS: 'akroft_collaborations_80001',
  PUBLICATIONS: 'akroft_publications_80001',
  NODE_PROPERTIES: 'akroft_node_properties_80001',
  WORKSPACE_SESSIONS: 'akroft_workspace_sessions_80001'
};

// Node Types Configuration
export const NODE_TYPES = {
  // Data Input Nodes
  DATA_INPUT: {
    API: { name: 'API Request', category: 'data_input', color: '#10B981' },
    WEBHOOK: { name: 'Webhook', category: 'data_input', color: '#059669' },
    DATABASE: { name: 'Database Query', category: 'data_input', color: '#047857' },
    FILE_INPUT: { name: 'File Input', category: 'data_input', color: '#065F46' },
    COINGECKO: { name: 'CoinGecko API', category: 'data_input', color: '#10B981' },
    CHAINLINK: { name: 'Chainlink Oracle', category: 'data_input', color: '#3B82F6' }
  },
  
  // Logic Nodes
  LOGIC: {
    CONDITION: { name: 'If/Else', category: 'logic', color: '#8B5CF6' },
    LOOP: { name: 'Loop', category: 'logic', color: '#7C3AED' },
    SWITCH: { name: 'Switch', category: 'logic', color: '#6D28D9' },
    FILTER: { name: 'Filter', category: 'logic', color: '#5B21B6' },
    CALCULATOR: { name: 'Math Calculator', category: 'logic', color: '#7C2D12' },
    JSON_PARSER: { name: 'JSON Parser', category: 'logic', color: '#9333EA' }
  },
  
  // DeFi Protocol Nodes
  DEFI: {
    UNISWAP: { name: 'Uniswap V3', category: 'defi', color: '#EC4899' },
    AAVE: { name: 'Aave Protocol', category: 'defi', color: '#8B5CF6' },
    COMPOUND: { name: 'Compound', category: 'defi', color: '#06B6D4' },
    SUSHISWAP: { name: 'SushiSwap', category: 'defi', color: '#F59E0B' },
    ARBITRUM_BRIDGE: { name: 'Arbitrum Bridge', category: 'defi', color: '#1E40AF' },
    CHAINLINK_PRICE: { name: 'Chainlink Price Feed', category: 'defi', color: '#3B82F6' }
  },
  
  // Smart Contract Nodes
  SMART_CONTRACT: {
    DEPLOY_CONTRACT: { name: 'Deploy Contract', category: 'smart_contract', color: '#DC2626' },
    CONTRACT_CALL: { name: 'Contract Call', category: 'smart_contract', color: '#B91C1C' },
    EVENT_LISTENER: { name: 'Event Listener', category: 'smart_contract', color: '#991B1B' },
    WALLET_CONNECT: { name: 'Wallet Connection', category: 'smart_contract', color: '#7F1D1D' }
  },
  
  // Output Nodes
  OUTPUT: {
    WEBHOOK_SEND: { name: 'Send Webhook', category: 'output', color: '#F59E0B' },
    EMAIL: { name: 'Send Email', category: 'output', color: '#D97706' },
    DATABASE_WRITE: { name: 'Database Write', category: 'output', color: '#B45309' },
    FILE_EXPORT: { name: 'Export File', category: 'output', color: '#92400E' },
    NOTIFICATION: { name: 'Push Notification', category: 'output', color: '#78350F' }
  }
};

// Initialize all database tables
export async function initializeTables() {
  try {
    // Users table (enhanced)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet_address TEXT UNIQUE NOT NULL,
        email TEXT,
        username TEXT,
        avatar_url TEXT,
        subscription_type TEXT DEFAULT 'free',
        collaboration_mode BOOLEAN DEFAULT false,
        max_collaborators INTEGER DEFAULT 4,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Nodes table (detailed properties)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.NODES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id TEXT UNIQUE NOT NULL,
        node_type TEXT NOT NULL,
        node_name TEXT NOT NULL,
        description TEXT,
        workflow_id TEXT NOT NULL,
        owner_address TEXT NOT NULL,
        position_x REAL NOT NULL,
        position_y REAL NOT NULL,
        properties TEXT, -- JSON string of node properties
        connections TEXT, -- JSON string of input/output connections
        is_active BOOLEAN DEFAULT true,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Workflows table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.WORKFLOWS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        owner_address TEXT NOT NULL,
        is_public BOOLEAN DEFAULT false,
        is_collaborative BOOLEAN DEFAULT false,
        network_type TEXT DEFAULT 'testnet', -- testnet or mainnet
        blockchain TEXT DEFAULT 'arbitrum-sepolia',
        tags TEXT, -- JSON array of tags
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Collaborations table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.COLLABORATIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collaboration_id TEXT UNIQUE NOT NULL,
        workflow_id TEXT NOT NULL,
        server_address TEXT NOT NULL, -- Host user wallet address
        client_address TEXT NOT NULL, -- Collaborator wallet address
        status TEXT DEFAULT 'pending', -- pending, active, rejected, completed
        permissions TEXT DEFAULT 'read_write', -- read_only, read_write, admin
        joined_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Publications table (marketplace)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.PUBLICATIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        publication_id TEXT UNIQUE NOT NULL,
        workflow_id TEXT NOT NULL,
        owner_address TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        publication_type TEXT NOT NULL, -- 'sale', 'collaboration', 'free'
        price_eth REAL DEFAULT 0, -- Price in ETH
        max_collaborators INTEGER DEFAULT 1,
        tags TEXT, -- JSON array
        preview_image TEXT,
        demo_url TEXT,
        downloads_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'active', -- active, paused, sold
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Node Properties (detailed configurations)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.NODE_PROPERTIES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id TEXT NOT NULL,
        property_key TEXT NOT NULL,
        property_value TEXT NOT NULL,
        property_type TEXT NOT NULL, -- string, number, boolean, json, encrypted
        is_encrypted BOOLEAN DEFAULT false,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Workspace Sessions (real-time collaboration)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${TABLES.WORKSPACE_SESSIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        workflow_id TEXT NOT NULL,
        user_address TEXT NOT NULL,
        user_role TEXT DEFAULT 'collaborator', -- host, collaborator
        cursor_position TEXT, -- JSON {x, y}
        last_activity TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    console.log('All database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Node Property Templates for different node types
export const NODE_PROPERTY_TEMPLATES = {
  API: {
    url: { type: 'string', required: true, placeholder: 'https://api.example.com' },
    method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
    headers: { type: 'json', default: {} },
    body: { type: 'json', default: {} },
    timeout: { type: 'number', default: 30000, min: 1000, max: 300000 }
  },
  
  COINGECKO: {
    coin_id: { type: 'string', required: true, placeholder: 'ethereum', default: 'ethereum' },
    vs_currency: { type: 'string', default: 'usd', placeholder: 'usd, eur, btc' },
    include_market_cap: { type: 'boolean', default: true },
    include_24hr_vol: { type: 'boolean', default: true },
    include_24hr_change: { type: 'boolean', default: true }
  },
  
  CHAINLINK_PRICE: {
    pair: { type: 'select', options: ['ETH/USD', 'BTC/USD', 'LINK/USD', 'MATIC/USD'], default: 'ETH/USD' },
    network: { type: 'select', options: ['arbitrum-sepolia', 'arbitrum-mainnet'], default: 'arbitrum-sepolia' },
    decimals: { type: 'number', default: 8, min: 0, max: 18 },
    update_interval: { type: 'number', default: 60000, min: 5000 }
  },
  
  CALCULATOR: {
    operation: { type: 'select', options: ['add', 'subtract', 'multiply', 'divide', 'percentage'], default: 'add' },
    precision: { type: 'number', default: 2, min: 0, max: 18 },
    input_a_source: { type: 'select', options: ['manual', 'previous_node'], default: 'manual' },
    input_b_source: { type: 'select', options: ['manual', 'previous_node'], default: 'manual' },
    manual_value_a: { type: 'number', default: 0 },
    manual_value_b: { type: 'number', default: 0 }
  },

  CONTRACT_CALL: {
    contract_address: { type: 'string', required: true, placeholder: '0x...' },
    function_name: { type: 'string', required: true, placeholder: 'transfer' },
    abi: { type: 'json', required: true },
    parameters: { type: 'json', default: {} },
    gas_limit: { type: 'number', default: 100000, min: 21000 },
    value_eth: { type: 'number', default: 0, min: 0 }
  }
};

export { db };