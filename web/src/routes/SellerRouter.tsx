import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import SellerEntry from "./SellerEntry";
import AppLayout from "../components/layout/app/AppLayout";
import { PATH } from "../utils/path.util";

const RegisterShopPage = lazy(() => import("../pages/seller/ShopRegister"));
const SelectShopPage = lazy(() => import("../pages/seller/ShopSelection"));

export const SellerRoutes: RouteObject = {
  path: PATH.SELLER,
  element: <AppLayout />,
  children: [
    {
      index: true,
      element: <SellerEntry />,
    },
    {
      path: "register-shop",
      element: <RegisterShopPage />,
    },
    {
      path: "select-shop",
      element: <SelectShopPage />,
    },
  ],
};
