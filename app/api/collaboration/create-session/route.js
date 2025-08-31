import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST(request) {
  try {
    const { wallet_address, max_clients } = await request.json();

    if (!wallet_address) {
      return Response.json({ success: false, error: 'Wallet address required' }, { status: 400 });
    }

    // Create collaboration session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { meta: insertMeta } = await db
      .prepare(`INSERT INTO workspace_sessions (session_id, host_address, max_clients, status, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(sessionId, wallet_address, max_clients, 'active', new Date().toISOString())
      .run();

    await insertMeta.txn?.wait();

    return Response.json({
      success: true,
      sessionId,
      message: 'Collaboration session created successfully'
    });

  } catch (error) {
    console.error('Error creating collaboration session:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}