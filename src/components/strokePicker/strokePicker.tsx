import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import styles from './strokePicker.module.css';
import { selectFontSize, selectStrokewidth } from '../../redux/slices/canvasSlice';

export enum SizeType {
  STROKEWIDTH = 'STROKEWIDTH',
  FONTSIZE = 'FONTSIZE',
}
export default function StrokePicker(props: { setFunc: (a: number) => any; options: number[]; type: SizeType }) {
  const dispatch = useDispatch();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWidth = parseInt(event.target.value, 10);
    dispatch(props.setFunc(selectedWidth));
  };

  const fontSize = useSelector(selectFontSize);
  const strokeWidth = useSelector(selectStrokewidth);

  return (
    <div>
      <select
        id="line-width"
        onChange={handleChange}
        className={styles.selectProp}
        value={props.type == SizeType.STROKEWIDTH ? strokeWidth : fontSize}
      >
        {props.options.map((width) => (
          <option key={width} value={width}>
            {width}px
          </option>
        ))}
      </select>
    </div>
  );
}
