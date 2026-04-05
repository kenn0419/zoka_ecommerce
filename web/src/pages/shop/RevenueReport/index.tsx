import React, { useState } from 'react';
import { Card, DatePicker, Button, Table, Space, Typography, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useShopRevenueQuery } from '../../../queries/statistics.query';
import { statisticsApi } from '../../../apis/statistics.api';
import dayjs from 'dayjs';
import { Area } from '@ant-design/charts';
import { useSellerStore } from '../../../store/seller.store';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const ShopRevenueReport: React.FC = () => {
  const shopId = useSellerStore(s => s.currentShopId);
  
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(1, 'month'),
    dayjs(),
  ]);

  const { data: revenueData, isLoading } = useShopRevenueQuery(shopId || '', {
    period: 'day',
    startDate: dates ? dates[0].format('YYYY-MM-DD') : undefined,
    endDate: dates ? dates[1].format('YYYY-MM-DD') : undefined,
  });

  const handleExport = async () => {
    if (!shopId) return;
    try {
      const response = await statisticsApi.exportShopRevenue(shopId, {
        period: 'day',
        startDate: dates ? dates[0].format('YYYY-MM-DD') : undefined,
        endDate: dates ? dates[1].format('YYYY-MM-DD') : undefined,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `shop-revenue-${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Cumulative Revenue',
      dataIndex: 'cumulativeRevenue',
      key: 'cumulativeRevenue',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Growth',
      dataIndex: 'growthPercentage',
      key: 'growthPercentage',
      render: (val: number | null) => {
        if (val === null) return <Tag>N/A</Tag>;
        const color = val >= 0 ? 'green' : 'red';
        return <Tag color={color}>{val.toFixed(2)}%</Tag>;
      },
    },
  ];

  const config = {
    data: revenueData || [],
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Sales & Revenue Report</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space>
            <RangePicker 
              value={dates} 
              onChange={(val) => setDates(val as any)} 
              format="YYYY-MM-DD"
            />
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              disabled={!shopId}
            >
              Export Excel
            </Button>
          </Space>
        </Card>

        <Card title="Sales Performance">
          <div style={{ height: 400 }}>
            <Area {...config} />
          </div>
        </Card>

        <Card title="Transaction History">
          <Table 
            columns={columns} 
            dataSource={revenueData || []} 
            loading={isLoading}
            rowKey="date"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default ShopRevenueReport;
