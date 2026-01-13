import { Pagination as AntPagination } from "antd";

interface Props {
  page: number;
  limit: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, limit, total, onChange }: Props) {
  return (
    <AntPagination
      current={page}
      pageSize={limit}
      total={total}
      onChange={onChange}
      showSizeChanger={false}
      style={{ marginTop: 16, textAlign: "right" }}
    />
  );
}
