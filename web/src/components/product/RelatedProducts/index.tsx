import { useEffect } from "react";
import styles from "./RelatedProducts.module.scss";
import { useProductStore } from "../../../store/product.store";
import ProductList from "../ProductList";

export default function RelatedProducts({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const { relatedProducts, fetchRelatedProducts } = useProductStore();

  useEffect(() => {
    fetchRelatedProducts(categorySlug);
  }, [categorySlug]);

  return (
    <div className={styles.related}>
      <h3>Sản phẩm liên quan</h3>
      <ProductList products={relatedProducts} />
    </div>
  );
}
