import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormDateTimeRangePicker,
  ProFormDependency,
} from "@ant-design/pro-components";
import { Button, message, Spin } from "antd";
import { useState } from "react";

import { useCouponCreationMutation } from "../../../../../queries/coupon.query";
import { useSellerStore } from "../../../../../store/seller.store";
import { useProductsByShop } from "../../../../../queries/product.query";
import { CouponScope } from "../../../../../constant/coupon.constant";

export const CouponCreateModal = () => {
  const createCoupon = useCouponCreationMutation();

  const shopId = useSellerStore((state) => state.currentShopId!);

  const [search, setSearch] = useState("");
  const [page] = useState(1);

  const { data: productData, isFetching } = useProductsByShop(
    shopId,
    {
      search,
      page,
      limit: 20,
    },
    {
      enabled: !!shopId,
    }
  );

  return (
    <ModalForm
      title="Create Coupon"
      trigger={<Button type="primary">Add Coupon</Button>}
      modalProps={{ destroyOnHidden: true }}
      onFinish={async (values) => {
        try {
          const { time, productIds, ...rest } = values;

          const payload: any = {
            shopId,
            ...rest,
            ...(time?.[0] && { startAt: time[0] }),
            ...(time?.[1] && { endAt: time[1] }),
            ...(rest.scope === CouponScope.PRODUCT && {
              productIds,
            }),
          };

          await createCoupon.mutateAsync(payload);
          message.success("Created coupon successfully");
          return true;
        } catch (err: any) {
          message.error("Create coupon failed");
          console.log(err);
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
        initialValue={CouponScope.SHOP}
        options={[
          { label: "Apply to entire shop", value: CouponScope.SHOP },
          { label: "Apply to specific products", value: CouponScope.PRODUCT },
        ]}
      />

      {/* Product selector */}
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

      {/* Active time */}
      <ProFormDateTimeRangePicker name="time" label="Active Time" />
    </ModalForm>
  );
};
