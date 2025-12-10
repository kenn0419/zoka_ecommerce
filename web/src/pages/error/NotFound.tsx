import ErrorPage from "./ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      status={404}
      title="404"
      subTitle="Trang bạn tìm kiếm không tồn tại."
    />
  );
}
