import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { TABLES, initializeTables } from "../schema.js";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST() {
  try {
    console.log("Initializing database tables...");
    
    // Initialize all tables using the schema
    const result = await initializeTables(db);
    
    console.log("Database initialization completed successfully");
    
    return Response.json({
      success: true,
      message: "Database tables initialized successfully",
      tables: Object.keys(TABLES),
      details: result
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if tables exist by trying to query them
    const tableStatus = {};
    
    for (const tableName of Object.keys(TABLES)) {
      try {
        const { results } = await db
          .prepare(`SELECT COUNT(*) as count FROM ${tableName} LIMIT 1`)
          .all();
        
        tableStatus[tableName] = {
          exists: true,
          records: results[0]?.count || 0
        };
      } catch (error) {
        tableStatus[tableName] = {
          exists: false,
          error: error.message
        };
      }
    }

    return Response.json({
      success: true,
      tables: tableStatus
    });

  } catch (error) {
    console.error('Error checking database status:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}