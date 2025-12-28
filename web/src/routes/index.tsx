import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRouter";
import { ShopRoutes } from "./ShopRouter";
import { AdminRoutes } from "./AdminRouter";
import { AuthRoutes } from "./AuthRouter";
import NotFound from "../pages/error/NotFound";
import { ErrorRoutes } from "./ErrorRouter";
import { ProductRoutes } from "./ProductRouter";

export const router = createBrowserRouter([
  ProductRoutes,
  UserRoutes,
  ShopRoutes,
  AdminRoutes,
  AuthRoutes,
  ErrorRoutes,
  { path: "*", element: <NotFound /> },
]);
