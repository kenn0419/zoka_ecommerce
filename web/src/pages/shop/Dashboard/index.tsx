import LowStockProducts from "./components/LowStockProducts";
import StatCards from "./components/StatCards";
import TodayOrders from "./components/TodayOrders";
import styles from "./Dashboard.module.scss";

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <StatCards />

      <div className={styles.grid}>
        <TodayOrders />
        <LowStockProducts />
      </div>
    </div>
  );
}
