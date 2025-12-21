import { Menu } from "antd";
import {
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      key: "/shop",
      icon: <BarChartOutlined />,
      label: "Tổng quan",
    },
    {
      key: "/shop/products",
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
    },
    {
      key: "/shop/orders",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
    },
    {
      key: "/shop/finance",
      icon: <DollarOutlined />,
      label: "Tài chính",
    },
    {
      key: "/shop/settings",
      icon: <ShopOutlined />,
      label: "Cài đặt Shop",
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      onClick={(e) => navigate(e.key)}
    />
  );
}
