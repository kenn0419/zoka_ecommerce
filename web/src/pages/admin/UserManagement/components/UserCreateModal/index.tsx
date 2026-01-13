import {
  ModalForm,
  ProFormText,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useUserCreationQuery } from "../../../../../queries/user.query";
import { UploadOutlined } from "@ant-design/icons";

type UserCreateFormValues = IUserCreationRequest;

export const UserCreateModal = () => {
  const createUser = useUserCreationQuery();

  return (
    <ModalForm<UserCreateFormValues>
      title="Create User"
      trigger={<Button type="primary">Add User</Button>}
      modalProps={{ destroyOnHidden: true }}
      onFinish={async (values) => {
        try {
          await createUser.mutateAsync(values);
          message.success("Created user successfully");
          return true;
        } catch {
          message.error("Create user failed");
          return false;
        }
      }}
    >
      {/* Full name */}
      <ProFormText
        name="fullName"
        label="Full name"
        rules={[{ required: true }]}
      />

      {/* Email */}
      <ProFormText
        name="email"
        label="Email"
        rules={[
          { required: true },
          { type: "email", message: "Invalid email" },
        ]}
      />

      {/* Password */}
      <ProFormText.Password
        name="password"
        label="Password"
        rules={[{ required: true, min: 6 }]}
      />

      {/* Phone */}
      <ProFormText
        name="phone"
        label="Phone"
        rules={[{ required: true, min: 10 }]}
      />

      {/* Address */}
      <ProFormText
        name="address"
        label="Address"
        rules={[{ required: true, min: 6 }]}
      />

      {/* Avatar */}
      <ProFormUploadButton
        name="avatar"
        label="Avatar"
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
