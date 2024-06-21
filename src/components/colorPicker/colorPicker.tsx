import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './colorPicker.module.css';
import { RootState } from '../../redux/store';
import { SketchPicker } from 'react-color';
import rgbHex from 'rgb-hex';

/**
 * ColorPicker component for the image app editor.
 *
 * This component allows users to select colors for text, stroke lines, and fill shapes.
 *
 * @param props - The properties object containing getFunc and setFunc.
 * @param props.getFunc - A function to get the current color from the Redux store.
 * @param props.setFunc - A function to set the selected color in the Redux store.
 * @returns A React component that renders a color picker.
 */
export default function ColorPicker(props: { getFunc: (state: RootState) => string; setFunc: (a: string) => any }) {
  const dispatch = useDispatch();
  const color = useSelector(props.getFunc);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  /**
   * Handles the color change event from the color picker.
   *
   * @param c - The color object from the color picker.
   */
  const handleColorChange = (c: any) => {
    dispatch(props.setFunc('#' + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)));
  };

  /**
   * Toggles the visibility of the color picker.
   */
  const handleButtonClick = () => {
    setShowPicker(!showPicker);
  };

  /**
   * Adds and removes the mousedown event listener for detecting clicks outside the color picker.
   */
  useEffect(() => {
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  /**
   * Handles clicks outside the color picker to close it.
   *
   * @param event - The mouse event.
   */
  const handleClickOutside = (event: MouseEvent) => {
    // @ts-ignore
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setShowPicker(false);
    }
  };

  return (
    <div className={styles['color-picker-component']}>
      <button onClick={handleButtonClick} style={{ backgroundColor: color }} className={styles.button}></button>
      {showPicker && (
        <div className={styles.popover} ref={pickerRef}>
          <SketchPicker color={color} onChangeComplete={handleColorChange} className={styles.picker} />
        </div>
      )}
    </div>
  );
}
