import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import styles from "./MainLayout.module.scss";
import Footer from "../../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className={styles.main}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
