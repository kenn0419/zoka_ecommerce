import { Outlet } from "react-router-dom";
import styles from "./UserLayout.module.scss";
import Footer from "../../components/layout/user/Footer";
import { Content } from "antd/es/layout/layout";
import Header from "../../components/layout/user/Header";
import { Layout } from "antd";
import { useInitCartSummary } from "../../hooks/useInitCartSummary";

export default function UserLayout() {
  useInitCartSummary();
  return (
    <Layout className={styles.layout}>
      <Header />
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
