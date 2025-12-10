import ErrorPage from "./ErrorPage";

export default function BadRequest() {
  return (
    <ErrorPage status={400} title="400" subTitle="Yêu cầu không hợp lệ." />
  );
}
