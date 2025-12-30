import styles from "./HomePage.module.scss";
import BannerCarousel from "../../../components/layout/user/BannerCarousel";
import CategorySection from "../../../components/common/CategorySection";
import FlashSale from "../../../components/common/FlashSale";
import ProductList from "../../../components/product/ProductList";
import { useActiveProductsQuery } from "../../../queries/product.query";

const Home = () => {
  const { data, isLoading } = useActiveProductsQuery({ page: 1, limit: 12 });

  return (
    <div className={styles.home}>
      <BannerCarousel />
      <CategorySection />
      <FlashSale />
      <ProductList
        title="Gợi ý hôm nay"
        products={data?.items ?? []}
        loading={isLoading}
        skeletonCount={12}
      />
    </div>
  );
};

export default Home;
