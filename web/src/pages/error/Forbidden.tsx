import ErrorPage from "./ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage
      status={403}
      title="403"
      subTitle="Bạn không có quyền truy cập trang này."
    />
  );
}
