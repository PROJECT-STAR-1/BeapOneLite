import { NextResponse } from 'next/server';

import mockData from '@/data/beapOneLite/staffReports.json'; 

export async function GET() {
  try {
    return NextResponse.json(mockData);

  } catch (error) {
    console.error('Error fetching mock staff reports data:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch staff reports data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}