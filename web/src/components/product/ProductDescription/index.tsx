import styles from "./ProductDescription.module.scss";

export default function ProductDescription({
  description,
}: {
  description: string;
}) {
  return (
    <div className={styles.description}>
      <h3>Mô tả sản phẩm</h3>
      <p>{description}</p>
    </div>
  );
}
