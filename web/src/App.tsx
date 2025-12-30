import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Suspense, useEffect } from "react";
import LoadingFallback from "./components/common/LoadingFallback";
import { PATH } from "./utils/path.util";
import { cartService } from "./services/cart.service";
import { authService } from "./services/auth.service";

const AUTH_PATHS = [
  `/${PATH.AUTH}/${PATH.SIGNIN}`,
  `/${PATH.AUTH}/${PATH.SIGNUP}`,
  `/${PATH.AUTH}/${PATH.VERIFY_ACCOUNT}`,
  `/${PATH.AUTH}/${PATH.FORGOT_PASSWORD}`,
];

function App() {
  useEffect(() => {
    const path = window.location.pathname;
    const isExist = AUTH_PATHS.some((item) => path.startsWith(item));

    if (!isExist) {
      authService.init();
      cartService.getUserCart();
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
