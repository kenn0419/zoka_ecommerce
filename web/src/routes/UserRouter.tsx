import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import UserLayout from "../layouts/UserLayout";

const HomePage = lazy(() => import("../pages/user/HomePage"));
const CartPage = lazy(() => import("../pages/user/Cart"));

export const UserRoutes: RouteObject = {
  path: PATH.USER,
  element: <UserLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: PATH.CART, element: <CartPage /> },
  ],
};
