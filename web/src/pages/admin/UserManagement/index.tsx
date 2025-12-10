import React, { useRef, useState } from "react";
import {
  ProTable,
  ModalForm,
  ProFormText,
  DrawerForm,
} from "@ant-design/pro-components";
import { Button, Input, message } from "antd";
import styles from "./UserManagement.module.scss";
// import { userService } from "../../services/user.service";

const UserManagement = () => {
  const actionRef = useRef();

  const [keyword, setKeyword] = useState("");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => [
        <DrawerForm
          key="edit"
          title="Edit User"
          trigger={<a>Edit</a>}
          initialValues={record}
          onFinish={async (values) => {
            // await userService.update(record.id, values);
            message.success("Updated!");
            // actionRef.current?.reload();
            return true;
          }}
        >
          <ProFormText name="name" label="Name" rules={[{ required: true }]} />
          <ProFormText
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          />
        </DrawerForm>,

        <a
          key="delete"
          style={{ color: "red" }}
          onClick={async () => {
            // await userService.delete(record.id);
            // actionRef.current?.reload();
            message.success("Deleted!");
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <ProTable
        headerTitle="User Management"
        actionRef={actionRef}
        rowKey="id"
        search={false} // tự làm search riêng
        columns={columns}
        request={async () => {
          // const res = await userService.getAll();

          // Lọc theo keyword
          const filtered = res.filter((u) =>
            `${u.name} ${u.email}`.toLowerCase().includes(keyword.toLowerCase())
          );

          return {
            data: filtered,
            success: true,
          };
        }}
        toolBarRender={() => [
          // 🔍 Thanh Search
          <Input.Search
            key="search"
            allowClear
            placeholder="Search user..."
            className={styles.input}
            onSearch={(value) => {
              setKeyword(value);
              // actionRef.current?.reload();
            }}
            onChange={(e) => {
              if (!e.target.value) {
                setKeyword("");
                // actionRef.current?.reload();
              }
            }}
          />,

          // ➕ Add User
          <ModalForm
            key="create"
            title="Create User"
            trigger={<Button type="primary">Add User</Button>}
            onFinish={async (values) => {
              // await userService.create(values);
              message.success("Created!");
              // actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="name"
              label="Name"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            />
          </ModalForm>,
        ]}
      />
    </div>
  );
};

export default UserManagement;
