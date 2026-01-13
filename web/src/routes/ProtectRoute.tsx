import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { PATH } from "../utils/path.util";
import { useAuthStore } from "../store/auth.store";

interface Props {
  role?: "user" | "shop" | "admin";
  children: JSX.Element;
}

export default function ProtectedRoute({ role, children }: Props) {
  const { user } = useAuthStore();
  const isInclude = user?.roles.some((item: any) => item.name === role);
  if (!user)
    return <Navigate to={`/${PATH.ERROR}/${PATH.UNAUTHORIZED}`} replace />;
  if (!role || !isInclude)
    return <Navigate to={`/${PATH.ERROR}/${PATH.FORBIDDEN}`} replace />;

  return children;
}
