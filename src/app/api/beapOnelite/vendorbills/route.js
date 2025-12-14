import vendorBillsData from "@/data/beapOneLite/vendorbills.json";

export async function GET() {
  return Response.json(vendorBillsData);
}
