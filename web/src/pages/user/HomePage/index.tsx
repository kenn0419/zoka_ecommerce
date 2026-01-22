import styles from "./HomePage.module.scss";
import BannerCarousel from "../../../components/layout/user/BannerCarousel";
import CategorySection from "../../../components/common/CategorySection";
import FlashSale from "../../../components/common/FlashSale";
import ProductList from "../../../components/product/ProductList";
import { useActiveProductsQuery } from "../../../queries/product.query";
import { useAvailableCouponsQuery } from "../../../queries/coupon.query";
import CouponSection from "../../../components/coupon/CouponSection";
import { useAuthStore } from "../../../store/auth.store";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const { data: products, isLoading: productsLoading } = useActiveProductsQuery(
    { page: 1, limit: 12 },
  );
  const { data: coupons, isLoading: couponsLoading } = useAvailableCouponsQuery(
    {
      page: 1,
      limit: 5,
    },
    !!user,
  );

  return (
    <div className={styles.home}>
      <BannerCarousel />
      <CouponSection
        coupons={coupons?.items ?? []}
        isLoading={couponsLoading}
      />
      <CategorySection />
      <FlashSale />
      <ProductList
        meta={coupons.meta}
        title="Gợi ý hôm nay"
        products={products?.items ?? []}
        isLoading={productsLoading}
        // skeletonCount={12}
      />
    </div>
  );
}
