import { Card, Col, Row, Statistic } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import styles from "./StatCards.module.scss";

const stats = [
  {
    title: "Tổng đơn hàng",
    value: 1240,
    icon: <ShoppingCartOutlined />,
  },
  {
    title: "Doanh thu",
    value: 125000000,
    prefix: "₫",
    icon: <DollarOutlined />,
  },
  {
    title: "Người dùng",
    value: 540,
    icon: <UserOutlined />,
  },
  {
    title: "Shop đang hoạt động",
    value: 86,
    icon: <ShopOutlined />,
  },
];

const StatCards = () => {
  return (
    <Row gutter={16}>
      {stats.map((item) => (
        <Col span={6} key={item.title}>
          <Card className={styles.card}>
            <div className={styles.content}>
              <div>
                <div className={styles.title}>{item.title}</div>
                <Statistic
                  value={item.value}
                  prefix={item.prefix}
                  valueStyle={{ fontWeight: 600 }}
                />
              </div>
              <div className={styles.icon}>{item.icon}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;
