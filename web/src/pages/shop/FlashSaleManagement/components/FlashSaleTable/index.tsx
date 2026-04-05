import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Badge } from "antd";
import dayjs from "dayjs";

type Props = {
  data: IFlashSaleResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  toolbar: React.ReactNode[];
};

const statusMap: Record<string, { color: string; text: string }> = {
  UPCOMING: { color: "blue", text: "Sắp diễn ra" },
  ACTIVE: { color: "green", text: "Đang diễn ra" },
  ENDED: { color: "default", text: "Đã kết thúc" },
};

export default function FlashSaleTable({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  toolbar,
}: Props) {
  const columns: ProColumns<IFlashSaleResponse>[] = [
    {
      title: "Tên chương trình",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Thời gian bắt dầu",
      dataIndex: "startTime",
      render: (val) => dayjs(val as string).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      render: (val) => dayjs(val as string).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Số sản phẩm",
      render: (_, record) => record.items?.length ?? 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const s = statusMap[status as string] || { color: "default", text: status };
        return <Badge color={s.color} text={s.text} />;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "dateTime",
      hideInSearch: true,
    },
  ];

  return (
    <ProTable
      rowKey="id"
      headerTitle="Quản lý Flash Sale"
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
      toolBarRender={() => toolbar}
    />
  );
}
