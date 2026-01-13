import { Upload, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  thumbnail: File | null;
  setThumbnail: (file: File | null) => void;
}

export default function ProductImages({ thumbnail, setThumbnail }: Props) {
  return (
    <Card title="Hình ảnh sản phẩm" style={{ marginBottom: 16 }}>
      <Upload
        beforeUpload={(file) => {
          setThumbnail(file);
          return false;
        }}
        maxCount={1}
        accept="image/*"
      >
        <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
      </Upload>
      {thumbnail && (
        <img
          src={URL.createObjectURL(thumbnail)}
          alt="thumbnail"
          style={{ width: 100, marginTop: 8 }}
        />
      )}
    </Card>
  );
}
