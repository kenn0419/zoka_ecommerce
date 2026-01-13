import { Select } from "antd";
import styles from "./Switcher.module.scss";

export default function Switcher() {
  // fake data, sau này lấy từ store / query
  const shops = [
    { id: "1", name: "Shop A" },
    { id: "2", name: "Shop B" },
  ];

  return (
    <Select
      className={styles.switcher}
      value={shops[0].id}
      options={shops.map((s) => ({
        value: s.id,
        label: s.name,
      }))}
    />
  );
}
