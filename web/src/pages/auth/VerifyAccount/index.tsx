import { useState, useRef, useEffect } from "react";
import styles from "./VerifyAccount.module.scss";
import { Button, Input, message, Typography, type InputRef } from "antd";
import { authStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
const { Title } = Typography;

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(Array(8).fill(""));
  const inputsRef = useRef<(InputRef | null)[]>([]);
  const { verifyAccount, loading, canVerify } = authStore();

  useEffect(() => {
    if (!canVerify) {
      navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
    }
  }, [canVerify]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    if (value && index < 7) {
      inputsRef.current[index + 1]?.focus();
    }
    if (index === 7) {
      onSubmit(newCodes);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (codeArray?: string[]) => {
    const finalCodes = codeArray ?? codes;
    const code = finalCodes.join("");

    if (code.length !== 8) {
      return message.warning("Vui lòng nhập đủ 8 số!");
    }

    const result = await verifyAccount(code);
    if (result) {
      message.success("Xác thực tài khoản thành công");
      navigate(`/${PATH.SIGNIN}`);
    } else {
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <Title level={2} className={styles.title}>
        Xác thực tài khoản
      </Title>
      <p>Nhập mã OTP gồm 8 số vừa được gửi đến email của bạn</p>

      <div className={styles.otpContainer}>
        {codes.map((digit, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={styles.otpInput}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <Button
        type="primary"
        block
        onClick={() => onSubmit(codes)}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        Xác nhận
      </Button>
    </>
  );
}
