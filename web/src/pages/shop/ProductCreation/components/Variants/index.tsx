import { Card, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import VariantItem from "../VariantItem";

export default function Variants() {
  return (
    <Card
      title="Phân loại hàng"
      extra={
        <Form.List name="variants">
          {(_fields, { add }) => (
            <Button
              icon={<PlusOutlined />}
              onClick={() =>
                add({
                  name: "",
                  price: 0,
                  stock: 0,
                  images: [],
                })
              }
            >
              Thêm phân loại
            </Button>
          )}
        </Form.List>
      }
    >
      <Form.List name="variants">
        {(fields, { remove }) => (
          <>
            {fields.map((field) => (
              <VariantItem key={field.key} field={field} remove={remove} />
            ))}
          </>
        )}
      </Form.List>
    </Card>
  );
}
