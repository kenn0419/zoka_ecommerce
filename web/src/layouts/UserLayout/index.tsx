import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Footer from "../../components/layout/user/Footer";
import { Content } from "antd/es/layout/layout";
import Header from "../../components/layout/user/Header";
import { Layout } from "antd";
import { useInitCart } from "../../hooks/useInitCart";

const MainLayout = () => {
  useInitCart();
  return (
    <Layout className={styles.layout}>
      <Header />
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
