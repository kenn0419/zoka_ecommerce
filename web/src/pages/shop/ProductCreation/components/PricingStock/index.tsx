import { Card, Form, InputNumber } from "antd";

export default function PricingStock() {
  return (
    <Card title="Giá & Kho hàng" style={{ marginBottom: 16 }}>
      <Form.Item label="Giá bán" name="price" rules={[{ required: true }]}>
        <InputNumber
          min={0}
          style={{ width: 200 }}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        />
      </Form.Item>

      <Form.Item
        label="Số lượng tồn kho"
        name="stock"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: 200 }} />
      </Form.Item>
    </Card>
  );
}
