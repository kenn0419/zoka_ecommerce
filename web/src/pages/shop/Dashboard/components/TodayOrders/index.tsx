import { Card, Table, Tag } from "antd";

const data = [
  {
    key: "1",
    code: "#OD001",
    customer: "Nguyễn Văn A",
    total: 320000,
    status: "PENDING",
  },
  {
    key: "2",
    code: "#OD002",
    customer: "Trần Thị B",
    total: 560000,
    status: "COMPLETED",
  },
];

export default function TodayOrders() {
  return (
    <Card title="Đơn hàng hôm nay">
      <Table
        size="small"
        pagination={false}
        dataSource={data}
        columns={[
          { title: "Mã đơn", dataIndex: "code" },
          { title: "Khách", dataIndex: "customer" },
          {
            title: "Tổng tiền",
            dataIndex: "total",
            render: (v) => `${v.toLocaleString()}₫`,
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: (s) => (
              <Tag color={s === "COMPLETED" ? "green" : "orange"}>{s}</Tag>
            ),
          },
        ]}
      />
    </Card>
  );
}
