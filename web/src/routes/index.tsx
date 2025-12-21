import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRouter";
import { ShopRoutes } from "./ShopRouter";
import { AdminRoutes } from "./AdminRouter";
import { AuthRoutes } from "./AuthRouter";
import NotFound from "../pages/error/NotFound";
import { ErrorRoutes } from "./ErrorRouter";

export const router = createBrowserRouter([
  UserRoutes,
  ShopRoutes,
  AdminRoutes,
  AuthRoutes,
  ErrorRoutes,
  { path: "*", element: <NotFound /> },
]);
