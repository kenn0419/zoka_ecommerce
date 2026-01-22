import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Tag } from "antd";
import CouponStatusSwitcher from "../CouponStatusSwitcher";
import CouponUpdateDrawer from "../CouponUpdateDrawer";
import { CouponSort } from "../../../../../constant/coupon.constant";
import dayjs from "dayjs";

type Props = {
  data: ICouponResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onSortChange: (sort: string) => void;
  onSearch: (value: string) => void;
  toolbar: React.ReactNode[];
};

export default function CouponTable({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onSortChange,
  toolbar,
}: Props) {
  const columns: ProColumns<ICouponResponse>[] = [
    {
      title: "Code",
      dataIndex: "code",
      sorter: true,
    },
    {
      title: "Discount",
      render: (_, record) =>
        record.type === "PERCENT"
          ? `${record.discount}%`
          : `${record.discount}₫`,
    },
    {
      title: "Start At",
      render: (_, record) => dayjs(record?.startAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End At",
      render: (_, record) => dayjs(record?.endAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Usage",
      render: (_, record) => `${record.usedCount}/${record.usageLimit ?? "∞"}`,
    },
    {
      title: "Scope",
      dataIndex: "scope",
      render: (scope) => <Tag>{scope}</Tag>,
    },
    {
      title: "Status",
      render: (_, record) => <CouponStatusSwitcher coupon={record} />,
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => [
        <CouponUpdateDrawer key="edit" coupon={record} />,
      ],
    },
  ];

  return (
    <ProTable
      rowKey="id"
      headerTitle="Coupon Management"
      loading={loading}
      search={false}
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize: limit,
        total,
        onChange: onPageChange,
      }}
      onChange={(_, __, sorter) => {
        if (!Array.isArray(sorter) && sorter.field === "code") {
          onSortChange(
            sorter.order === "ascend"
              ? CouponSort.START_AT_ASC
              : CouponSort.START_AT_DESC
          );
        }
      }}
      toolBarRender={() => toolbar}
    />
  );
}
