import data from '@/data/beapOneLite/financialreports.json';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || "Last month";
  const location = searchParams.get('location') || "All locations";

  const reports = data.reports;

  function compute(statement) {
    const grossProfit = statement.totalRevenue - statement.cogs;
    const netProfit = grossProfit - statement.operatingExpenses;

    return {
      ...statement,
      grossProfit,
      netProfitBeforeTax: netProfit,
      netProfit
    };
  }

  let plStatement;

  if (location !== "All locations") {
    const locData = reports[location]?.[period];
    if (!locData) return new Response(JSON.stringify({ error: "No data found" }), { status: 404 });

    plStatement = compute(locData);
  } else {
    // Sum across all locations
    let totalRevenue = 0, cogs = 0, operatingExpenses = 0;
    Object.keys(reports).forEach((loc) => {
      const s = reports[loc][period];
      if (s) {
        totalRevenue += s.totalRevenue;
        cogs += s.cogs;
        operatingExpenses += s.operatingExpenses;
      }
    });
    plStatement = compute({
      period: `${period} – All Locations`,
      totalRevenue,
      cogs,
      operatingExpenses
    });
  }

  return Response.json({
    ...data,
    plStatement
  });
}
