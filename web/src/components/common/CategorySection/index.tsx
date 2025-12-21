import { Row, Col } from "antd";
import styles from "./CategorySection.module.scss";
import { categoryStore } from "../../../store/category.store";
import { useEffect } from "react";

const CategorySection = () => {
  const { categories, fetchCategories } = categoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className={styles.categorySection}>
      <h3 className={styles.title}>Danh mục</h3>

      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col key={category.id} xs={8} sm={6} md={4} lg={3}>
            <div className={styles.categoryItem}>
              <div className={styles.iconWrapper}>
                <img
                  src={category.thumbnailUrl}
                  alt={category.name}
                  loading="lazy"
                />
              </div>
              {/* <span className={styles.name}>{category.name}</span> */}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySection;
