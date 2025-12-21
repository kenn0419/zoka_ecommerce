import { Layout, Input, Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>MyShop</div>

      <Input.Search placeholder="Tìm sản phẩm..." className={styles.search} />

      <div className={styles.actions}>
        <Badge count={3}>
          <ShoppingCartOutlined className={styles.icon} />
        </Badge>
        <UserOutlined className={styles.icon} />
      </div>
    </Header>
  );
}
