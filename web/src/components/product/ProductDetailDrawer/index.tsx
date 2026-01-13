import {
  Drawer,
  Image,
  Rate,
  Divider,
  Spin,
  Tag,
  Space,
  Typography,
  Card,
} from "antd";
import { useProductDetailByIdQuery } from "../../../queries/product.query";

const { Title, Text, Paragraph } = Typography;

interface Props {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailDrawer({
  productId,
  open,
  onClose,
}: Props) {
  const { data, isLoading } = useProductDetailByIdQuery(productId!);

  return (
    <Drawer
      title="Chi tiết sản phẩm"
      open={open}
      onClose={onClose}
      width={760}
      destroyOnHidden
    >
      {isLoading || !data ? (
        <Spin />
      ) : (
        <>
          <Space align="start" size={16}>
            <Image
              src={data.thumbnail}
              width={120}
              height={120}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />

            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>
                {data.name}
              </Title>

              <Space>
                <Rate allowHalf disabled value={data.avgRating} />
                <Text type="secondary">
                  {data.avgRating?.toFixed(1) ?? "0.0"}
                </Text>
              </Space>

              <Space>
                <Tag color={data.hasStock ? "green" : "red"}>
                  {data.hasStock ? "Còn hàng" : "Hết hàng"}
                </Tag>
                <Text type="secondary">
                  {data.minPrice.toLocaleString()}đ -{" "}
                  {data.maxPrice.toLocaleString()}đ
                </Text>
              </Space>
            </Space>
          </Space>

          <Divider />

          {/* DESCRIPTION */}
          <Title level={5}>Mô tả</Title>
          <Paragraph>{data.description || "Không có mô tả"}</Paragraph>

          <Divider />

          {/* VARIANTS */}
          <Title level={5}>Biến thể</Title>

          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {data.variants.map((v) => (
              <Card
                key={v.id}
                size="small"
                style={{ borderRadius: 8 }}
                bodyStyle={{ padding: 12 }}
              >
                <Space align="start" size={16} style={{ width: "100%" }}>
                  <Space direction="vertical" size={4} style={{ flex: 1 }}>
                    <Text strong>{v.name}</Text>
                    <Text>Giá: {v.price.toLocaleString()} đ</Text>
                    <Text>Kho: {v.stock}</Text>
                  </Space>

                  <Space size={8} wrap>
                    {v.images.map((img) => (
                      <Image
                        key={img.id}
                        src={img.imageUrl}
                        width={64}
                        height={64}
                        style={{
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ))}
                  </Space>
                </Space>
              </Card>
            ))}
          </Space>
        </>
      )}
    </Drawer>
  );
}
