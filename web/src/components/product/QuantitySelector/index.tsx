import { InputNumber } from "antd";
import styles from "./QuantitySelector.module.scss";

export default function QuantitySelector({ stock }: { stock: number }) {
  return (
    <div className={styles.qty}>
      <span>Số lượng</span>
      <InputNumber min={1} max={stock} defaultValue={1} />
      <span className={styles.stock}>{stock} sản phẩm có sẵn</span>
    </div>
  );
}
