import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './colorPicker.module.css';
import { RootState } from '../../redux/store';
import { SketchPicker } from 'react-color';
import rgbHex from 'rgb-hex';

export default function ColorPicker(props: { getFunc: (state: RootState) => string; setFunc: (a: string) => any }) {
  const dispatch = useDispatch();
  const color = useSelector(props.getFunc);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleColorChange = (c: any) => {
    dispatch(props.setFunc('#' + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)));
  };
  const handleButtonClick = () => {
    setShowPicker(!showPicker);
  };

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

  const handleClickOutside = (event: MouseEvent) => {
    //@ts-ignore
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
