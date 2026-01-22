import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Popconfirm } from "antd";
import { useUserDeleteQuery } from "../../../../../queries/user.query";
import { UserSort } from "../../../../../constant/user.constant";
import UserStatusSwitcher from "../UserStatusSwitcher";
import UserUpdateDrawer from "../UserUpdateDrawer";

type Props = {
  data: IUserResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onSortChange: (sort: IUserSort) => void;
  onSearch: (value: string) => void;
  toolbar: React.ReactNode[];
};

export const UserTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onSortChange,
  onSearch,
  toolbar,
}: Props) => {
  const deleteUser = useUserDeleteQuery();

  const columns: ProColumns<IUserResponse>[] = [
    { title: "Name", dataIndex: "fullName", sorter: true },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      render: (_, record) => <UserStatusSwitcher user={record} />,
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => [
        <UserUpdateDrawer key="edit" user={record} />,
        <Popconfirm
          key="delete"
          title="Delete this user?"
          onConfirm={() => deleteUser.mutate(record.id)}
        >
          <a style={{ color: "red" }}>Delete</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      rowKey="id"
      headerTitle="User Management"
      loading={loading}
      search={false}
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize: limit,
        total,
        onChange: onPageChange,
      }}
      onChange={(_, __, sorter) => {
        if (!Array.isArray(sorter) && sorter.field === "fullName") {
          onSortChange(
            sorter.order === "ascend" ? UserSort.NAME_ASC : UserSort.NAME_DESC
          );
        }
      }}
      toolBarRender={() => toolbar}
    />
  );
};
