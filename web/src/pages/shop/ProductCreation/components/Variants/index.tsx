import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { IProductVariantCreaionRequest } from "../../../../../types/product.type";
import VariantItem from "../VariantItem";
import { v4 as uuid } from "uuid";

interface Props {
  variants: IProductVariantCreaionRequest[];
  setVariants: (v: IProductVariantCreaionRequest[]) => void;
  variantFiles: File[];
  setVariantFiles: (f: File[]) => void;
}

export default function Variants({
  variants,
  setVariants,
  variantFiles,
  setVariantFiles,
}: Props) {
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: uuid(),
        name: "",
        price: 0,
        stock: 0,
        images: [],
      },
    ]);
  };

  return (
    <Card
      title="Phân loại hàng"
      extra={
        <Button icon={<PlusOutlined />} onClick={addVariant}>
          Thêm phân loại
        </Button>
      }
    >
      {variants.map((variant) => (
        <VariantItem
          key={variant.id}
          variant={variant}
          variants={variants}
          setVariants={setVariants}
          variantFiles={variantFiles}
          setVariantFiles={setVariantFiles}
        />
      ))}
    </Card>
  );
}
