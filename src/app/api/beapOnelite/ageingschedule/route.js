import data from "@/data/beapOneLite/ageingSchedule.json";

export function GET() {
  return Response.json({
    success: true,
    ...data
  });
}
