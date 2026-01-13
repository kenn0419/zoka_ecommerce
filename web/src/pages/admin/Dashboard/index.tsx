import { Typography, Row, Col } from "antd";
import styles from "./Dashboard.module.scss";
import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import RecentOrders from "./components/RecentOrders";

const { Title } = Typography;

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Title level={3}>Dashboard</Title>

      <StatCards />

      <Row gutter={16}>
        <Col span={14}>
          <RevenueChart />
        </Col>
        <Col span={10}>
          <RecentOrders />
        </Col>
      </Row>
    </div>
  );
}
