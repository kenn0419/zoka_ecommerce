import { Card, Input, InputNumber, Upload, Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { IProductVariantCreaionRequest } from "../../../../../types/product.type";

interface Props {
  variant: IProductVariantCreaionRequest;
  variants: IProductVariantCreaionRequest[];
  setVariants: (v: IProductVariantCreaionRequest[]) => void;
  variantFiles: File[];
  setVariantFiles: (f: File[]) => void;
}

export default function VariantItem({
  variant,
  variants,
  setVariants,
  variantFiles,
  setVariantFiles,
}: Props) {
  const update = (key: keyof IProductVariantCreaionRequest, value: any) => {
    setVariants(
      variants.map((v) => (v.id === variant.id ? { ...v, [key]: value } : v))
    );
  };

  const uploadImage = (file: File) => {
    const index = variantFiles.length;

    setVariantFiles([...variantFiles, file]);
    update("images", [...variant.images, index]);

    return false;
  };

  return (
    <Card>
      <Form.Item
        label="Tên phân loại"
        name="variant.name"
        rules={[{ required: true, message: "Nhập tên phân loại" }]}
      >
        <Input
          placeholder="Màu đỏ..."
          value={variant.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Giá phân loại"
        name="variant.price"
        rules={[{ required: true, message: "Nhập giá phân loại" }]}
      >
        <InputNumber
          placeholder="24000"
          value={variant.price}
          onChange={(v) => update("price", v)}
          style={{ width: "100%", marginTop: 8 }}
        />
      </Form.Item>

      <Form.Item
        label="Số lượng"
        name="variant.stock"
        rules={[{ required: true, message: "Nhập số lượng phân loại" }]}
      >
        <InputNumber
          placeholder="Kho"
          value={variant.stock}
          onChange={(v) => update("stock", v)}
          style={{ width: "100%", marginTop: 8 }}
        />
      </Form.Item>

      <Upload beforeUpload={uploadImage} multiple>
        <Button icon={<UploadOutlined />}>Ảnh phân loại</Button>
      </Upload>
    </Card>
  );
}
