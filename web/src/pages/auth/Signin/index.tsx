import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { authStore } from "../../../store/auth.store";
import { Role } from "../../../utils/role.util";
import AuthCard from "../../../components/auth/AuthCard";
import PageHeader from "../../../components/auth/PageHeader";
import layout from "./../../../layouts/AuthLayout/AuthLayout.module.scss";

const { Text } = Typography;

export default function Signin() {
  const navigate = useNavigate();
  const { signin, loading, user } = authStore();

  const onFinish = async (values: any) => {
    const { success, error } = await signin({
      email: values.email,
      password: values.password,
    });

    if (success) {
      message.success("Sign in successfully!");
    } else {
      message.error(error.data.message);
      return;
    }

    if (user?.roles.includes(Role.ADMIN)) {
      navigate(`/${PATH.ADMIN}`);
    } else if (user?.roles.includes(Role.SHOP)) {
      navigate(`/${PATH.SHOP}`);
    } else {
      navigate(`/${PATH.USER}`);
    }
  };

  return (
    <AuthCard>
      <PageHeader title="Đăng nhập" />

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input size="large" placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          Đăng nhập
        </Button>
      </Form>

      <div className={layout.footer}>
        <Text>Chưa có tài khoản? </Text>
        <Link to="/auth/signup">Đăng ký ngay</Link>
      </div>
    </AuthCard>
  );
}
