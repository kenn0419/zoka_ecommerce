import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import ProtectedRoute from "./ProtectRoute";
import ShopLayout from "../layouts/ShopLayout";
import { lazy } from "react";
import AppLayout from "../components/layout/app/AppLayout";

const DashboardPage = lazy(() => import("../pages/shop/Dashboard"));
const ProductManagementPage = lazy(
  () => import("../pages/shop/ProductManagement")
);
const ProductCreationPage = lazy(() => import("../pages/shop/ProductCreation"));
const OrderManagementPage = lazy(() => import("../pages/shop/OrderManagement"));
const FinanceManagementPage = lazy(
  () => import("../pages/shop/FinanceManagement")
);

export const ShopRoutes: RouteObject = {
  path: `/${PATH.SELLER}/:shopId`,
  element: <AppLayout />,
  children: [
    {
      element: <AppLayout />,
      children: [
        {
          element: (
            <ProtectedRoute role="shop">
              <ShopLayout />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <DashboardPage /> },
            { path: PATH.MANAGE_PRODUCT, element: <ProductManagementPage /> },
            { path: PATH.MANAGE_ORDER, element: <OrderManagementPage /> },
            { path: PATH.MANAGE_FINANCE, element: <FinanceManagementPage /> },
            { path: PATH.CREATE_PRODUCT, element: <ProductCreationPage /> },
          ],
        },
      ],
    },
  ],
};
