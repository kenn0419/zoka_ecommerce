import { Input } from "antd";
import { useSearchParams } from "react-router-dom";

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Input.Search
      placeholder="Tìm sản phẩm"
      allowClear
      defaultValue={searchParams.get("keyword") ?? ""}
      onSearch={(value) => {
        const params = new URLSearchParams(searchParams);
        value ? params.set("keyword", value) : params.delete("keyword");
        params.set("page", "1");
        setSearchParams(params);
      }}
      style={{ width: 220 }}
    />
  );
}
