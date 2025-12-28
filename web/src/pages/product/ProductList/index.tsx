import { Row, Col } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useProductStore } from "../../../store/product.store";
import styles from "./ProductList.module.scss";
import ProductFilter from "../../../components/product/ProductFilter";
import ProductSort from "../../../components/product/ProductSort";
import ProductList from "../../../components/product/ProductList";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const { products, fetchActiveProducts, fetchProductsByCategory } =
    useProductStore();

  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const sort = searchParams.get("sort") ?? "id_desc";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  useEffect(() => {
    if (keyword) {
      fetchActiveProducts(page, limit, keyword, sort);
    } else {
      fetchProductsByCategory(category ?? "", page, limit, undefined, sort);
    }
  }, [category, keyword, sort, page]);

  return (
    <div className={styles.wrapper}>
      <Row gutter={16}>
        <Col span={5}>
          <ProductFilter />
        </Col>
        <Col span={19}>
          <ProductSort />
          <ProductList products={products} />
        </Col>
      </Row>
    </div>
  );
};

export default ProductListPage;
