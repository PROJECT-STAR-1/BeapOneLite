import taxData from "@/data/beapOneLite/tax-wht-reports.json";

export async function GET(req) {
  return new Response(JSON.stringify(taxData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
