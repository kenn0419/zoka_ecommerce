import { Input } from "antd";
import { useState } from "react";
import CouponTable from "./components/CouponTable";
import { useAllShopCoupons } from "../../../queries/coupon.query";
import { useSellerStore } from "../../../store/seller.store";
import { CouponCreateModal } from "./components/CouponCreateModal";
import { CouponSort } from "../../../constant/coupon.constant";

export default function DiscountManagement() {
  const currentShopId = useSellerStore((state) => state.currentShopId);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>(CouponSort.OLDEST);

  const { data, isLoading } = useAllShopCoupons(currentShopId ?? "", {
    page,
    limit,
    search,
    sort,
  });

  return (
    <CouponTable
      data={data?.items ?? []}
      loading={isLoading}
      page={page}
      limit={limit}
      total={data?.meta?.totalItems}
      onPageChange={(p, l) => {
        setPage(p);
        setLimit(l);
      }}
      onSortChange={setSort}
      onSearch={(v) => {
        setSearch(v);
        setPage(1);
      }}
      toolbar={[
        <Input.Search
          key="search"
          placeholder="Search coupon code..."
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />,
        <CouponCreateModal key="create" />,
      ]}
    />
  );
}
