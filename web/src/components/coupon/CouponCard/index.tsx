import { Button, message, Tag } from "antd";
import styles from "./CouponCard.module.scss";
import { useCouponClaimMutation } from "../../../queries/coupon.query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { PATH } from "../../../utils/path.util";

type Props = {
  coupon: ICouponResponse;
};

export default function CouponCard({ coupon }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const claimMutation = useCouponClaimMutation();

  const isOutOfStock =
    coupon.usageLimit !== null && coupon.usedCount >= coupon?.usageLimit;

  const handleClaim = () => {
    if (!user) {
      navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
      return;
    }

    claimMutation.mutate(coupon.id, {
      onSuccess: () => {
        message.success("Nhận mã thành công");
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || "Không thể nhận mã");
      },
    });
  };

  const renderButtonText = () => {
    if (coupon.isClaimed) return "Đã nhận";
    if (isOutOfStock) return "Hết lượt";
    return "Nhận";
  };

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.discount}>
          {coupon.type === "PERCENT"
            ? `${coupon.discount}%`
            : `₫${coupon.discount}`}
        </div>
        <div className={styles.desc}>{coupon.description}</div>

        {coupon.minOrder && (
          <Tag color="orange">Đơn tối thiểu ₫{coupon.minOrder}</Tag>
        )}
      </div>

      <div className={styles.right}>
        <Button
          type="primary"
          loading={claimMutation.isPending}
          disabled={coupon.isClaimed || isOutOfStock}
          onClick={handleClaim}
        >
          {renderButtonText()}
        </Button>
      </div>
    </div>
  );
}
