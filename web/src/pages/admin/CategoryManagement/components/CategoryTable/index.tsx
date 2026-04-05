import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Image } from "antd";
import { useCategoryDeleteQuery } from "../../../../../queries/category.query";
import CategoryStatusSwitcher from "../CategoryStatusSwitcher";
import CategoryUpdateDrawer from "../CategoryUpdateDrawer";

type Props = {
  data: ICategoryResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onSortChange: (sort: string) => void;
  onSearch: (value: string) => void;
  toolbar: React.ReactNode[];
};

export const CategoryTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onSortChange,
  toolbar,
}: Props) => {
  const deleteCategory = useCategoryDeleteQuery();

  const columns: ProColumns<ICategoryResponse>[] = [
    { 
      title: "Thumbnail", 
      dataIndex: "thumbnailUrl",
      render: (_, record) => record.thumbnailUrl ? <Image src={record.thumbnailUrl} width={50} height={50} style={{ objectFit: "cover" }} /> : null 
    },
    { title: "Name", dataIndex: "name", sorter: true },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "Status",
      render: (_, record) => <CategoryStatusSwitcher category={record} />,
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => [
        <CategoryUpdateDrawer key="edit" category={record} />,
        <Popconfirm
          key="delete"
          title="Delete this category?"
          onConfirm={() => deleteCategory.mutate(record.slug)}
        >
          <a style={{ color: "red" }}>Delete</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      rowKey="id"
      headerTitle="Category Management"
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
        if (!Array.isArray(sorter) && sorter.field === "name") {
          onSortChange(
            sorter.order === "ascend" ? "NAME_ASC" : "NAME_DESC",
          );
        }
      }}
      toolBarRender={() => toolbar}
    />
  );
};
