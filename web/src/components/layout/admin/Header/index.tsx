import {
  Layout,
  Button,
  Dropdown,
  Avatar,
  Badge,
  type MenuProps,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";
import { PATH } from "../../../../utils/path.util";
import { useLogoutMutation } from "../../../../queries/auth.query";

export default function Header() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const notificationItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Bạn có đơn hàng mới",
    },
    {
      key: "2",
      label: "Coupon sắp hết hạn",
    },
    {
      key: "3",
      label: "Sản phẩm bị hết hàng",
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Đăng xuất",
      onClick: async () => {
        logoutMutation.mutate(undefined, {
          onSuccess: () => {
            message.success("Đã đăng xuất");
          },
          onError: () => {
            message.error("Đăng xuất thất bại");
          },
        });
        navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
      },
    },
  ];

  return (
    <Layout.Header className={styles.header}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className={styles.backBtn}
        onClick={() => navigate(`/${PATH.USER}`)}
      >
        Về trang người dùng
      </Button>

      {/* Right */}
      <div className={styles.right}>
        {/* Notification */}
        <Dropdown
          menu={{ items: notificationItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={3} offset={[-4, 4]}>
            <Button
              type="text"
              icon={<BellOutlined />}
              className={styles.iconBtn}
            />
          </Badge>
        </Dropdown>

        {/* User menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className={styles.user}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span className={styles.username}>Seller</span>
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}
