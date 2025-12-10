import { Typography } from "antd";
import styles from "./PageHeader.module.scss";

const { Title, Paragraph } = Typography;

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className={styles.header}>
      <Title level={2}>{title}</Title>
      {subtitle && <Paragraph>{subtitle}</Paragraph>}
    </div>
  );
}
