import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST(request) {
  try {
    const { server_address, client_address } = await request.json();

    if (!server_address || !client_address) {
      return Response.json({ success: false, error: 'Server and client addresses required' }, { status: 400 });
    }

    // Find active session by server address
    const { results } = await db
      .prepare(`SELECT * FROM workspace_sessions WHERE host_address = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1`)
      .bind(server_address)
      .all();

    if (results.length === 0) {
      return Response.json({ success: false, error: 'No active session found for this server' }, { status: 404 });
    }

    const session = results[0];

    // Check if session is full
    const { results: clientsResults } = await db
      .prepare(`SELECT COUNT(*) as client_count FROM collaborations WHERE session_id = ?`)
      .bind(session.session_id)
      .all();

    if (clientsResults[0].client_count >= session.max_clients) {
      return Response.json({ success: false, error: 'Session is full' }, { status: 400 });
    }

    // Add client to collaboration
    const { meta: insertMeta } = await db
      .prepare(`INSERT INTO collaborations (session_id, collaborator_address, role, joined_at) VALUES (?, ?, ?, ?)`)
      .bind(session.session_id, client_address, 'client', new Date().toISOString())
      .run();

    await insertMeta.txn?.wait();

    return Response.json({
      success: true,
      sessionId: session.session_id,
      message: 'Successfully joined collaboration session'
    });

  } catch (error) {
    console.error('Error joining collaboration session:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}