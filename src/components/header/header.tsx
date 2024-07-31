import { ConnectButton } from 'thirdweb/react';
import Clear from '../clear/clear';
import ImageSaver from '../imageSaver/imageSaver';
import ImageUploader from '../imageUploader/imageUploader';
import styles from './header.module.css';
import { createThirdwebClient } from 'thirdweb';
import { sepolia, ethereum, polygon, arbitrum } from 'thirdweb/chains';
import IPAsset from '../ipAsset/ipAsset';
import { REACT_APP_THIRDWEB_TOKEN } from '../const';
import Dalle from '../dalle/dalle';

/**
 * Header component for the image app editor.
 *
 * This component renders the header of the website, which consists of:
 * - A logo image and the name of the application.
 * - Three buttons for interacting with the canvas:
 *   - Upload image to the canvas.
 *   - Save the current state of the canvas as an image.
 *   - Clear the canvas.
 *   - Connect to wallet
 *   - Registe IP Asset
 *
 *
 * @returns A React component that renders the header section of the website.
 */
export default function Header() {
  const thirdwebKey = process.env.REACT_APP_THIRDWEB_TOKEN ?? REACT_APP_THIRDWEB_TOKEN;
  let client = createThirdwebClient({ clientId: thirdwebKey });

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
        <ConnectButton
          client={client}
          theme="light"
          chains={[sepolia, ethereum, polygon, arbitrum]}
          connectButton={{ className: styles.connect }}
          detailsButton={{ className: styles.connect }}
        ></ConnectButton>
        <IPAsset />
        <Dalle />
      </div>
    </div>
  );
}
