import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";
import { PATH } from "../utils/path.util";
import ProductDetailPage from "../pages/product/ProductDetail";

const ProductListPage = lazy(() => import("../pages/product/ProductList"));

export const ProductRoutes: RouteObject = {
  path: PATH.USER,
  element: <MainLayout />,
  children: [
    { path: PATH.PRODUCTS, element: <ProductListPage /> },
    { path: PATH.PRODUCT_DETAIL, element: <ProductDetailPage /> },
  ],
};
