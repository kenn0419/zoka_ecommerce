import { Card, Table, Tag } from "antd";

const orders = [
  {
    key: "1",
    orderCode: "#OD12345",
    customer: "Nguyễn Văn A",
    total: "1.200.000₫",
    status: "COMPLETED",
  },
  {
    key: "2",
    orderCode: "#OD12346",
    customer: "Trần Văn B",
    total: "560.000₫",
    status: "PROCESSING",
  },
  {
    key: "3",
    orderCode: "#OD12347",
    customer: "Lê Văn C",
    total: "890.000₫",
    status: "CANCELLED",
  },
];

const columns = [
  { title: "Mã đơn", dataIndex: "orderCode" },
  { title: "Khách hàng", dataIndex: "customer" },
  { title: "Tổng tiền", dataIndex: "total" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: string) => {
      if (status === "COMPLETED") return <Tag color="green">Hoàn thành</Tag>;
      if (status === "PROCESSING") return <Tag color="orange">Đang xử lý</Tag>;
      return <Tag color="red">Đã huỷ</Tag>;
    },
  },
];

const RecentOrders = () => {
  return (
    <Card title="Đơn hàng gần đây" style={{ borderRadius: 12 }}>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default RecentOrders;
