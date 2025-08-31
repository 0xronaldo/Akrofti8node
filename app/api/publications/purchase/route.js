import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST(request) {
  try {
    const { publication_id, buyer_address, amount } = await request.json();

    if (!publication_id || !buyer_address || amount === undefined) {
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

    if (publication.type !== 'sell') {
      return Response.json({ success: false, error: 'This publication is not for sale' }, { status: 400 });
    }

    if (parseFloat(amount) < parseFloat(publication.price)) {
      return Response.json({ success: false, error: 'Insufficient payment amount' }, { status: 400 });
    }

    // Record the purchase (in a real app, this would involve actual crypto transaction)
    const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For demo purposes, we'll just create a record. In production, integrate with smart contracts
    const { meta: insertMeta } = await db
      .prepare(`INSERT INTO collaborations (session_id, collaborator_address, role, joined_at) VALUES (?, ?, ?, ?)`)
      .bind(purchaseId, buyer_address, 'buyer', new Date().toISOString())
      .run();

    await insertMeta.txn?.wait();

    return Response.json({
      success: true,
      purchaseId,
      workflow_data: JSON.parse(publication.workflow_data || '{}'),
      message: 'Purchase completed successfully'
    });

  } catch (error) {
    console.error('Error processing purchase:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}