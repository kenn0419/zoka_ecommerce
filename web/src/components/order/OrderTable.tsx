import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getStatusColor, renderStatus } from "../../utils/helper.util";
import dayjs from "dayjs";

type Props = {
  data: IOrderResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onEdit?: (order: IOrderResponse) => void;
  toolbar?: React.ReactNode[];
};

export default function OrderTable({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  toolbar,
}: Props) {
  return (
    <ProTable<IOrderResponse>
      rowKey="id"
      columns={[
        {
          title: "Mã đơn",
          dataIndex: "code",
        },
        {
          title: "Khách hàng",
          render: (_, record) => (
            <div>
              <div>{record.buyer.fullName}</div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {record.buyer.email}
              </div>
            </div>
          ),
        },
        {
          title: "Thanh toán",
          dataIndex: "paymentMethod",
        },
        {
          title: "Tổng tiền",
          dataIndex: "totalPrice",
          render: (_, record) => `₫${record.totalPrice.toLocaleString()}`,
        },
        {
          title: "Trạng thái",
          dataIndex: "status",
          render: (_, record) => (
            <Tag color={getStatusColor(record.status)}>
              {renderStatus(record.status)}
            </Tag>
          ),
        },
        {
          title: "Ngày tạo",
          dataIndex: "createAt",
          render: (_, record) =>
            dayjs(record.createAt).format("DD/MM/YYYY HH:mm"),
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
              Cập nhật
            </Button>,
          ],
        },
      ]}
      dataSource={data}
      loading={loading}
      search={false}
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
      rowClassName={(_record, index) =>
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }
    />
  );
}
