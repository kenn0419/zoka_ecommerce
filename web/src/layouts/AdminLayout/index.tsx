import { Layout } from "antd";
import Sidebar from "../../components/layout/Sidebar";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.scss";

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
