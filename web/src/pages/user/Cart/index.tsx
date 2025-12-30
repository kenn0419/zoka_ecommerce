// pages/Cart/CartPage.tsx
import { Row, Col } from "antd";
import { useCartStore } from "../../../store/cart.store";
import EmptyCart from "../../../components/cart/EmptyCard.tsx";
import CartItem from "../../../components/cart/CartItem/index.tsx";
import CartSummary from "../../../components/cart/CartSummary/index.tsx";
import { useEffect } from "react";
import { cartService } from "../../../services/cart.service.ts";

export default function CartPage() {
  const { items } = useCartStore();

  useEffect(() => {
    cartService.getUserCart();
  }, []);

  if (!items.length) {
    return <EmptyCart />;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={16}>
        <Col span={16}>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Col>

        <Col span={8}>
          <CartSummary />
        </Col>
      </Row>
    </div>
  );
}
