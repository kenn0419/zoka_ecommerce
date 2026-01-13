import { Card, List, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./ShopSelection.module.scss";
import { useGetAllMyShopsQuery } from "../../../queries/shop.query";
import { useSellerStore } from "../../../store/seller.store";

export default function SelectShopPage() {
  const navigate = useNavigate();
  const { data } = useGetAllMyShopsQuery();
  const setCurrentShopId = useSellerStore((s) => s.setCurrentShopId);

  const shops = data ?? [];

  const handleSelect = (shopId: string) => {
    setCurrentShopId(shopId);
    navigate(`/seller/${shopId}/dashboard`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Chọn shop để quản lý</div>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={shops}
        renderItem={(shop) => (
          <List.Item>
            <Card>
              <div className={styles.shopCard}>
                <img
                  src={shop.logoUrl || "/placeholder.png"}
                  className={styles.logo}
                />

                <div style={{ flex: 1 }}>
                  <div>{shop.name}</div>
                  <Tag color="blue">{shop.status}</Tag>
                </div>

                <Button type="primary" onClick={() => handleSelect(shop.id)}>
                  Vào shop
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
