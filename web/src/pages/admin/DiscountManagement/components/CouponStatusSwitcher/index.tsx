import { Switch, message } from "antd";
import {
  useCouponAdminActiveMutation,
  useCouponAdminDeActiveMutation,
} from "../../../../../queries/coupon.query";

type CouponStatusSwitcherProps = {
  coupon: ICouponResponse;
};

export default function CouponStatusSwitcher({
  coupon,
}: CouponStatusSwitcherProps) {
  const isActive = coupon.status === "ACTIVE";
  const activeGlobalCoupon = useCouponAdminActiveMutation();
  const deActiveCoupon = useCouponAdminDeActiveMutation();

  return (
    <Switch
      checked={isActive}
      loading={activeGlobalCoupon.isPending || deActiveCoupon.isPending}
      onChange={async (checked) => {
        console.log(coupon);
        try {
          checked
            ? await activeGlobalCoupon.mutateAsync(coupon.id)
            : await deActiveCoupon.mutateAsync(coupon.id);
          message.success("Status updated");
        } catch {
          message.error("Update status failed");
        }
      }}
    />
  );
}
