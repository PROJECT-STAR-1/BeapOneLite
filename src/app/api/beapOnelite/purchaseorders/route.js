import { NextResponse } from "next/server";
import mockData from "@/data/beapOneLite/purchaseorders.json";

const purchaseOrdersData = mockData.purchaseOrders; 

export async function GET() {

  return NextResponse.json(mockData); 


}