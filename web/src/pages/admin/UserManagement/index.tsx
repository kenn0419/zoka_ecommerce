import { Input } from "antd";
import { useState } from "react";
import { UserSort } from "../../../constant/user-sort.constant";
import { useAllUsersQuery } from "../../../queries/user.query";
import { UserTable } from "./components/UserTable";
import { UserCreateModal } from "./components/UserCreateModal";

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>(UserSort.NEWEST);

  const { data, isLoading } = useAllUsersQuery({
    page,
    limit,
    search,
    sort,
  });

  return (
    <UserTable
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
          placeholder="Search user..."
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />,
        <UserCreateModal key="create" />,
      ]}
    />
  );
};

export default UserManagement;
