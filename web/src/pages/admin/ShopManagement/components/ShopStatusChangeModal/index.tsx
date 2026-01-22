import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import { SHOP_STATUS_LABEL } from "../../../../../constant/shop.constant";

interface ShopStatusChangeModalProps {
  shop: IShopResponse;
  visible: boolean;
  onClose: () => void;
  onSave: (values: IShopChangeStatusRequest) => Promise<void>;
}

type ShopStatusFormValues = {
  status: IShopStatus;
};
export const ShopStatusChangeModal: React.FC<ShopStatusChangeModalProps> = ({
  shop,
  visible,
  onClose,
  onSave,
}) => {
  return (
    <ModalForm<ShopStatusFormValues>
      title="Chi tiết Shop"
      open={visible}
      modalProps={{ onCancel: onClose }}
      initialValues={shop ?? {}}
      onFinish={async (values) => {
        try {
          await onSave({ id: shop.id, status: values.status });
          message.success("Cập nhật trạng thái thành công!");
          onClose();
          return true;
        } catch (err) {
          message.error("Cập nhật trạng thái thất bại!");
          return false;
        }
      }}
    >
      <ProFormText name="name" label="Tên Shop" disabled />
      <ProFormTextArea name="description" label="Mô tả Shop" disabled />
      <ProFormText name={["owner", "fullName"]} label="Chủ Shop" disabled />
      <ProFormText name={["owner", "email"]} label="Email Chủ Shop" disabled />

      <ProFormSelect
        name="status"
        label="Trạng thái Shop"
        valueEnum={SHOP_STATUS_LABEL}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};
