import { NextResponse } from "next/server";
import data from "@/data/beapOneLite/einvoice.json";

export async function GET() {
  try {
    // Return JSON directly — no wrappers
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load E-Invoice data" },
      { status: 500 }
    );
  }
}
