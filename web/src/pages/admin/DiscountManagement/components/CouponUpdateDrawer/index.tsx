import {
  DrawerForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Spin } from "antd";
import { useState } from "react";

import { CouponScope } from "../../../../../constant/coupon.constant";
import { useActiveCategoriesQuery } from "../../../../../queries/category.query";
import { useCouponAdminUpdateMutation } from "../../../../../queries/coupon.query";

type CouponUpdateDrawerProps = {
  coupon: ICouponResponse;
};

export default function CouponUpdateDrawer({
  coupon,
}: CouponUpdateDrawerProps) {
  const updateShopCoupon = useCouponAdminUpdateMutation();

  const [search, setSearch] = useState("");

  const { data: categories, isFetching } = useActiveCategoriesQuery(
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
        categoryIds: coupon.categoryIds,
      }}
      onFinish={async (values) => {
        try {
          const payload = {
            id: coupon.id,
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
          scope === CouponScope.CATEGORY ? (
            <ProFormSelect
              name="categoryIds"
              label="Apply to Categories"
              rules={[{ required: true, message: "Please select categories" }]}
              showSearch
              debounceTime={300}
              fieldProps={{
                mode: "multiple",
                filterOption: false,
                onSearch: setSearch,
                notFoundContent: isFetching ? <Spin size="small" /> : null,
              }}
              options={
                categories?.items.map((p) => ({
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
