import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.TABLELAND_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const signer = new ethers.Wallet(PRIVATE_KEY);
const db = new Database({ signer });

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