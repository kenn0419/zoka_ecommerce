import { Form, Input } from "antd";
import type { Rule } from "antd/es/form";

export interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "phone" | "password";
  password?: boolean;
  confirm?: boolean;
}

export default function FormInput({
  label,
  name,
  placeholder,
  type = "text",
  password = false,
  confirm = false,
}: FieldProps) {
  const rules: Rule[] = [
    {
      required: true,
      message: `Vui lòng nhập ${label.toLowerCase()}`,
    },
  ];

  if (type === "email") {
    rules.push({
      type: "email",
      message: "Email không hợp lệ",
    });
  }

  if (type === "phone") {
    rules.push({
      pattern: /^[0-9]{9,11}$/,
      message: "Số điện thoại phải từ 9–11 chữ số",
    });
  }

  if (confirm) {
    rules.push(({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || value === getFieldValue("password")) {
          return Promise.resolve();
        }
        return Promise.reject("Mật khẩu không khớp");
      },
    }));
  }

  const inputNode = password ? (
    <Input.Password size="large" placeholder={placeholder} />
  ) : (
    <Input size="large" type={type} placeholder={placeholder} />
  );

  return (
    <Form.Item label={label} name={name} rules={rules}>
      {inputNode}
    </Form.Item>
  );
}
