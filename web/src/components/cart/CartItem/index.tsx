import { Checkbox, InputNumber } from "antd";
import styles from "./CartItem.module.scss";
import { useCartStore } from "../../../store/cart.store";

export default function CartItem({ item }: { item: any }) {
  const toggleItem = useCartStore((s) => s.toggleItem);
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className={styles.cartItem}>
      <div className={styles.checkbox}>
        <Checkbox
          checked={item.checked}
          disabled={!item.isAvailable}
          onChange={() => toggleItem(item.id)}
        />
      </div>

      <img src={item.imageUrl} className={styles.image} />

      <div className={styles.info}>
        <div className={styles.name}>{item.productName}</div>
        <div className={styles.variant}>{item.variantName}</div>
      </div>

      <div className={styles.price}>₫{item.priceSnapshot.toLocaleString()}</div>

      <InputNumber
        min={1}
        max={item.stockSnapshot}
        value={item.quantity}
        size="small"
        disabled={!item.isAvailable}
        onChange={(value) => {
          if (typeof value === "number") {
            setQty(item.id, value);
          }
        }}
      />

      <div className={styles.subtotal}>
        ₫{(item.priceSnapshot * item.quantity).toLocaleString()}
      </div>

      <button className={styles.remove}>Xóa</button>
    </div>
  );
}
