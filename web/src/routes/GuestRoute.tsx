import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { PATH } from "../utils/path.util";
import { authStore } from "../store/auth.store";

interface Props {
  children: JSX.Element;
}

export default function GuestRoute({ children }: Props) {
  const { user } = authStore();
  if (user) {
    if (user.roles.includes("admin"))
      return <Navigate to={`/${PATH.ADMIN}`} replace />;
    if (user.roles.includes("shop"))
      return <Navigate to={`/${PATH.SHOP}`} replace />;
    return <Navigate to={`/${PATH.USER}`} replace />;
  }

  return children;
}
