import { Select, Spin } from "antd";
import styles from "./Switcher.module.scss";
import { useGetAllMyShopsQuery } from "../../../../queries/shop.query";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../utils/path.util";
import { useSellerStore } from "../../../../store/seller.store";

export default function Switcher() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllMyShopsQuery();
  const setCurrentId = useSellerStore((state) => state.setCurrentShopId);

  if (isLoading) {
    return <Spin />;
  }

  const handleChange = (value: string) => {
    navigate(`/${PATH.SELLER}/${value}`);
    setCurrentId(value);
  };

  return (
    <Select
      className={styles.switcher}
      value={data?.[0]?.id}
      onChange={handleChange}
      options={data?.map((s) => ({
        value: s.id,
        label: s.name,
      }))}
    />
  );
}
