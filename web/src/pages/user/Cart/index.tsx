import { Row, Col, Checkbox, Spin } from "antd";
import { useCartStore } from "../../../store/cart.store";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCard.tsx";
import { useCartQuery } from "../../../queries/cart.query.ts";
import { useEffect } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const toggleAll = useCartStore((s) => s.toggleAll);
  const setItems = useCartStore((s) => s.setItems);

  const { data, isLoading } = useCartQuery(true);

  useEffect(() => {
    if (!data) return;
    if (items.length === 0) {
      setItems(data.items);
    }
  }, [data, items.length, setItems]);
  if (isLoading) {
    return <Spin />;
  }

  if (!items.length) {
    return <EmptyCart />;
  }

  const allChecked = items.every((i) => i.checked || !i.isAvailable);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Checkbox
          checked={allChecked}
          onChange={(e) => toggleAll(e.target.checked)}
        >
          Chọn tất cả ({items.length})
        </Checkbox>
      </div>

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
