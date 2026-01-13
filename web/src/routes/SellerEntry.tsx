import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useGetAllMyShopsQuery } from "../queries/shop.query";
import { useSellerStore } from "../store/seller.store";
import { PATH } from "../utils/path.util";

export default function SellerEntry() {
  const { data, isLoading } = useGetAllMyShopsQuery();
  const { currentShopId, setCurrentShopId } = useSellerStore();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  const shops = data ?? [];

  if (shops.length === 0) {
    return <Navigate to={`/${PATH.SELLER}/${PATH.REGISTER_SHOP}`} replace />;
  }

  if (shops.length === 1) {
    if (!currentShopId) {
      setCurrentShopId(shops[0].id);
    }
    return <Navigate to={`/seller/${shops[0].id}`} replace />;
  }

  if (!currentShopId) {
    return <Navigate to="/seller/select-shop" replace />;
  }

  return <Navigate to={`/seller/${currentShopId}/dashboard`} replace />;
}
