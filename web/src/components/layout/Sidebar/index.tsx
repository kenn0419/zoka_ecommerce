import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Link } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

const items = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: <Link to={`/${PATH.ADMIN}`}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_USER}`}>Manage Users</Link>,
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: (
      <Link to={`/${PATH.ADMIN}/${PATH.MANAGE_PRODUCT}`}>Manage Products</Link>
    ),
  },
];

const Sidebar = () => {
  return (
    <Sider>
      <div className="logo">My Admin</div>
      <Menu theme="dark" mode="inline" items={items} />
    </Sider>
  );
};

export default Sidebar;
