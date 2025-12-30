import { Layout, Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import { useAuthStore } from "../../../../store/auth.store";
import { useCartStore } from "../../../../store/cart.store";
import logo from "../../../../assets/images/logo-zoka-ecommerce.png";
import { Link } from "react-router-dom";
import { PATH } from "../../../../utils/path.util";
import SearchBar from "../../../common/SearchBar";

const { Header } = Layout;

export default function AppHeader() {
  const { user } = useAuthStore();
  const { summary } = useCartStore();

  return (
    <Header className={styles.header}>
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
            <UserOutlined className={styles.icon} />
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
    </Header>
  );
}
