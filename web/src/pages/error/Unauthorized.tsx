import { PATH } from "../../utils/path.util";
import ErrorPage from "./ErrorPage";

export default function Unauthorized() {
  return (
    <ErrorPage
      status={401}
      title="401"
      subTitle="Bạn cần đăng nhập để truy cập trang này."
      btnText="Đăng nhập"
      to={`/${PATH.AUTH}/${PATH.SIGNIN}`}
    />
  );
}
