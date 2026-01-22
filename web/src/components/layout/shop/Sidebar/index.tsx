import { Menu } from "antd";
import {
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { PATH } from "../../../../utils/path.util";
import { useSellerStore } from "../../../../store/seller.store";

export default function Sidebar() {
  const { currentShopId } = useSellerStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      key: `/${PATH.SELLER}/${currentShopId}`,
      icon: <BarChartOutlined />,
      label: "Tổng quan",
    },
    {
      key: `/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_PRODUCT}`,
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
    },
    {
      key: `/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_ORDER}`,
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
    },
    {
      key: `/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_DISCOUNT}`,
      icon: <GiftOutlined />,
      label: "Khuyến mãi",
    },
    {
      key: `/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_FINANCE}`,
      icon: <DollarOutlined />,
      label: "Tài chính",
    },
    {
      key: `/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_SHOP}`,
      icon: <ShopOutlined />,
      label: "Cài đặt Shop",
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      className={styles.menu}
      onClick={(e) => navigate(e.key)}
    />
  );
}
