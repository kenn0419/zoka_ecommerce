import { Select } from "antd";
import { useSearchParams } from "react-router-dom";

export default function PageSizeSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") ?? "10";

  return (
    <Select
      value={limit}
      style={{ width: 120 }}
      onChange={(value) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", value);
        params.set("page", "1");
        setSearchParams(params);
      }}
      options={[
        { label: "10 / trang", value: "10" },
        { label: "20 / trang", value: "20" },
        { label: "50 / trang", value: "50" },
      ]}
    />
  );
}
