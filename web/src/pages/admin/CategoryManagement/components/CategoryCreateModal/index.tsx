import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useCategoryCreationQuery, useAdminCategoriesQuery } from "../../../../../queries/category.query";
import { UploadOutlined } from "@ant-design/icons";

type CategoryCreateFormValues = ICategoryCreationRequest;

export default function CategoryCreateModal() {
  const createCategory = useCategoryCreationQuery();
  const { data: categories } = useAdminCategoriesQuery({ limit: 1000 });

  return (
    <ModalForm<CategoryCreateFormValues>
      title="Create Category"
      trigger={<Button type="primary">Add Category</Button>}
      modalProps={{ destroyOnHidden: true }}
      onFinish={async (values) => {
        try {
          const payload = {
            ...values,
            thumbnail: values.thumbnail && (values.thumbnail as unknown as any[]).length > 0
              ? (values.thumbnail as unknown as any[])[0].originFileObj
              : undefined,
          };
          await createCategory.mutateAsync(payload);
          message.success("Created category successfully");
          return true;
        } catch {
          message.error("Create category failed");
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="Name"
        rules={[{ required: true }]}
      />

      <ProFormTextArea
        name="description"
        label="Description"
      />

      <ProFormSelect
        name="parentId"
        label="Parent Category"
        options={
          categories?.items?.map((cat) => ({
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
    </ModalForm>
  );
};
