import React, { useState } from "react";
import { Input } from "antd";
import { ShopTable } from "./components/ShopTable";
import {
  useGetAllShopsQuery,
  useShopStatusChangeQuery,
} from "../../../queries/shop.query";
import { ShopStatusChangeModal } from "./components/ShopStatusChangeModal";

const ShopManagement: React.FC = () => {
  const shopStatusChange = useShopStatusChangeQuery();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("newest");

  const [editingShop, setEditingShop] = useState<IShopResponse | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const { data, isLoading, refetch } = useGetAllShopsQuery({
    page,
    limit,
    search,
    sort,
  });

  const handleSave = async (values: IShopChangeStatusRequest) => {
    shopStatusChange.mutate({
      id: values.id,
      status: values.status,
    });
    refetch();
  };

  return (
    <>
      <ShopTable
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
            placeholder="Tìm kiếm shop..."
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            allowClear
          />,
        ]}
        onEdit={(shop) => {
          setEditingShop(shop);
          setEditVisible(true);
        }}
      />

      {editingShop && (
        <ShopStatusChangeModal
          shop={editingShop}
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ShopManagement;
