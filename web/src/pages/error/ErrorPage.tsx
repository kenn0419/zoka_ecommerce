import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../utils/path.util";

const mapStatus = (status: number) => {
  if ([403, 404, 500].includes(status)) return status as 403 | 404 | 500;
  return "error" as const;
};

export default function ErrorPage({
  status,
  title,
  subTitle,
}: {
  status: number;
  title: string;
  subTitle: string;
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status={mapStatus(status)}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={() => navigate(PATH.HOME)}>
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
}
