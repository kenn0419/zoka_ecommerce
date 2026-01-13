import RegisterShopForm from "../../../components/shop/RegisterShopForm";
import styles from "./ShopRegister.module.scss";

export default function RegisterShopPage() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Đăng ký bán hàng</div>
      <RegisterShopForm />
    </div>
  );
}
