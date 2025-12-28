import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin } from "antd";

import styles from "./ProductDetail.module.scss";
import { useProductStore } from "../../../store/product.store";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductInfo from "../../../components/product/ProductInfo";
import ProductAction from "../../../components/product/ProductAction";
import ProductDescription from "../../../components/product/ProductDescription";
import RelatedProducts from "../../../components/product/RelatedProducts";
import VariantSelector from "../../../components/product/VariantSelector";
import QuantitySelector from "../../../components/product/QuantitySelector";

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const { loading, fetchProductDetail, product } = useProductStore();
  const [selectedVariant, setSelectedVariant] = useState<number>(0);

  useEffect(() => {
    if (productSlug) {
      fetchProductDetail(productSlug);
    }
  }, [productSlug]);

  if (loading || !product) return <Spin />;

  const variant = product.variants[selectedVariant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <ProductGallery images={variant.images} />
        <div className={styles.right}>
          <ProductInfo product={product} price={variant.price} />
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onChange={setSelectedVariant}
          />
          <QuantitySelector stock={variant.stock} />
          <ProductAction />
        </div>
      </div>
      <ProductDescription description={product.description} />
      <RelatedProducts categorySlug={product.category.slug} />
    </div>
  );
};

export default ProductDetailPage;
