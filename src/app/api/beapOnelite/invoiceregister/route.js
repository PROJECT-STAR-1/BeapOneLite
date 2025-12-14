import mockData from '@/data/beapOneLite/invoiceregister.json';

export async function GET(req) {
  return new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
