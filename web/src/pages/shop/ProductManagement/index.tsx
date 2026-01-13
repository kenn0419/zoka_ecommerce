import { useNavigate, useSearchParams } from "react-router-dom";
import ProductTable from "../../../components/product/ProductTable";
import Pagination from "../../../components/common/Pagination";
import ProductSort from "../../../components/product/ProductSort";
import { useProductsByShop } from "../../../queries/product.query";
import { useSellerStore } from "../../../store/seller.store";
import { getNumberParam } from "../../../utils/query.util";
import ProductSearch from "../../../components/product/ProductSearch";
import PageSizeSelect from "../../../components/common/PageSizeSelect";
import styles from "./ProductManagement.module.scss";
import { Button } from "antd";
import { PATH } from "../../../utils/path.util";
import { useState } from "react";
import ProductDetailDrawer from "../../../components/product/ProductDetailDrawer";

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const { currentShopId } = useSellerStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = getNumberParam(searchParams.get("page"), 1);
  const limit = getNumberParam(searchParams.get("limit"), 10);
  const sort = searchParams.get("sort") ?? "oldest";
  const search = searchParams.get("search") ?? "";

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [openDetail, setOpenDetail] = useState(false);

  const { data, isLoading } = useProductsByShop(currentShopId!, {
    page,
    limit,
    sort,
    search,
  });

  const handleClickCreateBtn = () => {
    navigate(`/${PATH.SELLER}/${currentShopId}/${PATH.CREATE_PRODUCT}`);
  };

  const handleEditProduct = (productId: string) => {
    navigate(
      `/${PATH.SELLER}/${currentShopId}/${PATH.EDIT_PRODUCT}/${productId}`
    );
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setOpenDetail(true);
  };

  return (
    <>
      <div className={styles.btnAdd}>
        <Button type="primary" onClick={handleClickCreateBtn}>
          Thêm sản phẩm
        </Button>
      </div>
      <div className={styles.container}>
        <div style={{ display: "flex", gap: 8 }}>
          <ProductSearch />
          <ProductSort />
        </div>

        <PageSizeSelect />
      </div>

      <ProductTable
        data={data?.items ?? []}
        loading={isLoading}
        onEdit={handleEditProduct}
        onInfo={handleViewProduct}
      />

      {data?.meta && (
        <Pagination
          page={page}
          limit={limit}
          total={data.meta.totalItems}
          onChange={(p) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(p));
            setSearchParams(params);
          }}
        />
      )}

      <ProductDetailDrawer
        productId={selectedProductId}
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedProductId(null);
        }}
      />
    </>
  );
}
