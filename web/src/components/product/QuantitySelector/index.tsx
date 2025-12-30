import { InputNumber } from "antd";
import styles from "./QuantitySelector.module.scss";

interface QuantitySelectorProps {
  stock: number;
  quantity: number;
  updateQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuantitySelector({
  stock,
  quantity,
  updateQuantity,
}: QuantitySelectorProps) {
  return (
    <div className={styles.qty}>
      <span>Số lượng</span>
      <InputNumber
        min={1}
        max={stock}
        value={quantity}
        defaultValue={1}
        onChange={(e) => updateQuantity(Number(e))}
      />
      <span className={styles.stock}>{stock} sản phẩm có sẵn</span>
    </div>
  );
}
