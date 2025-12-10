import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import ProtectedRoute from "./ProtectRoute";

export const AdminRoutes: RouteObject = {
  path: PATH.ADMIN,
  element: (
    <ProtectedRoute role="admin">
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },
    { path: PATH.MANAGE_USER, element: <UserManagement /> },
  ],
};
