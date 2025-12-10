import { Spin } from "antd";
import styles from "./LoadingFallback.module.scss";

export default function LoadingFallback() {
  return (
    <div className={styles.loadingWrapper}>
      <Spin size="large" />
      <span className={styles.text}>Đang tải...</span>
    </div>
  );
}
