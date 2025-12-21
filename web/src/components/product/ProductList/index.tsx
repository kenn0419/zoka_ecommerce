import { Row, Col, Empty } from "antd";
import styles from "./ProductList.module.scss";
import type { IProductResponse } from "../../../types/product.type";
import ProductSkeletonCard from "../ProductSkeletonCard";
import ProductCard from "../ProductCard";

interface ProductListProps {
  products: IProductResponse[];
  loading?: boolean;
  title?: string;
  skeletonCount?: number;
}

export default function ProductList({
  products,
  loading = false,
  title,
  skeletonCount = 12,
}: ProductListProps) {
  if (!loading && products.length === 0) {
    return <Empty description="Không có sản phẩm" />;
  }

  return (
    <div className={styles.productList}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <Row gutter={[16, 16]}>
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <Col key={i} xs={12} sm={8} md={6} lg={4}>
                <ProductSkeletonCard />
              </Col>
            ))
          : products.map((product) => (
              <Col key={product.id} xs={12} sm={8} md={6} lg={4}>
                <ProductCard product={product} />
              </Col>
            ))}
      </Row>
    </div>
  );
}
