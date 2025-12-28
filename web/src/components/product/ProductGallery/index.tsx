// components/Gallery/index.tsx
import styles from "./ProductGallery.module.scss";
import type { IVariantImage } from "../../../types/variant-image.type";
import { useState } from "react";

interface ProductGalleryProps {
  images: IVariantImage[];
}
export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  return (
    <div className={styles.gallery}>
      <img src={images[activeImage].imageUrl} className={styles.mainImage} />

      <div className={styles.thumbList}>
        {images.map((img, i) => (
          <img
            key={img.imageUrl}
            src={img.imageUrl}
            className={i === activeImage ? styles.active : ""}
            onMouseEnter={() => setActiveImage(i)}
          />
        ))}
      </div>
    </div>
  );
}
