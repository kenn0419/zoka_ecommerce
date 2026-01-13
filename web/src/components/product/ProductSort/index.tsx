import { Select } from "antd";
import { useSearchParams } from "react-router-dom";

export default function ProductSort() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <Select
      value={searchParams.get("sort") ?? "newest"}
      onChange={updateSort}
      options={[
        { label: "Mới nhất", value: "newest" },
        { label: "Cũ nhất", value: "oldest" },
        { label: "Giá tăng dần", value: "price_asc" },
        { label: "Giá giảm dần", value: "price_desc" },
        { label: "Đánh giá cao", value: "rating_desc" },
      ]}
    />
  );
}
