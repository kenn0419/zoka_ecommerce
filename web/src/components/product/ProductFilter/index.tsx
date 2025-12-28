import { Checkbox } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductFilter.module.scss";

export default function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");

  const onPriceChange = (values: string[]) => {
    setSearchParams({
      category: category || "",
      price: values.join(","),
    });
  };

  return (
    <div className={styles.filter}>
      <h3>Lọc theo giá</h3>
      <Checkbox.Group
        options={[
          { label: "Dưới 2tr", value: "0-2000000" },
          { label: "2tr - 5tr", value: "2000000-5000000" },
        ]}
        onChange={onPriceChange}
      />
    </div>
  );
}
