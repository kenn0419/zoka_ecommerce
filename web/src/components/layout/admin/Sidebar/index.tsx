import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  StarOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATH } from "../../../../utils/path.util";
import styles from "./Sidebar.module.scss";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /* ===== AUTO OPEN THE RIGHT SUBMENU ===== */
  useEffect(() => {
    const path = location.pathname;

    if (path.includes(PATH.MANAGE_USER) || path.includes(PATH.MANAGE_SHOP)) {
      setOpenKeys(["system"]);
      return;
    }

    if (
      path.includes(PATH.MANAGE_PRODUCT) ||
      path.includes(PATH.MANAGE_CATEGORY) ||
      path.includes(PATH.MANAGE_ORDER) ||
      path.includes(PATH.MANAGE_REVIEW)
    ) {
      setOpenKeys(["business"]);
      return;
    }

    setOpenKeys([]);
  }, [location.pathname]);

  /* ===== SELECTED MENU ITEM ===== */
  const selectedKeys = (() => {
    const path = location.pathname;

    if (path.includes(PATH.MANAGE_USER)) return ["users"];
    if (path.includes(PATH.MANAGE_SHOP)) return ["shops"];
    if (path.includes(PATH.MANAGE_PRODUCT)) return ["products"];
    if (path.includes(PATH.MANAGE_CATEGORY)) return ["categories"];
    if (path.includes(PATH.MANAGE_ORDER)) return ["orders"];
    if (path.includes(PATH.MANAGE_REVIEW)) return ["reviews"];

    return ["dashboard"];
  })();

  /* ===== TOGGLE SUBMENU BY ARROW ONLY ===== */
  const toggleSubMenu = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? [] : [key]));
  };

  /* ===== CUSTOM TITLE WITH ARROW ===== */
  const renderSubMenuTitle = (title: string, key: string) => (
    <div
      className={styles.submenuTitle}
      onClick={(e) => {
        e.stopPropagation();
        toggleSubMenu(key);
      }}
    >
      <span>{title}</span>
    </div>
  );

  /* ===== MENU ITEMS ===== */
  const items: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to={`/${PATH.ADMIN}`}>Dashboard</Link>,
    },

    {
      key: "system",
      icon: <UserOutlined />,
      label: renderSubMenuTitle("Quản lý hệ thống", "system"),
      children: [
        {
          key: "users",
          label: (
            <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_USER}`}>Người dùng</Link>
          ),
        },
        {
          key: "shops",
          label: <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_SHOP}`}>Shop</Link>,
        },
      ],
    },

    {
      key: "business",
      icon: <ShoppingOutlined />,
      label: renderSubMenuTitle("Quản lý bán hàng", "business"),
      children: [
        {
          key: "products",
          label: (
            <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_PRODUCT}`}>Sản phẩm</Link>
          ),
        },
        {
          key: "categories",
          label: (
            <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_CATEGORY}`}>Danh mục</Link>
          ),
        },
        {
          key: "orders",
          label: (
            <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_ORDER}`}>Đơn hàng</Link>
          ),
        },
        {
          key: "reviews",
          label: (
            <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_REVIEW}`}>Đánh giá</Link>
          ),
        },
      ],
    },
  ];

  return (
    <Sider className={styles.sider} width={220} collapsible breakpoint="lg">
      <div className={styles.logo}>Admin Panel</div>

      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
      />
    </Sider>
  );
};

export default Sidebar;
