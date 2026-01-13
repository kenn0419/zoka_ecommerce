import { Card, Statistic } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./StatCards.module.scss";

export default function StatCards() {
  const stats = [
    {
      title: "Đơn hàng hôm nay",
      value: 23,
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Doanh thu hôm nay",
      value: 12400000,
      prefix: "₫",
      icon: <DollarOutlined />,
    },
    {
      title: "Sản phẩm đang bán",
      value: 128,
      icon: <InboxOutlined />,
    },
    {
      title: "Khách hàng mới",
      value: 5,
      icon: <UserOutlined />,
    },
  ];

  return (
    <div className={styles.cards}>
      {stats.map((s) => (
        <Card key={s.title} className={styles.card}>
          <Statistic title={s.title} value={s.value} prefix={s.prefix} />
          <div className={styles.icon}>{s.icon}</div>
        </Card>
      ))}
    </div>
  );
}
