import { Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import styles from "./SearchBar.module.scss";
import { useSearchStore } from "../../../store/search.store";
import { useDebounce } from "use-debounce";
import { PATH } from "../../../utils/path.util";
import { useSuggestProductsQuery } from "../../../queries/product.query";

const { Search } = Input;

export default function SearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { keyword, setKeyword, clearKeyword } = useSearchStore();
  const [debouncedKeyword] = useDebounce(keyword, 300);

  const { data, isFetching } = useSuggestProductsQuery(debouncedKeyword);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        clearKeyword();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value: string) => {
    if (!value) return;
    navigate(`/search?keyword=${value}`);
    clearKeyword();
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <Search
        placeholder="Zoka bao ship 0Đ - Đăng ký ngay!"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        enterButton
        size="large"
        className="searchInput"
      />

      {keyword && (
        <div className={styles.dropdown}>
          {isFetching && (
            <div className={styles.loading}>
              <Spin size="small" />
            </div>
          )}

          {!isFetching && data?.items && data.items.length === 0 && (
            <div className={styles.empty}>Không có sản phẩm nào</div>
          )}

          {!isFetching &&
            data &&
            data.items.map((item) => (
              <div
                key={item.id}
                className={styles.item}
                onClick={() => {
                  navigate(`/product/${item.slug}`);
                  clearKeyword();
                }}
              >
                <img src={item.thumbnail} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}

          {!isFetching && data?.items && data?.items.length > 0 && (
            <div
              className={styles.viewAll}
              onClick={() => {
                navigate(`/${PATH.PRODUCTS}?keyword=${keyword}`);
                clearKeyword();
              }}
            >
              Xem tất cả kết quả
            </div>
          )}
        </div>
      )}
    </div>
  );
}
