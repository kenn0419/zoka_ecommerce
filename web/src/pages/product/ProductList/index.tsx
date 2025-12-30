import { Row, Col } from "antd";
import { useSearchParams } from "react-router-dom";
import ProductFilter from "../../../components/product/ProductFilter";
import ProductSort from "../../../components/product/ProductSort";
import ProductList from "../../../components/product/ProductList";
import styles from "./ProductList.module.scss";
import {
  useActiveProductsQuery,
  useProductsByCategoryQuery,
} from "../../../queries/product.query";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort") ?? "id_desc";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const isSearch = Boolean(keyword);
  const isCategory = Boolean(category && !keyword);

  const activeProductsQuery = useActiveProductsQuery(
    {
      page,
      limit,
      search: keyword ?? undefined,
      sort,
    },
    {
      enabled: isSearch || !category,
    }
  );

  const categoryProductsQuery = useProductsByCategoryQuery(
    category ?? "",
    { page, limit, sort },
    {
      enabled: isCategory,
    }
  );

  const query = isCategory ? categoryProductsQuery : activeProductsQuery;

  return (
    <div className={styles.wrapper}>
      <Row gutter={16}>
        <Col span={5}>
          <ProductFilter />
        </Col>
        <Col span={19}>
          <ProductSort />
          <ProductList
            products={query.data?.items ?? []}
            loading={query.isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductListPage;
