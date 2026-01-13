import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./RegisterShopForm.module.scss";
import { useRegisterShopMutation } from "../../../queries/shop.query";
import { useSellerStore } from "../../../store/seller.store";

export default function RegisterShopForm() {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const setCurrentShopId = useSellerStore((s) => s.setCurrentShopId);

  const { mutateAsync, isPending } = useRegisterShopMutation();

  const onFinish = async (values: any) => {
    try {
      const res = await mutateAsync({
        name: values.name,
        description: values.description,
        logo: logoFile ?? undefined,
      });

      setCurrentShopId(res.id);
      message.success("Đăng ký shop thành công!");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Tên shop"
        name="name"
        rules={[{ required: true, message: "Nhập tên shop" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Logo shop">
        <Upload
          accept="image/*"
          maxCount={1}
          beforeUpload={(file) => {
            setLogoFile(file);
            return false; // chặn auto upload
          }}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>

        {logoFile && (
          <img
            src={URL.createObjectURL(logoFile)}
            className={styles.preview}
            alt="preview"
          />
        )}
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={isPending}>
        Đăng ký shop
      </Button>
    </Form>
  );
}
