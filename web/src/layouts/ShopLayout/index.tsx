import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./ShopLayout.module.scss";
import Sidebar from "../../components/layout/shop/Sidebar";
import Header from "../../components/layout/shop/Header";
import Breadcrumb from "../../components/layout/shop/Breadcrumb";

const { Sider, Content } = Layout;

export default function ShopLayout() {
  return (
    <Layout className={styles.container}>
      <Sider width={230} className={styles.sidebar}>
        <Sidebar />
      </Sider>

      <Layout className={styles.main}>
        <Header />
        <div className={styles.contentWrapper}>
          <Breadcrumb />
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
}
