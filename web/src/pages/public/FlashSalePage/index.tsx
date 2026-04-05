import { Spin, Row, Col, Progress, Empty } from "antd";
import { useActiveFlashSalesQuery } from "../../../queries/flash-sale.query";
import styles from "./FlashSalePage.module.scss";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { useMemo } from "react";
import dayjs from "dayjs";

const FlashSalePage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useActiveFlashSalesQuery({ page: 1, limit: 50 });

  const activeFlashSale = useMemo(() => {
    if (!data?.items?.length) return null;
    return data.items[0];
  }, [data]);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src="/flash-sale-banner.png" alt="Flash Sale Banner" />
      </div>

      <div className={styles.tabsWrapper}>
        <div className={styles.activeTab}>
          <span className={styles.time}>
            {dayjs(activeFlashSale?.startTime).format("HH:mm")}
          </span>
          <span className={styles.status}>Đang diễn ra</span>
        </div>
      </div>

      <div className={styles.content}>
        {!activeFlashSale || activeFlashSale.items.length === 0 ? (
          <Empty description="Không có sản phẩm Flash Sale nào đang diễn ra" />
        ) : (
          <Row gutter={[16, 16]}>
            {activeFlashSale.items.map((item: IFlashSaleItemResponse) => (
              <Col key={item.id} xs={12} sm={8} md={6} lg={4}>
                <div
                  className={styles.productCard}
                  onClick={() =>
                    navigate(`/${PATH.PRODUCTS}/${item.product?.slug}`)
                  }
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.product?.thumbnail}
                      alt={item.product?.name}
                    />
                    <div className={styles.discountBadge}>
                      -
                      {Math.round(
                        (1 - item.salePrice / (item.product?.maxPrice || 1)) *
                          100,
                      )}
                      %
                    </div>
                  </div>
                  <div className={styles.info}>
                    <h4 className={styles.name}>{item.product?.name}</h4>
                    <p className={styles.price}>
                      {item.salePrice.toLocaleString()} ₫
                    </p>
                    <div className={styles.soldInfo}>
                      <Progress
                        percent={(item.sold / item.quantity) * 100}
                        showInfo={false}
                        strokeColor="#ee4d2d"
                        trailColor="#ffbdaf"
                      />
                      <span className={styles.soldText}>
                        {item.sold === item.quantity
                          ? "HẾT HÀNG"
                          : `ĐÃ BÁN ${item.sold}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default FlashSalePage;
