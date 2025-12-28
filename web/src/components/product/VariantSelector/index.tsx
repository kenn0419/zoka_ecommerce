import { Button } from "antd";
import styles from "./VariantSelector.module.scss";

export default function VariantSelector({
  variants,
  selected,
  onChange,
}: {
  variants: any[];
  selected: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className={styles.variant}>
      <div className={styles.label}>Phân loại</div>

      <div className={styles.options}>
        {variants.map((v, i) => (
          <Button
            key={v.id}
            className={`${styles.option} ${
              i === selected ? styles.active : ""
            }`}
            onClick={() => onChange(i)}
          >
            {v.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
