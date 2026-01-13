import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import SellerEntry from "./SellerEntry";
import AppLayout from "../components/layout/app/AppLayout";

const RegisterShopPage = lazy(() => import("../pages/seller/ShopRegister"));
const SelectShopPage = lazy(() => import("../pages/seller/ShopSelection"));

export const SellerRoutes: RouteObject = {
  path: "/seller",
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
