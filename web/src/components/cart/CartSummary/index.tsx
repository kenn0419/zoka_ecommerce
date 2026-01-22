import styles from "./CartSummary.module.scss";
import { useCartStore } from "../../../store/cart.store";
import { Button } from "antd";

export default function CartSummary() {
  const selectedCount = useCartStore(
    (s) => s.items.filter((i) => i.checked && i.isAvailable).length
  );

  const subtotal = useCartStore((s) =>
    s.items
      .filter((i) => i.checked && i.isAvailable)
      .reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0)
  );

  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <h3>Tạm tính ({selectedCount} sản phẩm)</h3>
        <span>₫{subtotal.toLocaleString()}</span>
      </div>

      <div className={styles.total}>
        <span>Tổng cộng</span>
        <span>₫{subtotal.toLocaleString()}</span>
      </div>

      <Button className={styles.checkout} disabled={!selectedCount}>
        Mua hàng
      </Button>
    </div>
  );
}
