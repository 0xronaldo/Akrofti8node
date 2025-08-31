import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

export async function POST(request) {
  try {
    const { title, description, type, price, creator_address, workflow_data, collaboration_spots } = await request.json();

    if (!title || !description || !creator_address) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const publicationId = `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { meta: insertMeta } = await db
      .prepare(`INSERT INTO publications (id, title, description, type, price, creator_address, workflow_data, collaboration_spots, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        publicationId,
        title,
        description,
        type,
        price || 0,
        creator_address,
        JSON.stringify(workflow_data || {}),
        collaboration_spots || 1,
        new Date().toISOString(),
        'active'
      )
      .run();

    await insertMeta.txn?.wait();

    return Response.json({
      success: true,
      publicationId,
      message: 'Publication created successfully'
    });

  } catch (error) {
    console.error('Error creating publication:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { results } = await db
      .prepare(`SELECT * FROM publications WHERE status = 'active' ORDER BY created_at DESC`)
      .all();

    return Response.json({
      success: true,
      publications: results
    });

  } catch (error) {
    console.error('Error fetching publications:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}