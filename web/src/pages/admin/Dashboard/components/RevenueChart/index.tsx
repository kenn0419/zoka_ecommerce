import { Card, Spin } from "antd";
import { Line } from "@ant-design/charts";
import { useAdminRevenueQuery } from "../../../../../queries/statistics.query";
import dayjs from "dayjs";
import { PATH } from "../../../../../utils/path.util";

const RevenueChart = () => {
  const { data, isLoading } = useAdminRevenueQuery({ period: 'day' });

  const chartData = data?.map((item) => ({
    date: dayjs(item.date).format('DD/MM'),
    revenue: item.revenue,
  })) || [];

  const config = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    smooth: true,
    color: "#fa541c",
    point: { size: 5 },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Doanh thu', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum.revenue) };
      },
    },
  };

  return (
    <Card 
      title="Doanh thu hôm nay (Theo ngày)" 
      style={{ borderRadius: 12 }}
      extra={<a href={`/admin/${PATH.REVENUE_REPORT}`}>Xem chi tiết</a>}
    >
      {isLoading ? (
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin />
        </div>
      ) : (
        <Line {...config} height={300} />
      )}
    </Card>
  );
};

export default RevenueChart;
