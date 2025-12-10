import { NextResponse } from 'next/server';
import portal from '@/data/beapOneLite/channelManagement/portalData.json';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); 
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  if (section && Object.prototype.hasOwnProperty.call(portal, section)) {
    const dataSection = portal[section];
    
    if (Array.isArray(dataSection)) {
      const sliced = limit > 0 ? dataSection.slice(0, limit) : dataSection;
      return NextResponse.json(sliced);
    }

    return NextResponse.json({ error: 'Requested section is not an array' }, { status: 400 });
  }

  return NextResponse.json(portal);
}
