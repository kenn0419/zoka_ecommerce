import styles from "./ProductInfo.module.scss";
import type { IProductDetailResponse } from "../../../types/product.type";

interface ProductInfoProps {
  product: IProductDetailResponse;
  price: number;
}

export default function ProductInfo({ product, price }: ProductInfoProps) {
  return (
    <div className={styles.info}>
      <h1 className={styles.name}>{product.name}</h1>

      <div className={styles.meta}>
        ⭐ {product.avgRating} | Đã bán {1}
      </div>

      <div className={styles.price}>₫{price.toLocaleString()}</div>
    </div>
  );
}
