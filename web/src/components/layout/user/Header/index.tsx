import { Layout, Badge, Dropdown, message } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import { useAuthStore } from "../../../../store/auth.store";
import { useCartStore } from "../../../../store/cart.store";
import logo from "../../../../assets/images/logo-zoka-ecommerce.png";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../../utils/path.util";
import SearchBar from "../../../common/SearchBar";
import { useLogoutMutation } from "../../../../queries/auth.query";

export default function Header() {
  const { user } = useAuthStore();
  const { summary } = useCartStore();

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
      <Link to={`/${PATH.USER}`} className={styles.logo}>
        <img src={logo} />
      </Link>

      <SearchBar />

      <div className={styles.actions}>
        {user ? (
          <>
            <Badge count={summary.totalItems || 0}>
              <Link to={`/${PATH.CART}`}>
                <ShoppingCartOutlined className={styles.icon} />
              </Link>
            </Badge>
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
            >
              <UserOutlined className={styles.icon} />
            </Dropdown>
          </>
        ) : (
          <>
            <Link
              to={`/${PATH.AUTH}/${PATH.SIGNIN}`}
              className={styles.authLink}
            >
              Đăng nhập
            </Link>
            <Link
              to={`/${PATH.AUTH}/${PATH.SIGNUP}`}
              className={styles.authLink}
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </Layout.Header>
  );
}
