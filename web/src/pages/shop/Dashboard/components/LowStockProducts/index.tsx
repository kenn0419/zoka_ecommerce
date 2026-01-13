import { Card, List, Progress } from "antd";

const products = [
  { id: "1", name: "Áo thun trắng", stock: 3 },
  { id: "2", name: "Quần jean xanh", stock: 5 },
];

export default function LowStockProducts() {
  return (
    <Card title="Sắp hết hàng">
      <List
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <div>{item.name}</div>
              <Progress
                percent={(item.stock / 20) * 100}
                status="exception"
                showInfo={false}
              />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
