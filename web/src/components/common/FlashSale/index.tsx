import { Row, Col, Progress } from "antd";
import { useEffect, useState } from "react";
import styles from "./FlashSale.module.scss";
import type { IProductResponse } from "../../../types/product.type";

const flashSaleProducts: IProductResponse[] = Array.from({ length: 6 }).map(
  (_, i) => ({
    id: i,
    name: `Flash Sale ${i + 1}`,
    price: 99000 + i * 20000,
    imageUrl: "https://via.placeholder.com/200",
  })
);

const FLASH_SALE_END_TIME = new Date().getTime() + 2 * 60 * 60 * 1000;

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(FLASH_SALE_END_TIME - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(FLASH_SALE_END_TIME - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60));

  return (
    <div className={styles.flashSale}>
      <div className={styles.header}>
        <h3>⚡ Flash Sale</h3>
        <div className={styles.timer}>
          {hours}:{minutes}:{seconds}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {flashSaleProducts.map((product) => (
          <Col key={product.id} xs={12} sm={8} md={6} lg={4}>
            <div className={styles.item}>
              <img src={product.imageUrl} />
              <p className={styles.name}>{product.name}</p>
              <p className={styles.price}>{product.price.toLocaleString()} ₫</p>
              <Progress percent={70} showInfo={false} strokeColor="#ee4d2d" />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FlashSale;
