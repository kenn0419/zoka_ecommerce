import { Layout, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/admin/Sidebar";
import styles from "./AdminLayout.module.scss";
import { PATH } from "../../utils/path.util";

const { Header, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout className={styles.wrapper}>
      <Sidebar />

      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className={styles.backBtn}
            onClick={() => navigate(`/${PATH.USER}`)}
          >
            Về trang người dùng
          </Button>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
