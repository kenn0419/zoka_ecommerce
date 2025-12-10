import { Form, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import layout from "./../../../layouts/AuthLayout/AuthLayout.module.scss";
import { PATH } from "../../../utils/path.util";
import { authStore } from "../../../store/auth.store";
import FormInput, {
  type FieldProps,
} from "../../../components/common/FormInput";
import AuthCard from "../../../components/auth/AuthCard";
import PageHeader from "../../../components/auth/PageHeader";

const { Text } = Typography;

const fields = [
  {
    label: "Tên đầy đủ",
    name: "fullName",
    placeholder: "Nguyễn Văn A",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    placeholder: "example@gmail.com",
    type: "email",
  },
  {
    label: "Phone",
    name: "phone",
    placeholder: "0762594192",
    type: "phone",
  },
  {
    label: "Address",
    name: "address",
    placeholder: "HCM",
    type: "text",
  },
  {
    label: "Mật khẩu",
    name: "password",
    placeholder: "••••••••",
    type: "password",
    password: true,
  },
  {
    label: "Xác nhận mật khẩu",
    name: "confirmPassword",
    placeholder: "••••••••",
    type: "password",
    password: true,
    confirm: true,
  },
] satisfies FieldProps[];

export default function Signup() {
  const navigate = useNavigate();
  const { loading, signup } = authStore();

  const onFinish = async (values: IAuthSignupRequest) => {
    const result = await signup(values);
    if (result) {
      message.success("Đăng ký thành công. Vui lòng xác thực tài khoản!");
      navigate(`/${PATH.VERIFY_ACCOUNT}`);
    } else {
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  return (
    <AuthCard width={500}>
      <PageHeader title="Đăng ký" />

      <Form layout="vertical" onFinish={onFinish}>
        {fields.map((f) => (
          <FormInput key={f.name} {...f} />
        ))}

        <Button
          type="primary"
          block
          size="large"
          htmlType="submit"
          loading={loading}
        >
          Đăng ký
        </Button>
      </Form>

      <div className={layout.footer}>
        <Text>Đã có tài khoản? </Text>
        <Link to={`/${PATH.AUTH}/${PATH.SIGNIN}`}>Đăng nhập</Link>
      </div>
    </AuthCard>
  );
}
