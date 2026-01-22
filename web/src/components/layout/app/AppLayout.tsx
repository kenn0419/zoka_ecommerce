import { Outlet, Navigate } from "react-router-dom";
import { useMeQuery } from "../../../queries/auth.query";
import LoadingFallback from "../../common/LoadingFallback";
import { PATH } from "../../../utils/path.util";

export default function AppLayout() {
  const { isLoading, isError, isSuccess } = useMeQuery();

  if (isLoading) return <LoadingFallback />;

  if (isError) {
    return <Navigate to={`/${PATH.AUTH}/${PATH.SIGNIN}`} replace />;
  }

  if (isSuccess) {
    return <Outlet />;
  }
}
