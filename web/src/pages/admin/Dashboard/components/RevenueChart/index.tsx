import { Card } from "antd";
import { Line } from "@ant-design/charts";

const revenueData = [
  { month: "Jan", value: 12000000 },
  { month: "Feb", value: 18000000 },
  { month: "Mar", value: 24000000 },
  { month: "Apr", value: 20000000 },
  { month: "May", value: 32000000 },
  { month: "Jun", value: 38000000 },
];

const RevenueChart = () => {
  const config = {
    data: revenueData,
    xField: "month",
    yField: "value",
    smooth: true,
    color: "#fa541c",
    point: { size: 5 },
  };

  return (
    <Card title="Doanh thu 6 tháng gần nhất" style={{ borderRadius: 12 }}>
      <Line {...config} />
    </Card>
  );
};

export default RevenueChart;
