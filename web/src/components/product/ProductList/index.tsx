import { Row, Col, Pagination } from "antd";
import ProductFilter from "../ProductFilter";
import ProductSort from "../ProductSort";
import ProductGrid from "../ProductGrid";

interface ProductListProps {
  title: string;
  products: IProductListItemResponse[];
  meta: IPaginatedResponse<IProductListItemResponse>["meta"];
  isLoading: boolean;
  filter?: IProductFilterQueries;
}

export default function ProductList({
  title,
  products,
  meta,
  isLoading,
  filter,
}: ProductListProps) {
  return (
    <Row gutter={16}>
      <Col span={5}>
        <ProductFilter />
      </Col>

      <Col span={19}>
        <ProductSort />

        <ProductGrid
          title={title}
          products={products ?? []}
          loading={isLoading}
        />

        <Pagination
          current={filter?.page}
          pageSize={filter?.limit}
          total={meta?.totalItems ?? 0}
          // onChange={(page) => setFilter({ page })}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Col>
    </Row>
  );
}
