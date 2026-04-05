interface IRevenueData {
  date: string;
  revenue: number;
  cumulativeRevenue: number;
  previousRevenue: number | null;
  growthPercentage: number | null;
}

interface IRevenueQueries {
  period?: "day" | "month" | "year";
  startDate?: string;
  endDate?: string;
}