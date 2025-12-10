import { Layout, Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./header.module.scss";
import { authStore } from "../../store/auth.store";

export default function AppHeader() {
  const { user, logout } = authStore();

  const items = [{ key: "logout", label: "Đăng xuất", onClick: logout }];

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.title}>Shopee Seller Center - Quản lý Shop</div>
      <Dropdown menu={{ items }}>
        <div className={styles.user}>
          <Avatar icon={<UserOutlined />} />
          <span>{user?.fullName}</span>
        </div>
      </Dropdown>
    </Layout.Header>
  );
}
