import styles from "./HomePage.module.scss";
import BannerCarousel from "../../../components/layout/user/BannerCarousel";
import CategorySection from "../../../components/common/CategorySection";
import FlashSale from "../../../components/common/FlashSale";
import { useEffect } from "react";
import ProductList from "../../../components/product/ProductList";
import { useProductStore } from "../../../store/product.store";

const Home = () => {
  const { products, fetchActiveProducts, loading } = useProductStore();

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  return (
    <div className={styles.home}>
      <BannerCarousel />
      <CategorySection />
      <FlashSale />
      <ProductList
        title="Gợi ý hôm nay"
        products={products}
        loading={loading}
        skeletonCount={12}
      />
    </div>
  );
};

export default Home;
