import { Card, Skeleton } from "antd";
import styles from "./ProductSkeletonCard.module.scss";

const ProductSkeletonCard = () => {
  return (
    <Card className={styles.card}>
      <Skeleton.Image className={styles.image} />
      <Skeleton active paragraph={{ rows: 2 }} title={false} />
    </Card>
  );
};

export default ProductSkeletonCard;
