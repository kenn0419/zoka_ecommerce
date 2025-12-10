import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import "./styles/global.scss";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1677ff",
        borderRadius: 6,
        fontFamily: "Inter, sans-serif",
      },
    }}
    locale={enUS}
  >
    <App />
  </ConfigProvider>
);
