import { Switch, message } from "antd";
import {
  useCouponActiveMutation,
  useCouponDeActiveMutation,
} from "../../../../../queries/coupon.query";
import { useSellerStore } from "../../../../../store/seller.store";

type Props = {
  coupon: ICouponResponse;
};

export default function CouponStatusSwitcher({ coupon }: Props) {
  const shopId = useSellerStore((state) => state.currentShopId!);
  const isActive = coupon.status === "ACTIVE";
  const activeShopCoupon = useCouponActiveMutation();
  const deActiveCoupon = useCouponDeActiveMutation();

  return (
    <Switch
      checked={isActive}
      loading={activeShopCoupon.isPending || deActiveCoupon.isPending}
      onChange={async (checked) => {
        console.log(coupon);
        try {
          checked
            ? await activeShopCoupon.mutateAsync({
                shopId: shopId,
                couponId: coupon.id,
              })
            : await deActiveCoupon.mutateAsync({
                shopId: shopId,
                couponId: coupon.id,
              });

          message.success("Status updated");
        } catch {
          message.error("Update status failed");
        }
      }}
    />
  );
}
