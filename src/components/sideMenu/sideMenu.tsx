import { useState } from 'react';
import Layers from '../layers/layers';
import Settings from '../settings/settings';
import styles from './sideMenu.module.css';
import classNames from 'classnames';
import DrawShape from '../drawShape/drawShape';

export default function SideMenu() {
  // State to manage whether the menu is opened or closed
  const [opened, setOpened] = useState(true);

  // State to manage whether the menu contents are visible or hidden
  const [visible, setVisible] = useState(true);

  // Function to toggle the opened and visible states
  const toggleMenu = () => {
    setOpened(!opened); // Toggle the opened state
    if (!visible) {
      setTimeout(() => setVisible(true), 300); // Delay showing menu contents for animation
    } else {
      setVisible(false); // Hide menu contents
    }
  };

  return (
    <div className={classNames(styles.parent, opened ? styles.opened : styles.closed)}>
      {/* Button to toggle the menu */}
      <div className={styles.openButton} onClick={toggleMenu}>
        <div className={styles.arrowParent}>
          {/* Arrow icon to indicate open/close state */}
          <img src={`/menu/${opened ? 'close.png' : 'hamber.png'}`} className={styles.arrowImage} alt="menu toggle" />
        </div>
      </div>

      {/* Conditionally render menu contents based on the visible state */}
      {visible && (
        <>
          {/* Component to draw shapes */}
          <DrawShape />
          {/* Divider */}
          <hr className={styles.hr} />
          {/* Component for settings */}
          <Settings />
          {/* Divider */}
          <hr className={styles.hr} />
          {/* Component for managing layers */}
          <Layers />
        </>
      )}
    </div>
  );
}
