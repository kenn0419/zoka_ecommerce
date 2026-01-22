import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { PATH } from "../utils/path.util";
import UserLayout from "../layouts/UserLayout";

const ShopPage = lazy(() => import("../pages/shop/ShopPage"));

export const PublicShopRoutes: RouteObject = {
  path: `/public/${PATH.SHOP}/:slug`,
  element: <UserLayout />,
  children: [
    {
      index: true,
      element: <ShopPage />,
    },
  ],
};
