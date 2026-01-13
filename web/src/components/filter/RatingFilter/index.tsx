import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import styles from "./RatingFilter.module.scss";

const ratings = [5, 4, 3, 2, 1];

export default function RatingFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentRating = Number(searchParams.get("rating") || 0);

  const applyRating = (rating: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("rating", String(rating));
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className={styles.filterGroup}>
      <h4 className={styles.groupTitle}>Đánh giá</h4>

      <div className={styles.ratingPillList}>
        {ratings.map((r) => {
          const active = currentRating === r;

          return (
            <div
              key={r}
              className={`${styles.ratingPill} ${active ? styles.active : ""}`}
              onClick={() => applyRating(r)}
            >
              {Array.from({ length: 5 }).map((_, i) =>
                i < r ? <StarFilled key={i} /> : <StarOutlined key={i} />
              )}
              <span className={styles.ratingText}>trở lên</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
