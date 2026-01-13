import { Row, Col, Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import type { IProductFilterRequest } from "../../../types/product.type";
import {
  useActiveProductsByCategoryQuery,
  useActiveProductsQuery,
} from "../../../queries/product.query";
import ProductSort from "../../../components/product/ProductSort";
import ProductList from "../../../components/product/ProductList";
import ProductFilter from "../../../components/product/ProductFilter";
import parseNumberParam from "../../../helper/parseNumber.helper";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: IProductFilterRequest = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: 20,
    sort: searchParams.get("sort") ?? undefined,
    minPrice: parseNumberParam(searchParams.get("minPrice")),
    maxPrice: parseNumberParam(searchParams.get("maxPrice")),
    rating: parseNumberParam(searchParams.get("rating")),
  };

  const isSearch = Boolean(filter.search);

  const query = isSearch
    ? useActiveProductsQuery(filter)
    : useActiveProductsByCategoryQuery(filter.category ?? "", filter);

  return (
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

        <Pagination
          current={filter.page}
          pageSize={filter.limit}
          total={query.data?.meta.totalItems ?? 0}
          // onChange={(page) => setFilter({ page })}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Col>
    </Row>
  );
};

export default ProductListPage;
