import { Table, Tag, Image, Spin, Button, Rate } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { ProductStatus } from "../../../constant/product.constant";

interface ProductTableProps {
  data: IProductListItemResponse[];
  loading: boolean;
  onInfo: (productId: string) => void;
  onEdit: (productId: string) => void;
}

export default function ProductTable({
  data,
  loading,
  onInfo,
  onEdit,
}: ProductTableProps) {
  const columns: ColumnsType<IProductListItemResponse> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Image width={56} src={record.thumbnail} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>/{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      render: (_, r) => (
        <span>
          {r.minPrice.toLocaleString()} – {r.maxPrice.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "avgRating",
      render: (rating) => <Rate allowHalf disabled value={rating} />,
    },
    {
      title: "Kho",
      dataIndex: "hasStock",
      render: (s) =>
        s ? <Tag color="green">Còn hàng</Tag> : <Tag color="red">Hết hàng</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, r) => {
        if (r.status) {
          switch (r?.status) {
            case ProductStatus.ACTIVE:
              return <Tag color="green">Đang bán</Tag>;

            case ProductStatus.INACTIVE:
              return <Tag color="processing">Ngừng bán</Tag>;

            case ProductStatus.PENDING:
              return <Tag color="default">Đang duyệt</Tag>;

            case ProductStatus.REJECTED:
              return <Tag color="error">Bị từ chối</Tag>;

            default:
              return <Tag color="default">Không xác định</Tag>;
          }
        }
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record.id)} />
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => onInfo(record.id)}
          />
        </div>
      ),
    },
  ];

  if (loading) return <Spin />;

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
