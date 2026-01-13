import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AuthLayout from "../layouts/AuthLayout";
import AuthorizeEntry from "./AuthorizeEntry";

const SigninPage = lazy(() => import("../pages/auth/Signin"));
const SignupPage = lazy(() => import("../pages/auth/Signup"));
const VerifyAccountPage = lazy(() => import("../pages/auth/VerifyAccount"));

export const AuthRoutes: RouteObject = {
  path: PATH.AUTH,
  element: (
    <AuthorizeEntry>
      <AuthLayout />
    </AuthorizeEntry>
  ),
  children: [
    { path: PATH.SIGNIN, element: <SigninPage /> },
    { path: PATH.SIGNUP, element: <SignupPage /> },
    { path: PATH.VERIFY_ACCOUNT, element: <VerifyAccountPage /> },
  ],
};
