import { Progress, Skeleton } from "antd";
import { useEffect, useState, useMemo } from "react";
import styles from "./FlashSale.module.scss";
import { useActiveFlashSalesQuery } from "../../../queries/flash-sale.query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

const FlashSale = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useActiveFlashSalesQuery({ page: 1, limit: 12 });
  
  // Get the most urgent flash sale (one ending soonest)
  const activeFlashSale = useMemo(() => {
    if (!data?.items?.length) return null;
    return data.items[0]; // Assuming backend sorts them
  }, [data]);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeFlashSale) return;

    const timer = setInterval(() => {
      const now = dayjs();
      const end = dayjs(activeFlashSale.endTime);
      const diff = end.diff(now);
      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeFlashSale]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  if (isLoading) return <div className={styles.flashSale}><Skeleton active /></div>;
  if (!activeFlashSale) return null;

  return (
    <div className={styles.flashSale}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <img src="/flash-sale-label.png" alt="Flash Sale" className={styles.labelImg} />
          <div className={styles.timer}>
            <span className={styles.timeBox}>{formatTime(hours)}</span>
            <span className={styles.divider}>:</span>
            <span className={styles.timeBox}>{formatTime(minutes)}</span>
            <span className={styles.divider}>:</span>
            <span className={styles.timeBox}>{formatTime(seconds)}</span>
          </div>
        </div>
        <div className={styles.viewAll} onClick={() => navigate(PATH.FLASH_SALE)}>
          Xem tất cả &gt;
        </div>
      </div>

      <div className={styles.scrollContainer}>
        {activeFlashSale.items.map((item: IFlashSaleItemResponse) => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => navigate(`/${PATH.PRODUCTS}/${item.product?.slug}`)}
          >
            <div className={styles.imageWrapper}>
              <img src={item.product?.thumbnail} alt={item.product?.name} />
              {item.product && (
                <div className={styles.discountBadge}>
                  -{Math.round((1 - item.salePrice / item.product.maxPrice) * 100)}%
                </div>
              )}
            </div>
            <div className={styles.info}>
              <p className={styles.price}>{item.salePrice.toLocaleString()} ₫</p>
              <div className={styles.soldInfo}>
                <Progress 
                  percent={(item.sold / item.quantity) * 100} 
                  showInfo={false} 
                  strokeColor="#ee4d2d" 
                  trailColor="#ffbdaf"
                />
                <span className={styles.soldText}>
                  {item.sold === item.quantity ? "HẾT HÀNG" : `ĐÃ BÁN ${item.sold}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
