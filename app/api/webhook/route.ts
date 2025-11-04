import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Handle webhook events from Farcaster
  const body = await request.json();
  
  // Add your webhook handling logic here
  console.log('Webhook received:', body);
  
  return NextResponse.json({ success: true });
}

