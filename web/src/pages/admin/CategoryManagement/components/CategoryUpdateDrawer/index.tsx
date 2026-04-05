import { DrawerForm, ProFormText, ProFormTextArea, ProFormUploadButton, ProFormSelect } from "@ant-design/pro-components";
import { message } from "antd";
import { useCategoryUpdateQuery, useAdminCategoriesQuery } from "../../../../../queries/category.query";
import { UploadOutlined } from "@ant-design/icons";

type CategoryUpdateDrawerProps = {
  category: ICategoryResponse;
};

export default function CategoryUpdateDrawer({ category }: CategoryUpdateDrawerProps) {
  const updateCategory = useCategoryUpdateQuery();
  const { data: categories } = useAdminCategoriesQuery({ limit: 1000 });

  return (
    <DrawerForm
      title="Edit Category"
      trigger={<a>Edit</a>}
      initialValues={category}
      onFinish={async (values) => {
        try {
          const payload = {
            ...values,
            thumbnail: values.thumbnail && values.thumbnail.length > 0 && values.thumbnail[0].originFileObj ? values.thumbnail[0].originFileObj : undefined,
          };
          await updateCategory.mutateAsync({ slug: category.slug, data: payload });
          message.success("Updated successfully");
          return true;
        } catch {
          message.error("Update failed");
          return false;
        }
      }}
    >
      <ProFormText name="name" label="Name" required />
      
      <ProFormTextArea name="description" label="Description" />
      
      <ProFormSelect
        name="parentId"
        label="Parent Category"
        options={
          categories?.items
            ?.filter(cat => cat.id !== category.id)
            ?.map((cat) => ({
              label: cat.name,
              value: cat.id,
            })) || []
        }
      />
      
      <ProFormUploadButton
        name="thumbnail"
        label="Thumbnail"
        max={1}
        listType="picture-card"
        accept="image/*"
        fieldProps={{
          beforeUpload: () => false,
        }}
        icon={<UploadOutlined />}
      />
    </DrawerForm>
  );
}
