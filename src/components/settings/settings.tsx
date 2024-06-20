import {
  selectFillColor,
  selectStrokeColor,
  selectTextColor,
  setFillColor,
  setFontSize,
  setStrokeColor,
  setStrokeWidth,
  setTextColor,
} from '../../redux/slices/canvasSlice';
import ColorPicker from '../colorPicker/colorPicker';
import StrokePicker, { SizeType } from '../strokePicker/strokePicker';
import styles from './settings.module.css';
export default function Settings() {
  return (
    <div>
      {' '}
      <div className={styles.header}>Settings</div>
      <div className={styles.setting}>
        <div className={styles.settingRow}>
          <div className={styles.settingColumn}>
            {' '}
            <img src="/settings/pencil.png" className={styles.icon}></img>
            <ColorPicker setFunc={setStrokeColor} getFunc={selectStrokeColor} />
          </div>
          <div className={styles.settingColumn}>
            <img src="/settings/fill.png" className={styles.icon}></img>
            <ColorPicker setFunc={setFillColor} getFunc={selectFillColor} />
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingColumn}>
            <img src="/settings/font-color.png" className={styles.icon}></img>
            <ColorPicker setFunc={setTextColor} getFunc={selectTextColor} />
          </div>
          <div className={styles.blank}></div>
        </div>
      </div>
      <div className={styles.settingRow2}>
        <div className={styles.settingColumn}>
          <img src="/settings/line-thickness.png" className={styles.icon}></img>
          <StrokePicker options={[1, 2, 3, 5, 8, 10, 15, 20]} setFunc={setStrokeWidth} type={SizeType.STROKEWIDTH} />
        </div>{' '}
        <div className={styles.settingColumn}>
          <img src="/settings/font-size.png" className={styles.icon}></img>
          <StrokePicker
            options={[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]}
            setFunc={setFontSize}
            type={SizeType.FONTSIZE}
          />
        </div>
      </div>
    </div>
  );
}
