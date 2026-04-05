import {
  ModalForm,
  ProFormText,
  ProFormDateTimeRangePicker,
  ProFormList,
  ProFormSelect,
  ProFormDigit,
  ProFormDependency,
} from "@ant-design/pro-components";
import { Button, message, Card, Divider, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSellerStore } from "../../../../../store/seller.store";
import { useFlashSaleCreationMutation } from "../../../../../queries/flash-sale.query";
import {
  useProductDetailByIdQuery,
  useProductsByShop,
} from "../../../../../queries/product.query";

export const FlashSaleCreateModal = () => {
  const shopId = useSellerStore((state: any) => state.currentShopId!);
  const createFlashSale = useFlashSaleCreationMutation();
  const [search, setSearch] = useState("");

  const { data: productData, isFetching } = useProductsByShop(
    shopId,
    { search, page: 1, limit: 50 },
    { enabled: !!shopId },
  );

  return (
    <ModalForm
      title="Tạo chương trình Flash Sale"
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm Flash Sale
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
        width: 800,
      }}
      onFinish={async (values) => {
        try {
          const { time, items, ...rest } = values;

          if (!items || items.length === 0) {
            message.error("Vui lòng thêm ít nhất một sản phẩm");
            return false;
          }

          const payload = {
            ...rest,
            startTime: time[0],
            endTime: time[1],
            items: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              originalPrice: item.originalPrice,
              salePrice: item.salePrice,
              quantity: item.quantity,
            })),
          };

          await createFlashSale.mutateAsync({ shopId, data: payload });
          message.success("Tạo Flash Sale thành công");
          return true;
        } catch (err: any) {
          message.error(
            err.response?.data?.message || "Tạo Flash Sale thất bại",
          );
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="Tên chương trình"
        placeholder="Nhập tên chương trình"
        rules={[{ required: true }]}
      />
      <ProFormDateTimeRangePicker
        name="time"
        label="Khoảng thời gian"
        rules={[{ required: true }]}
      />
      <ProFormDigit
        name="maxPerUser"
        label="Giới hạn mua mỗi user"
        min={1}
        placeholder="Bỏ trống nếu không giới hạn"
      />

      <Divider>Danh sách sản phẩm</Divider>

      <ProFormList
        name="items"
        creatorButtonProps={{
          creatorButtonText: "Thêm sản phẩm",
        }}
        itemRender={({ listDom, action }) => (
          <Card size="small" style={{ marginBottom: 8 }} extra={action}>
            {listDom}
          </Card>
        )}
      >
        {(meta) => (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <ProFormSelect
              name="productId"
              label="Sản phẩm"
              rules={[{ required: true }]}
              showSearch
              fieldProps={{
                onSearch: setSearch,
                loading: isFetching,
                style: { minWidth: 250 },
              }}
              options={productData?.items.map(
                (p: IProductListItemResponse) => ({
                  label: p.name,
                  value: p.id,
                }),
              )}
            />

            <ProFormDependency name={["productId"]}>
              {({ productId }) => (
                <VariantSelectorSection
                  productId={productId}
                  pricePath={["items", meta.name, "originalPrice"]}
                />
              )}
            </ProFormDependency>

            <ProFormDigit
              name="salePrice"
              label="Giá khuyến mãi"
              rules={[{ required: true }]}
              min={1}
              addonAfter="₫"
            />

            <ProFormDigit
              name="quantity"
              label="Số lượng mở bán"
              rules={[{ required: true }]}
              min={1}
            />

            {/* Field to store original price for the payload */}
            <ProFormDigit
              name="originalPrice"
              label="Giá gốc"
              disabled
              hidden
            />
          </div>
        )}
      </ProFormList>
    </ModalForm>
  );
};

const VariantSelectorSection = ({
  productId,
  pricePath,
}: {
  productId: string;
  pricePath: any[];
}) => {
  const { data: product, isLoading } = useProductDetailByIdQuery(productId);

  if (isLoading && productId)
    return <Spin size="small" style={{ marginTop: 30 }} />;

  return (
    <>
      <ProFormSelect
        name="variantId"
        label="Phân loại"
        rules={[{ required: true }]}
        disabled={!productId}
        options={product?.variants.map((v: any) => ({
          label: `${v.name} (Kho: ${v.stock}) - ${v?.displayPrice?.toLocaleString()}₫`,
          value: v.id,
        }))}
        fieldProps={{
          onChange: (_val, _option: any) => {},
        }}
      />
      <ProFormDependency name={["variantId"]}>
        {({ variantId }, form) => {
          if (variantId && product) {
            const variant = product.variants.find(
              (v: any) => v.id === variantId,
            );
            if (variant) {
              form.setFieldValue(pricePath, variant.displayPrice);
            }
          }
          return null;
        }}
      </ProFormDependency>
    </>
  );
};
