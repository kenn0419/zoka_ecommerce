import { Button, Avatar, Spin } from "antd";
import {
  UserOutlined,
  StarFilled,
  ShopOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import styles from "./ShopHeader.module.scss";
import dayjs from "dayjs";

interface ShopHeaderProps {
  shop: IShopResponse;
  isLoading: boolean;
}

export default function ShopHeader({ shop, isLoading }: ShopHeaderProps) {
  if (isLoading) {
    return <Spin />;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.banner}>
          <Avatar size={72} src={shop?.logoUrl} icon={<UserOutlined />} />
          <div className={styles.shopInfo}>
            <div className={styles.shopName}>{shop?.name}</div>
            <div className={styles.online}>Online 2 phút trước</div>
            <div className={styles.actions}>
              <Button type="primary" ghost icon={<ShopOutlined />}>
                Theo dõi
              </Button>
              <Button icon={<MessageOutlined />}>Chat</Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.stat}>
          <span>Sản phẩm:</span>
          <b>428</b>
        </div>
        <div className={styles.stat}>
          <span>Đang theo:</span>
          <b>23</b>
        </div>
        <div className={styles.stat}>
          <span>Người theo dõi:</span>
          <b>2,9tr</b>
        </div>
        <div className={styles.stat}>
          <span>Đánh giá:</span>
          <b>
            <StarFilled /> 4.9
          </b>
        </div>
        <div className={styles.stat}>
          <span>Tham gia:</span>
          <b>{dayjs(shop?.createdAt).format("DD/MM/YYYY")}</b>
        </div>
      </div>
    </div>
  );
}
