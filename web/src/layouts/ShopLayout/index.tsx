import { Layout } from "antd";
import { Outlet, useParams } from "react-router-dom";
import styles from "./ShopLayout.module.scss";

import Sidebar from "../../components/layout/shop/Sidebar";
import Header from "../../components/layout/shop/Header";
import Breadcrumb from "../../components/layout/shop/Breadcrumb";

const { Sider, Content } = Layout;

export default function ShopLayout() {
  const { shopId } = useParams();

  return (
    <Layout className={styles.root}>
      <Header />

      <Layout className={styles.body}>
        <Sider width={220} className={styles.sidebar}>
          <Sidebar />
        </Sider>

        <Layout className={styles.main}>
          {/* <Breadcrumb /> */}
          <Content className={styles.content}>
            <div className={styles.pageContainer}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
