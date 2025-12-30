import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";
import { PATH } from "../utils/path.util";

const HomePage = lazy(() => import("../pages/user/HomePage"));
const CartPage = lazy(() => import("../pages/user/Cart"));

export const UserRoutes: RouteObject = {
  path: PATH.USER,
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: PATH.CART, element: <CartPage /> },
  ],
};
