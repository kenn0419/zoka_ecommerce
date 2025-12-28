import { Row, Col } from "antd";
import styles from "./CategorySection.module.scss";
import { categoryStore } from "../../../store/category.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories } = categoryStore();

  const handleClickCategory = (categorySlug: string) => {
    navigate(`/products?category=${categorySlug}`);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className={styles.categorySection}>
      <h3 className={styles.title}>Danh mục</h3>

      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col key={category.id} xs={8} sm={6} md={4} lg={3}>
            <div
              className={styles.categoryItem}
              onClick={() => handleClickCategory(category.slug)}
            >
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
