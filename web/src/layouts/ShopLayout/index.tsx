import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/shop/AppSidebar";
import AppHeader from "../../components/shop/AppHeader";
import styles from "./ShopLayout.module.scss";
import AppBreadcrumb from "../../components/shop/AppBreadcrumb";

const { Sider, Content } = Layout;

export default function ShopLayout() {
  return (
    <Layout className={styles.container}>
      <Sider width={230} className={styles.sidebar}>
        <AppSidebar />
      </Sider>

      <Layout className={styles.main}>
        <AppHeader />
        <div className={styles.contentWrapper}>
          <AppBreadcrumb />
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
}
