import {
  DrawerForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Spin } from "antd";
import { useState } from "react";

import { useCouponUpdateMutation } from "../../../../../queries/coupon.query";
import { useSellerStore } from "../../../../../store/seller.store";
import { CouponScope } from "../../../../../constant/coupon.constant";
import { useProductsByShop } from "../../../../../queries/product.query";

type CouponUpdateDrawerProps = {
  coupon: ICouponResponse & {
    productIds?: string[]; // FE cần field này
  };
};

export default function CouponUpdateDrawer({
  coupon,
}: CouponUpdateDrawerProps) {
  const shopId = useSellerStore((state) => state.currentShopId!);
  const updateShopCoupon = useCouponUpdateMutation();

  const [search, setSearch] = useState("");

  const { data: productData, isFetching } = useProductsByShop(
    shopId,
    {
      search,
      page: 1,
      limit: 20,
    },
    {
      enabled: !!search,
    }
  );

  return (
    <DrawerForm
      title="Edit Coupon"
      trigger={<a>Edit</a>}
      initialValues={{
        description: coupon.description,
        type: coupon.type,
        discount: coupon.discount,
        usageLimit: coupon.usageLimit,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
        scope: coupon.scope,
        productIds: coupon.productIds ?? [],
      }}
      onFinish={async (values) => {
        try {
          const payload = {
            id: coupon.id,
            shopId,
            ...values,
            ...(values.scope !== CouponScope.PRODUCT && {
              productIds: undefined,
            }),
          };

          await updateShopCoupon.mutateAsync(payload);
          message.success("Updated coupon successfully");
          return true;
        } catch {
          message.error("Update failed");
          return false;
        }
      }}
    >
      {/* Description */}
      <ProFormText name="description" label="Description" />

      {/* Discount type */}
      <ProFormSelect
        name="type"
        label="Discount Type"
        rules={[{ required: true }]}
        options={[
          { label: "Percent (%)", value: "PERCENTAGE" },
          { label: "Fixed Amount", value: "FIXED" },
        ]}
      />

      {/* Discount */}
      <ProFormDigit
        name="discount"
        label="Discount Value"
        min={0}
        rules={[{ required: true }]}
      />

      {/* Usage limit */}
      <ProFormDigit name="usageLimit" label="Usage Limit" min={1} />

      {/* Min order */}
      <ProFormDigit name="minOrder" label="Minimum Order Value" min={0} />

      {/* Max discount */}
      <ProFormDigit name="maxDiscount" label="Maximum Discount" min={0} />

      {/* Scope */}
      <ProFormSelect
        name="scope"
        label="Scope"
        rules={[{ required: true }]}
        options={[
          { label: "Apply to entire shop", value: CouponScope.SHOP },
          { label: "Apply to specific products", value: CouponScope.PRODUCT },
        ]}
      />

      {/* Product selector – chỉ hiện khi PRODUCT */}
      <ProFormDependency name={["scope"]}>
        {({ scope }) =>
          scope === CouponScope.PRODUCT ? (
            <ProFormSelect
              name="productIds"
              label="Apply to Products"
              rules={[{ required: true, message: "Please select products" }]}
              showSearch
              debounceTime={300}
              fieldProps={{
                mode: "multiple",
                filterOption: false,
                onSearch: setSearch,
                notFoundContent: isFetching ? <Spin size="small" /> : null,
              }}
              options={
                productData?.items.map((p) => ({
                  label: p.name,
                  value: p.id,
                })) ?? []
              }
            />
          ) : null
        }
      </ProFormDependency>
    </DrawerForm>
  );
}
