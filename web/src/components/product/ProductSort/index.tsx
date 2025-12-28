import { Select } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductSort.module.scss";

export default function ProductSort() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "popular";

  return (
    <div className={styles.sort}>
      <Select
        value={sort}
        options={[
          { label: "Phổ biến", value: "popular" },
          { label: "Giá thấp → cao", value: "price_asc" },
          { label: "Giá cao → thấp", value: "price_desc" },
        ]}
        onChange={(value) =>
          setSearchParams({ ...Object.fromEntries(searchParams), sort: value })
        }
      />
    </div>
  );
}
