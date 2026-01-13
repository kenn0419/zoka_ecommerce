import { Button } from "antd";
import styles from "./SubmitBar.module.scss";

interface SubmitBarProps {
  loading: boolean;
}

export default function SubmitBar({ loading }: SubmitBarProps) {
  return (
    <div className={styles.bar}>
      <Button>Hủy</Button>
      <Button type="primary" htmlType="submit" loading={loading}>
        Đăng bán
      </Button>
    </div>
  );
}
