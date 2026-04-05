import { Card, Spin } from 'antd';
import { Line } from '@ant-design/charts';
import { Link } from 'react-router-dom';
import { useShopRevenueQuery } from '../../../../../queries/statistics.query';
import { useSellerStore } from '../../../../../store/seller.store';
import { PATH } from '../../../../../utils/path.util';
import dayjs from 'dayjs';

const RevenueChart = () => {
  const { currentShopId } = useSellerStore();
  const { data, isLoading } = useShopRevenueQuery(currentShopId!, { period: 'day' });

  const chartData = data?.map((item) => ({
    date: dayjs(item.date).format('DD/MM'),
    revenue: item.revenue,
  })) || [];

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    color: '#1890ff',
    point: { size: 5 },
    tooltip: {
      formatter: (datum: any) => {
        return { 
          name: 'Doanh thu', 
          value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum.revenue) 
        };
      },
    },
  };

  return (
    <Card 
      title="Doanh thu hôm nay (Theo ngày)" 
      style={{ borderRadius: 12 }}
      extra={<Link to={`/${PATH.SELLER}/${currentShopId}/${PATH.REVENUE_REPORT}`}>Xem chi tiết</Link>}
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
