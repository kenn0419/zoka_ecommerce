import { Button } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductFilter.module.scss";
import { FilterOutlined } from "@ant-design/icons";
import RatingFilter from "../../filter/RatingFilter";
import PriceFilter from "../../filter/PriceFilter";

export default function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";

  const onClearFilters = () => {
    const newParams = new URLSearchParams();
    if (category) newParams.set("category", category);
    setSearchParams(newParams);
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filterHeader}>
        <FilterOutlined /> <span>BỘ LỌC TÌM KIẾM</span>
      </div>

      <PriceFilter />

      <RatingFilter />

      <Button block onClick={onClearFilters}>
        Xóa filter
      </Button>
    </div>
  );
}
