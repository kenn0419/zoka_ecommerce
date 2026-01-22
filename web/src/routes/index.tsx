import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRouter";
import { AdminRoutes } from "./AdminRouter";
import { AuthRoutes } from "./AuthRouter";
import NotFound from "../pages/error/NotFound";
import { ErrorRoutes } from "./ErrorRouter";
import { ProductRoutes } from "./ProductRouter";
import { ShopRoutes } from "./ShopRouter";
import { SellerRoutes } from "./SellerRouter";
import { PublicShopRoutes } from "./PublicShopRouter";

export const router = createBrowserRouter([
  ProductRoutes,
  UserRoutes,
  PublicShopRoutes,
  ShopRoutes,
  SellerRoutes,
  AdminRoutes,
  AuthRoutes,
  ErrorRoutes,
  { path: "*", element: <NotFound /> },
]);
