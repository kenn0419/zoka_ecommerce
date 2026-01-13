import { Form, message } from "antd";
import styles from "./ProductCreation.module.scss";
import BasicInfo from "./components/BasicInfo";
import ProductImages from "./components/ProductImages";
import SubmitBar from "./components/SubmitBar";
import { useState } from "react";
import { useSellerStore } from "../../../store/seller.store";
import { useProductCreationMutation } from "../../../queries/product.query";
import type { IProductVariantCreaionRequest } from "../../../types/product.type";
import Variants from "./components/Variants";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { currentShopId } = useSellerStore();

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [variantFiles, setVariantFiles] = useState<File[]>([]);
  const [variants, setVariants] = useState<IProductVariantCreaionRequest[]>([]);

  const { mutateAsync, isPending } = useProductCreationMutation();

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        shopId: currentShopId,
        thumbnail,
        variantFiles,
        variants,
      };

      await mutateAsync(payload);

      form.resetFields();

      setThumbnail(null);
      setVariantFiles([]);
      setVariants([]);

      navigate(`/${PATH.SELLER}/${currentShopId}/${PATH.MANAGE_PRODUCT}`);
    } catch (error: any) {
      message.error(error.response.data.message ?? "Tạo sản phẩm thất bại");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      className={styles.container}
    >
      <BasicInfo />
      <ProductImages thumbnail={thumbnail} setThumbnail={setThumbnail} />
      <Variants
        variants={variants}
        setVariants={setVariants}
        variantFiles={variantFiles}
        setVariantFiles={setVariantFiles}
      />
      <SubmitBar loading={isPending} />
    </Form>
  );
}
