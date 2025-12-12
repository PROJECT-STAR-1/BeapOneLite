import rawData from "@/data/beapOneLite/tax-wht-reports.json";

function isWithinRange(dateStr, start, end) {
  const dt = new Date(dateStr);
  return dt >= new Date(start) && dt <= new Date(end);
}

function getRangeFromPreset(preset) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (preset) {
    case "Today":
      return {
        start: now.toISOString().split("T")[0],
        end: now.toISOString().split("T")[0],
      };

    case "This Week": {
      const start = new Date(now);
      const day = start.getDay();
      start.setDate(now.getDate() - day + 1);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      };
    }

    case "This Month": {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      };
    }

    case "This Quarter": {
      const quarter = Math.floor(month / 3);
      const start = new Date(year, quarter * 3, 1);
      const end = new Date(year, quarter * 3 + 3, 0);
      return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      };
    }

    case "This Year": {
      return {
        start: `${year}-01-01`,
        end: `${year}-12-31`,
      };
    }

    default:
      return null;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const dateRange = searchParams.get("dateRange");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const location = searchParams.get("location");

  let vatsalestax = structuredClone(rawData.vatsalestax);
  let withholdingtax = structuredClone(rawData.withholdingtax);

  let filteredStart = startDate;
  let filteredEnd = endDate;

  // Apply preset date ranges
  if (dateRange && dateRange !== "Custom Range") {
    const preset = getRangeFromPreset(dateRange);
    if (preset) {
      filteredStart = preset.start;
      filteredEnd = preset.end;
    }
  }

  /* ------------------------------------------
     FILTER VAT
  -------------------------------------------*/
  vatsalestax.invoices = vatsalestax.invoices.filter((inv) => {
    const locationMatch =
      !location || location === "All Locations" || inv.location === location;

    const dateMatch =
      !filteredStart ||
      !filteredEnd ||
      isWithinRange(inv.date, filteredStart, filteredEnd);

    return locationMatch && dateMatch;
  });

  // Recalculate totals
  vatsalestax.netTaxableSales = vatsalestax.invoices.reduce(
    (sum, x) => sum + x.baseAmount,
    0
  );

  vatsalestax.totalVatCollected = vatsalestax.invoices.reduce(
    (sum, x) => sum + x.vatAmount,
    0
  );

  vatsalestax.totalInvoices = vatsalestax.invoices.length;

  /* ------------------------------------------
     FILTER WHT
  -------------------------------------------*/
  withholdingtax.customerWHT = withholdingtax.customerWHT.filter((cust) => {
    const locationMatch =
      !location || location === "All Locations" || cust.location === location;

    const dateMatch =
      !filteredStart ||
      !filteredEnd ||
      isWithinRange(cust.date, filteredStart, filteredEnd);

    return locationMatch && dateMatch;
  });

  return Response.json({
    vatsalestax,
    withholdingtax,
  });
}
