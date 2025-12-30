import styles from "./CartSummary.module.scss";
import { useCartStore } from "../../../store/cart.store";

export default function CartSummary() {
  const { summary } = useCartStore();
  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span>Tạm tính</span>
        <span>₫{summary.subtotal.toLocaleString()}</span>
      </div>

      <div className={styles.total}>
        <span>Tổng cộng</span>
        <span>₫{summary.subtotal.toLocaleString()}</span>
      </div>

      <button className={styles.checkout}>Mua hàng</button>
    </div>
  );
}
