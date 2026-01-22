import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import ProtectedRoute from "./ProtectRoute";
import AppLayout from "../components/layout/app/AppLayout";
import ShopManagement from "../pages/admin/ShopManagement";
import DiscountManagement from "../pages/admin/DiscountManagement";

export const AdminRoutes: RouteObject = {
  path: PATH.ADMIN,
  element: <AppLayout />,
  children: [
    {
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: PATH.MANAGE_USER, element: <UserManagement /> },
        { path: PATH.MANAGE_SHOP, element: <ShopManagement /> },
        { path: PATH.MANAGE_DISCOUNT, element: <DiscountManagement /> },
      ],
    },
  ],
};
