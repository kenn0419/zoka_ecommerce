import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";
import { PATH } from "../utils/path.util";

const HomePage = lazy(() => import("../pages/user/HomePage"));

export const UserRoutes: RouteObject = {
  path: PATH.USER,
  element: <MainLayout />,
  children: [{ index: true, element: <HomePage /> }],
};
