import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

export default function AppBreadcrumb() {
  const { pathname } = useLocation();
  const paths = pathname.split("/").filter(Boolean);

  const items = paths.map((p) => ({
    title: p.charAt(0).toUpperCase() + p.slice(1),
  }));

  return <Breadcrumb style={{ marginBottom: 16 }} items={items} />;
}
