import { Skeleton } from "antd";
import styles from "./CouponSection.module.scss";
import CouponCard from "../CouponCard";

interface CouponSectionProps {
  coupons: ICouponResponse[];
  isLoading: boolean;
}

export default function CouponSection({
  coupons,
  isLoading,
}: CouponSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.section}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>🎟 Voucher hôm nay</h2>
      </div>

      <div className={styles.list}>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
}
