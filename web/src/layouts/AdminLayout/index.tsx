import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/admin/Sidebar";
import styles from "./AdminLayout.module.scss";
import Header from "../../components/layout/admin/Header";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className={styles.wrapper}>
      <Sidebar />

      <Layout>
        <Header />

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
