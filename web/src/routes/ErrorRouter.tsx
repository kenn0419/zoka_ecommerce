import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";

const BadRequestPage = lazy(() => import("../pages/error/BadRequest"));
const UnauthorizedPage = lazy(() => import("../pages/error/Unauthorized"));
const ForbiddenPage = lazy(() => import("../pages/error/Forbidden"));
const InternalErrorPage = lazy(() => import("../pages/error/InternalError"));

export const ErrorRoutes: RouteObject = {
  path: PATH.ERROR,
  element: <Outlet />,
  children: [
    { path: PATH.BAD_REQUEST, element: <BadRequestPage /> },
    { path: PATH.FORBIDDEN, element: <ForbiddenPage /> },
    { path: PATH.UNAUTHORIZED, element: <UnauthorizedPage /> },
    { path: PATH.INTERNAL_ERROR, element: <InternalErrorPage /> },
  ],
};
