import styles from "./RelatedProducts.module.scss";
import { useRelatedProductsQuery } from "../../../queries/product.query";
import ProductGrid from "../ProductGrid";

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
      <ProductGrid products={data?.items ?? []} />
    </div>
  );
}
