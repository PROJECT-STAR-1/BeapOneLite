import { NextResponse } from "next/server";
import purchaseOrders from "@/data/beapOneLite/purchaseorders.json";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: purchaseOrders
  });
}
