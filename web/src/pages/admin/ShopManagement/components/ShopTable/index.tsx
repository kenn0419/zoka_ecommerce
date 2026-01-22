import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Avatar } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  SHOP_STATUS_COLOR,
  SHOP_STATUS_LABEL,
} from "../../../../../constant/shop.constant";

type ShopTableProps = {
  data: IShopResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onEdit?: (shop: IShopResponse) => void;
  toolbar?: React.ReactNode[];
};

export const ShopTable: React.FC<ShopTableProps> = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onSortChange,
  onEdit,
  toolbar,
}) => {
  const renderStatus = (status: IShopStatus) => (
    <Tag color={SHOP_STATUS_COLOR[status]}>{SHOP_STATUS_LABEL[status]}</Tag>
  );
  return (
    <ProTable<IShopResponse>
      rowKey="id"
      columns={[
        {
          title: "Shop",
          dataIndex: "name",
          render: (_, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar size={40} src={record.logoUrl} />
              <div>
                <div style={{ fontWeight: 500 }}>{record.name}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{record.slug}</div>
              </div>
            </div>
          ),
        },
        {
          title: "Chủ Shop",
          dataIndex: ["owner", "fullName"],
          render: (_, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar size={32} src={record.owner.avatarUrl} />
              <div>
                <div>{record.owner.fullName}</div>
                <div style={{ fontSize: 12, color: "#999" }}>
                  {record.owner.email}
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          render: (status) => renderStatus(status as IShopStatus),
        },
        {
          title: "Hành động",
          valueType: "option",
          render: (_, record) => [
            <Button
              key="edit"
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit && onEdit(record)}
            >
              Sửa
            </Button>,
            <Button
              key="delete"
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete shop", record.id)}
            >
              Xóa
            </Button>,
          ],
        },
      ]}
      dataSource={data}
      loading={loading}
      search={false} // search dùng toolbar bên trên
      pagination={{
        current: page,
        pageSize: limit,
        total,
        showSizeChanger: true,
        onChange: (p, l) => onPageChange(p, l || limit),
      }}
      toolBarRender={() => toolbar ?? []}
      options={{
        fullScreen: true,
        reload: true,
        density: true,
      }}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }
    />
  );
};
