import { Checkbox, InputNumber } from "antd";
import styles from "./CartItem.module.scss";

export default function CartItem({ item }: { item: any }) {
  return (
    <div className={styles.cartItem}>
      <div className={styles.checkbox}>
        <Checkbox />
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
      />

      <div className={styles.subtotal}>₫{item.subtotal.toLocaleString()}</div>

      <button className={styles.remove}>Xóa</button>
    </div>
  );
}
