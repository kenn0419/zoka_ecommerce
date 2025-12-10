import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { PATH } from "../utils/path.util";
import { authStore } from "../store/auth.store";

interface Props {
  role?: "user" | "shop" | "admin";
  children: JSX.Element;
}

export default function ProtectedRoute({ role, children }: Props) {
  const { user } = authStore();
  console.log(user);

  if (!user) return <Navigate to={`/${PATH.AUTH}/${PATH.SIGNIN}`} replace />;
  if (role && !user.roles.includes(role))
    return <Navigate to={`/${PATH.ERROR}/${PATH.FORBIDDEN}`} replace />;

  return children;
}
