
import { NextResponse } from 'next/server';

import subscriptionData from '@/data/beapOneLite/subscription.json'; 

export async function GET() {
  try {
    // Return the JSON data directly
    return NextResponse.json(subscriptionData);

  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch subscription data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}