import { Input, Select } from "antd";

export default function ProductFilters() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Input.Search placeholder="Tìm theo tên sản phẩm" />
      <Select
        placeholder="Trạng thái"
        style={{ width: 160 }}
        options={[
          { label: "Tất cả", value: "ALL" },
          { label: "Đang bán", value: "ACTIVE" },
          { label: "Ẩn", value: "INACTIVE" },
        ]}
      />
    </div>
  );
}
