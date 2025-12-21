import { Card } from "antd";
import styles from "./ProductCard.module.scss";
import type { IProductResponse } from "../../../types/product.type";

interface ProductCardProps {
  product: IProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      hoverable
      className={styles.card}
      cover={<img src={product.thumbnail} alt={product.name} />}
    >
      <h4 className={styles.name}>{product.name}</h4>
      <p className={styles.price}>{product.price.toLocaleString()} ₫</p>
    </Card>
  );
}
