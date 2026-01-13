import { DrawerForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useUserUpdateQuery } from "../../../../../queries/user.query";

type UserUpdateDrawerProps = {
  user: IUserResponse;
};

export const UserUpdateDrawer = ({ user }: UserUpdateDrawerProps) => {
  const updateUser = useUserUpdateQuery();

  return (
    <DrawerForm
      title="Edit User"
      trigger={<a>Edit</a>}
      initialValues={user}
      onFinish={async (values) => {
        try {
          await updateUser.mutateAsync({ ...values, id: user.id });
          message.success("Updated");
          return true;
        } catch {
          message.error("Update failed");
          return false;
        }
      }}
    >
      <ProFormText name="fullName" label="Name" required />
      <ProFormText name="email" label="Email" required />
    </DrawerForm>
  );
};
