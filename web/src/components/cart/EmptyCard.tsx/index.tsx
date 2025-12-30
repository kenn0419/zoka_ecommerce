import { Button } from "antd";
import { Link } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

export default function EmptyCart() {
  return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <h3>Giỏ hàng của bạn đang trống</h3>
      <Link to={`/${PATH.USER}`}>
        <Button type="primary">Tiếp tục mua sắm</Button>
      </Link>
    </div>
  );
}
