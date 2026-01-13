import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { PATH } from "../utils/path.util";
import { useAuthStore } from "../store/auth.store";

interface AuthorizeEntryProps {
  children: JSX.Element;
}

export default function AuthorizeEntry({ children }: AuthorizeEntryProps) {
  const { user } = useAuthStore();
  const isRole = (role: string) => {
    return user?.roles.map((item: any) => item.name === role);
  };
  if (user) {
    if (isRole("admin")) return <Navigate to={`/${PATH.ADMIN}`} replace />;
    if (isRole("shop")) return <Navigate to={`/${PATH.SELLER}`} replace />;
    return <Navigate to={`/${PATH.USER}`} replace />;
  }

  return children;
}
