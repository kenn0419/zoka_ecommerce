import { Button } from "antd";
import styles from "./ProductAction.module.scss";

export default function ProductAction() {
  return (
    <div className={styles.action}>
      <Button className={styles.cart}>Thêm vào giỏ hàng</Button>
      <Button type="primary" className={styles.buy}>
        Mua ngay
      </Button>
    </div>
  );
}
