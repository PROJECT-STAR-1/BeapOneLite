import { NextResponse } from "next/server";

import bpcData from "@/data/beapOneLite/bpcData.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  // Set default limit to 0 (return all) if parsing fails
  const limit = parseInt(searchParams.get("limit") || "0", 10);

  if (!section) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(bpcData);
  }

  if (Object.prototype.hasOwnProperty.call(bpcData, section)) {
    const dataSection = bpcData[section];

    if (Array.isArray(dataSection)) {
      const sliced = limit > 0 ? dataSection.slice(0, limit) : dataSection;
      return NextResponse.json(sliced);
    }

    // If it's a single object (like 'audit' or 'context'), return it directly
    return NextResponse.json(dataSection);
  }

  // 3. Fallback: Invalid section requested
  return NextResponse.json(
    { error: `Invalid 'section' parameter: '${section}' not found in data.` },
    { status: 404 }
  );
}
