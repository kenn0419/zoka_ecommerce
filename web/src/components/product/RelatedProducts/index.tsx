import styles from "./RelatedProducts.module.scss";
import ProductList from "../ProductList";
import { useRelatedProductsQuery } from "../../../queries/product.query";

export default function RelatedProducts({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const { data, isLoading } = useRelatedProductsQuery(categorySlug);

  if (isLoading) return <div>Đang tải sản phẩm liên quan...</div>;

  return (
    <div className={styles.related}>
      <h3>Sản phẩm liên quan</h3>
      <ProductList products={data?.items ?? []} />
    </div>
  );
}
