import { Input } from "antd";
import { useRef } from "react";
import styles from "./OtpInput.module.scss";

type Props = {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function OtpInput({ length = 8, value, onChange }: Props) {
  const inputsRef = useRef<(any | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...value];
    newValues[index] = val;
    onChange(newValues);

    if (val && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  return (
    <div className={styles.otpContainer}>
      {value.map((digit, index) => (
        <Input
          key={index}
          maxLength={1}
          value={digit}
          className={styles.otpInput}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e.target.value, index)}
        />
      ))}
    </div>
  );
}
