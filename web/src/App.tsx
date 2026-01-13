import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Suspense } from "react";
import LoadingFallback from "./components/common/LoadingFallback";

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
