import ImageSaver from '../imageSaver/imageSaver';
import ImageUploader from '../imageUploader/imageUploader';
import styles from './header.module.css';

export default function Toolbox() {
  return (
    <div className={styles.header}>
      <div className={styles.logoText}>
        <img src="logo.png" className={styles.image}></img> <div className={styles.name}>Image Editor</div>
      </div>

      <div className={styles.updown}>
        <ImageUploader />
        <ImageSaver />
      </div>
    </div>
  );
}
