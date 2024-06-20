import { useState } from 'react';
import Layers from '../layers/layers';
import Settings from '../settings/settings';
import styles from './sideMenu.module.css';
import classNames from 'classnames';
import DrawShape from '../drawShape/drawShape';

export default function SideMenu() {
  const [opened, setOpened] = useState(true);
  const [visible, setVisible] = useState(true);
  return (
    <div className={classNames(styles.parrent, opened ? styles.opened : styles.closed)}>
      <div
        onClick={() => {
          setOpened(!opened);
          if (visible == false) {
            setTimeout(() => {
              setVisible(true);
            }, 300);
          } else {
            setVisible(false);
          }
        }}
        className={styles.openButton}
      >
        <div className={styles.arrowParent}>
          <img src={'/menu/' + (opened ? 'close.png' : 'hamber.png')} className={styles.arrowImage}></img>
        </div>
      </div>
      {visible && (
        <>
          <DrawShape />
          <hr className={styles.hr} />
          <Settings />
          <hr className={styles.hr} />
          <Layers />
        </>
      )}
    </div>
  );
}
