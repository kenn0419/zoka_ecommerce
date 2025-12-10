import ErrorPage from "./ErrorPage";

export default function InternalError() {
  return (
    <ErrorPage status={500} title="500" subTitle="Đã xảy ra lỗi từ máy chủ." />
  );
}
