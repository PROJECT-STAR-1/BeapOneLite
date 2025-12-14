import invoices from "@/data/beapOneLite/invoices.json";

export function GET() {
  return Response.json({
    success: true,
    invoices
  });
}
