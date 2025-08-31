import { Database } from '@tableland/sdk';
import { NextResponse } from 'next/server';

// Initialize Tableland Database
const db = new Database();

export async function POST(request) {
  try {
    const { address, email } = await request.json();
    
    // Validate input
    if (!address || !email) {
      return NextResponse.json(
        { error: 'Address and email are required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    const tableName = 'akroft_users_80001'; // Polygon Mumbai testnet
    
    try {
      // Check if user already exists
      const existingUser = await db.prepare(
        `SELECT * FROM ${tableName} WHERE wallet_address = ?`
      ).bind(address).first();

      if (existingUser) {
        // User already exists, update email if different
        if (existingUser.email !== email) {
          await db.prepare(
            `UPDATE ${tableName} SET email = ?, updated_at = datetime('now') WHERE wallet_address = ?`
          ).bind(email, address).run();
        }
        
        return NextResponse.json({
          message: 'User updated successfully',
          user: { address, email, existed: true }
        });
      }

      // Insert new user
      await db.prepare(
        `INSERT INTO ${tableName} (wallet_address, email, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))`
      ).bind(address, email).run();

      return NextResponse.json({
        message: 'User registered successfully',
        user: { address, email, existed: false }
      });

    } catch (dbError) {
      // If table doesn't exist, create it first
      if (dbError.message.includes('no such table')) {
        try {
          await db.exec(`
            CREATE TABLE ${tableName} (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              wallet_address TEXT UNIQUE NOT NULL,
              email TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
          `);

          // Now insert the user
          await db.prepare(
            `INSERT INTO ${tableName} (wallet_address, email, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))`
          ).bind(address, email).run();

          return NextResponse.json({
            message: 'User registered successfully (table created)',
            user: { address, email, existed: false }
          });
        } catch (createError) {
          console.error('Error creating table:', createError);
          return NextResponse.json(
            { error: 'Failed to create user table' },
            { status: 500 }
          );
        }
      }
      
      throw dbError;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during user registration' },
      { status: 500 }
    );
  }
}

// Handle GET requests to check if user exists
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const tableName = 'akroft_users_80001';
    
    try {
      const user = await db.prepare(
        `SELECT wallet_address, email, created_at FROM ${tableName} WHERE wallet_address = ?`
      ).bind(address).first();

      return NextResponse.json({
        exists: !!user,
        user: user || null
      });
    } catch (dbError) {
      if (dbError.message.includes('no such table')) {
        return NextResponse.json({
          exists: false,
          user: null
        });
      }
      throw dbError;
    }

  } catch (error) {
    console.error('User lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error during user lookup' },
      { status: 500 }
    );
  }
}