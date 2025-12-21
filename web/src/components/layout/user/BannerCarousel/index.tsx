import { Carousel } from "antd";
import styles from "./BannerCarousel.module.scss";

const banners = [
  "https://via.placeholder.com/1200x300?text=Banner+1",
  "https://via.placeholder.com/1200x300?text=Banner+2",
  "https://via.placeholder.com/1200x300?text=Banner+3",
];

export default function BannerCarousel() {
  return (
    <Carousel autoplay className={styles.carousel}>
      {banners.map((src, index) => (
        <div key={index} className={styles.slide}>
          <img src={src} alt={`banner-${index}`} />
        </div>
      ))}
    </Carousel>
  );
}
