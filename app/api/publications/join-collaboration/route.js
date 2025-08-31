import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST(request) {
  try {
    const { publication_id, collaborator_address } = await request.json();

    if (!publication_id || !collaborator_address) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Get publication details
    const { results } = await db
      .prepare(`SELECT * FROM publications WHERE id = ? AND status = 'active'`)
      .bind(publication_id)
      .all();

    if (results.length === 0) {
      return Response.json({ success: false, error: 'Publication not found' }, { status: 404 });
    }

    const publication = results[0];

    if (publication.type !== 'collaborate') {
      return Response.json({ success: false, error: 'This publication is not seeking collaborators' }, { status: 400 });
    }

    // Check current collaboration count
    const { results: collaborationResults } = await db
      .prepare(`SELECT COUNT(*) as collab_count FROM collaborations WHERE session_id = ?`)
      .bind(publication_id)
      .all();

    if (collaborationResults[0].collab_count >= publication.collaboration_spots) {
      return Response.json({ success: false, error: 'Collaboration is full' }, { status: 400 });
    }

    // Add collaborator
    const { meta: insertMeta } = await db
      .prepare(`INSERT INTO collaborations (session_id, collaborator_address, role, joined_at) VALUES (?, ?, ?, ?)`)
      .bind(publication_id, collaborator_address, 'collaborator', new Date().toISOString())
      .run();

    await insertMeta.txn?.wait();

    return Response.json({
      success: true,
      message: 'Successfully joined collaboration'
    });

  } catch (error) {
    console.error('Error joining collaboration:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}