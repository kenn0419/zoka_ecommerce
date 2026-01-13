import { Layout, Dropdown, message } from "antd";
import styles from "./header.module.scss";
import Switcher from "../Switcher";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../../../queries/auth.query";
import { PATH } from "../../../../utils/path.util";

export default function Header() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          message.success("Đã đăng xuất");
          navigate(`/${PATH.USER}`);
        },
        onError: () => {
          message.error("Đăng xuất thất bại");
        },
      });
    }

    if (key === "profile") {
      navigate(`/${PATH.USER}/profile`);
    }
  };

  const items = [
    { key: "profile", label: "Tài khoản" },
    { key: "logout", label: "Đăng xuất" },
  ];
  return (
    <Layout.Header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>Seller Center</span>
      </div>

      <div className={styles.right}>
        <Switcher />

        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
        >
          <div className={styles.user}>
            <UserOutlined />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}
