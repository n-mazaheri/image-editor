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

/**
 * Settings component for selecting colors, stroke sizes, and font sizes.
 *
 * This component includes color pickers for stroke color, fill color, and text color.
 * It also provides stroke size and font size picker components.
 *
 * @returns A React component for configuring drawing settings.
 */
export default function Settings() {
  return (
    <div>
      {/* Header */}
      <div className={styles.header}>Settings</div>

      {/* Main settings section */}
      <div className={styles.setting}>
        {/* First row of settings */}
        <div className={styles.settingRow}>
          {/* Column for stroke color */}
          <div className={styles.settingColumn}>
            <img src="/settings/pencil.png" className={styles.icon} alt="Stroke Color Icon" />
            {/* Color picker for stroke color */}
            <ColorPicker setFunc={setStrokeColor} getFunc={selectStrokeColor} />
          </div>

          {/* Column for fill color */}
          <div className={styles.settingColumn}>
            <img src="/settings/fill.png" className={styles.icon} alt="Fill Color Icon" />
            {/* Color picker for fill color */}
            <ColorPicker setFunc={setFillColor} getFunc={selectFillColor} />
          </div>
        </div>

        {/* Second row of settings */}
        <div className={styles.settingRow}>
          {/* Column for text color */}
          <div className={styles.settingColumn}>
            <img src="/settings/font-color.png" className={styles.icon} alt="Text Color Icon" />
            {/* Color picker for text color */}
            <ColorPicker setFunc={setTextColor} getFunc={selectTextColor} />
          </div>
          {/* Empty column placeholder */}
          <div className={styles.blank}></div>
        </div>
      </div>

      {/* Additional settings row */}
      <div className={styles.settingRow2}>
        {/* Column for stroke thickness */}
        <div className={styles.settingColumn}>
          <img src="/settings/line-thickness.png" className={styles.icon} alt="Stroke Thickness Icon" />
          {/* Component for selecting stroke thickness */}
          <StrokePicker options={[1, 2, 3, 5, 8, 10, 15, 20]} setFunc={setStrokeWidth} type={SizeType.STROKEWIDTH} />
        </div>

        {/* Column for font size */}
        <div className={styles.settingColumn}>
          <img src="/settings/font-size.png" className={styles.icon} alt="Font Size Icon" />
          {/* Component for selecting font size */}
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
