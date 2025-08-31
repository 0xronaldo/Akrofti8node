import { initializeTables } from '../database/schema.js';

export async function POST() {
  try {
    await initializeTables();
    return Response.json({ 
      success: true, 
      message: 'All database tables initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: 'Database initialization endpoint ready. Use POST to initialize tables.',
    endpoints: {
      initialize: 'POST /api/database/init',
      status: 'GET /api/database/init'
    }
  });
}