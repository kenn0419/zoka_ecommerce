import { useState } from "react";
import { Input, Select } from "antd";
import {
  useAllOrdersQuery,
  useChangeOrderStatusByAdminMutation,
} from "../../../queries/order.query";
import { ORDER_STATUS_LABEL } from "../../../utils/constant.util";
import OrderTable from "../../../components/order/OrderTable";
import { OrderStatusChangeModal } from "../../../components/order/OrderStatusModal";

export default function OrderManagement() {
  const changeStatusMutation = useChangeOrderStatusByAdminMutation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<IOrderStatus | undefined>();

  const [editingOrder, setEditingOrder] = useState<IOrderResponse | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const { data, isLoading, refetch } = useAllOrdersQuery({
    page,
    limit,
    search,
  });

  const handleSave = async (id: string, status: IOrderStatus) => {
    await changeStatusMutation.mutateAsync({ id, status });
    refetch();
  };

  return (
    <>
      <OrderTable
        data={data?.items ?? []}
        loading={isLoading}
        page={page}
        limit={limit}
        total={data?.meta?.totalPages}
        onPageChange={(p, l) => {
          setPage(p);
          setLimit(l);
        }}
        toolbar={[
          <Input.Search
            key="search"
            placeholder="Tìm mã đơn..."
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            allowClear
          />,
          <Select
          value={status}
            key="status"
            placeholder="Lọc trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={Object.entries(ORDER_STATUS_LABEL).map(
              ([value, label]) => ({
                value,
                label,
              }),
            )}
          />,
        ]}
        onEdit={(order) => {
          setEditingOrder(order);
          setEditVisible(true);
        }}
      />

      {editingOrder && (
        <OrderStatusChangeModal
          order={editingOrder}
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
