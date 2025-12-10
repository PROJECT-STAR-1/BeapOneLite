import { NextResponse } from 'next/server';
import LiteAdmin from '@/data/beapOneLite/channelManagement/liteAdminData.json';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); 
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  if (section && Object.prototype.hasOwnProperty.call(LiteAdmin, section)) {
    const dataSection = LiteAdmin[section];
    
    if (Array.isArray(dataSection)) {
      const sliced = limit > 0 ? dataSection.slice(0, limit) : dataSection;
      return NextResponse.json(sliced);
    }

    return NextResponse.json({ error: 'Requested section is not an array' }, { status: 400 });
  }

  return NextResponse.json(LiteAdmin);
}
