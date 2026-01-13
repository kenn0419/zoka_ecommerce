import { Button, Input, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useResendVerifyMutation,
  useVerifyAccountMutation,
} from "../../../queries/auth.query";
import { PATH } from "../../../utils/path.util";
import styles from "./VerifyAccount.module.scss";

const { Title, Text } = Typography;

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");

  const verifyMutation = useVerifyAccountMutation();
  const resendMutation = useResendVerifyMutation();

  useEffect(() => {
    if (!email) {
      navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
    }
  }, [email, navigate]);

  const handleSubmit = () => {
    if (otp.length !== 8) {
      return message.warning("Vui lòng nhập đủ 8 số");
    }

    verifyMutation.mutate(
      { email: email!, token: otp },
      {
        onSuccess: () => {
          message.success("Xác thực thành công");
          navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "OTP không hợp lệ");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3}>Xác thực tài khoản</Title>
        <Text type="secondary">
          Nhập mã OTP đã gửi đến <b>{email}</b>
        </Text>
      </div>

      <Input.OTP
        length={8}
        value={otp}
        onChange={setOtp}
        size="large"
        className={styles.otp}
      />

      <Button
        type="primary"
        size="large"
        block
        loading={verifyMutation.isPending}
        onClick={handleSubmit}
      >
        Xác nhận
      </Button>

      <Button
        type="link"
        block
        disabled={resendMutation.isPending}
        onClick={() => resendMutation.mutate(email)}
      >
        Gửi lại mã
      </Button>
    </div>
  );
};

export default VerifyAccount;
