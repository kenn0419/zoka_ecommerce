import { Button, message } from "antd";
import styles from "./ProductAction.module.scss";
import { useAuthStore } from "../../../store/auth.store";
import { cartService } from "../../../services/cart.service";

interface ProductActionProps {
  variantId: string;
  quantity: number;
}

export default function ProductAction({
  variantId,
  quantity,
}: ProductActionProps) {
  const { user } = useAuthStore();

  const handleAddToCart = async () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      await cartService.addToCart({ variantId, quantity });
      message.success("Thêm sản phẩm vào giỏ hàng thành công.");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ??
          "Không thể thêm sản phẩm vào giỏ hàng."
      );
    }
  };

  return (
    <div className={styles.action}>
      <Button className={styles.cart} onClick={handleAddToCart}>
        Thêm vào giỏ hàng
      </Button>
      <Button type="primary" className={styles.buy}>
        Mua ngay
      </Button>
    </div>
  );
}
