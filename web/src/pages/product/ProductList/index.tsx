import { useSearchParams } from "react-router-dom";
import {
  useActiveProductsByCategoryQuery,
  useActiveProductsQuery,
} from "../../../queries/product.query";
import ProductList from "../../../components/product/ProductList";
import parseNumberParam from "../../../helper/parseNumber.helper";

const ProductListPage = () => {
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

  const isSearch = Boolean(filter.search);

  const query = isSearch
    ? useActiveProductsQuery(filter)
    : useActiveProductsByCategoryQuery(filter.category ?? "", filter);

  return (
    <ProductList
      title="Danh sách sản phẩm"
      products={query?.data?.items}
      meta={query?.data?.meta}
      isLoading={query?.isLoading}
      filter={filter}
    />
  );
};

export default ProductListPage;
