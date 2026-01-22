import styles from "./ShopPage.module.scss";
import { useParams, useSearchParams } from "react-router-dom";
import parseNumberParam from "../../../helper/parseNumber.helper";
import ShopHeader from "./components/ShopHeader";
import { Breadcrumb, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useActiveShopProducts } from "../../../queries/product.query";
import ProductList from "../../../components/product/ProductList";
import { useDetailShopBySlugQuery } from "../../../queries/shop.query";
import CouponSection from "../../../components/coupon/CouponSection";
import { useAvailableCouponsByShopSlugQuery } from "../../../queries/coupon.query";
import { useAuthStore } from "../../../store/auth.store";

export default function ShopPage() {
  const user = useAuthStore((state) => state.user);
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: IProductFilterQueries = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: 20,
    sort: searchParams.get("sort") ?? undefined,
    minPrice: parseNumberParam(searchParams.get("minPrice")),
    maxPrice: parseNumberParam(searchParams.get("maxPrice")),
    rating: parseNumberParam(searchParams.get("rating")),
  };

  const { data: shopData, isLoading: shopLoading } = useDetailShopBySlugQuery(
    slug!,
  );

  const { data: couponsData, isLoading: couponLoading } =
    useAvailableCouponsByShopSlugQuery(
      slug!,
      {
        page: 1,
        limit: 5,
      },
      !!user,
    );

  const { data: productsData, isLoading: productLoading } =
    useActiveShopProducts(slug!, filter);

  return (
    <Layout className={styles.wrapper}>
      <Content className={styles.content}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Shop</Breadcrumb.Item>
        </Breadcrumb>
      </Content>
      <ShopHeader shop={shopData!} isLoading={shopLoading} />
      <CouponSection coupons={couponsData?.items} isLoading={couponLoading} />
      <ProductList
        title="Danh sách sản phẩm"
        products={productsData?.items}
        meta={productsData?.meta}
        isLoading={productLoading}
        filter={filter}
      />
    </Layout>
  );
}
