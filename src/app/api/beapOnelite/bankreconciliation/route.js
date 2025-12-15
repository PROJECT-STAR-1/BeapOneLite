
import { NextResponse } from 'next/server';
import mockData from '@/data/beapOneLite/ReconciliationData.json'; 

export async function GET(request) {
  try {
    const data = mockData;
    
    // Return all the data using NextResponse
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error fetching reconciliation data:", error);
    return NextResponse.json(
      { error: 'Failed to access reconciliation data' },
      { status: 500 }
    );
  }
}