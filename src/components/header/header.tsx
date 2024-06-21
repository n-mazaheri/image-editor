import Clear from '../clear/clear';
import ImageSaver from '../imageSaver/imageSaver';
import ImageUploader from '../imageUploader/imageUploader';
import styles from './header.module.css';

/**
 * Header component for the image app editor.
 *
 * This component renders the header of the website, which consists of:
 * - A logo image and the name of the application.
 * - Three buttons for interacting with the canvas:
 *   - Upload image to the canvas.
 *   - Save the current state of the canvas as an image.
 *   - Clear the canvas.
 *
 * @returns A React component that renders the header section of the website.
 */
export default function Header() {
  return (
    <div className={styles.header}>
      {/* Logo and application name */}
      <div className={styles.logoText}>
        <img src="logo.png" className={styles.image} alt="Logo" />
        <div className={styles.name}>Image Editor</div>
      </div>

      {/* Buttons for uploading, saving, and clearing the canvas */}
      <div className={styles.updown}>
        <ImageUploader />
        <ImageSaver />
        <Clear />
      </div>
    </div>
  );
}
