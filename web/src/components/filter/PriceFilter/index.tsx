import { Input, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./PriceFilter.module.scss";

export default function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const minParam = searchParams.get("minPrice");
  const maxParam = searchParams.get("maxPrice");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setMinPrice(minParam ?? "");
    setMaxPrice(maxParam ?? "");
  }, [minParam, maxParam]);

  const isInvalid = Boolean(
    minPrice && maxPrice && Number(minPrice) > Number(maxPrice)
  );

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams);

    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");

    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className={styles.filterGroup}>
      <h4 className={styles.groupTitle}>Khoảng giá</h4>

      {/* INPUT */}
      <div className={styles.priceInputRow}>
        <Input
          placeholder="₫ TỪ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
        />
        <span className={styles.priceSeparator}>—</span>
        <Input
          placeholder="₫ ĐẾN"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <Button
        type="primary"
        block
        disabled={isInvalid}
        className={styles.applyButton}
        onClick={applyPrice}
      >
        ÁP DỤNG
      </Button>

      {isInvalid && (
        <div className={styles.errorText}>
          Giá tối thiểu không được lớn hơn giá tối đa
        </div>
      )}
    </div>
  );
}
