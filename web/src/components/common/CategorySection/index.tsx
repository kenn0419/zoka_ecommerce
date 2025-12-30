import { Row, Col, Spin, Empty } from "antd";
import styles from "./CategorySection.module.scss";
import { useNavigate } from "react-router-dom";
import { useActiveCategoriesQuery } from "../../../queries/category.query";

const CategorySection = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useActiveCategoriesQuery(1, 20);

  if (isLoading) return <Spin />;

  if (!data || !data?.items || data?.items?.length === 0) {
    return <Empty description="Không có danh mục" />;
  }

  return (
    <div className={styles.categorySection}>
      <h3 className={styles.title}>Danh mục</h3>

      <Row gutter={[16, 16]}>
        {data.items.map((category) => (
          <Col key={category.id} xs={8} sm={6} md={4} lg={3}>
            <div
              className={styles.categoryItem}
              onClick={() => navigate(`/products?category=${category.slug}`)}
            >
              <div className={styles.iconWrapper}>
                <img
                  src={category.thumbnailUrl}
                  alt={category.name}
                  loading="lazy"
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySection;
