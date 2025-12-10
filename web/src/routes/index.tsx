import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRouter";
import { ShopRoutes } from "./ShopRouter";
import { AdminRoutes } from "./AdminRouter";
import { AuthRoutes } from "./AuthRouter";
import NotFound from "../pages/error/NotFound";

export const router = createBrowserRouter([
  UserRoutes,
  ShopRoutes,
  AdminRoutes,
  AuthRoutes,
  { path: "*", element: <NotFound /> },
]);
