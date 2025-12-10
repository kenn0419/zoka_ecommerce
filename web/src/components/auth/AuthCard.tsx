import React from "react";
import { Card } from "antd";
import styles from "./AuthCard.module.scss";

interface AuthProps {
  children: React.ReactNode;
  width?: number;
}

const AuthCard = ({ children, width = 400 }: AuthProps) => {
  return (
    <Card className={styles.card} style={{ width }}>
      {children}
    </Card>
  );
};

export default AuthCard;
