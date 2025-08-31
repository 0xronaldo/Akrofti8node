import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json({ success: false, error: 'Session ID required' }, { status: 400 });
    }

    // Get all clients in this session
    const { results } = await db
      .prepare(`SELECT collaborator_address FROM collaborations WHERE session_id = ? AND role = 'client'`)
      .bind(sessionId)
      .all();

    const clients = results.map(row => row.collaborator_address);

    return Response.json({
      success: true,
      clients,
      clientCount: clients.length
    });

  } catch (error) {
    console.error('Error getting session status:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}