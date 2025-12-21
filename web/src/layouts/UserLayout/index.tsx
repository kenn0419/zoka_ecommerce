import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Footer from "../../components/layout/user/Footer";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../../components/layout/user/AppHeader";
import { Layout } from "antd";

const MainLayout = () => {
  return (
    <Layout className={styles.layout}>
      <AppHeader />
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
