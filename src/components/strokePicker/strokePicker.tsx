import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import styles from './strokePicker.module.css';
import { selectFontSize, selectStrokewidth } from '../../redux/slices/canvasSlice';

// Enum to specify the type of size picker (stroke width or font size)
export enum SizeType {
  STROKEWIDTH = 'STROKEWIDTH',
  FONTSIZE = 'FONTSIZE',
}

/**
 * StrokePicker component for selecting stroke width or font size.
 *
 * This component renders a dropdown menu with options to choose stroke width or font size.
 * It dispatches actions to Redux to update the selected stroke width or font size.
 *
 * @param props - Props object containing setFunc, options, and type (SizeType)
 * @returns A React component for selecting stroke width or font size.
 */
export default function StrokePicker(props: { setFunc: (a: number) => any; options: number[]; type: SizeType }) {
  const dispatch = useDispatch();

  // Handler function for handling change in selected size
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = parseInt(event.target.value, 10); // Parse selected size as integer
    dispatch(props.setFunc(selectedSize)); // Dispatch action to update stroke width or font size in Redux store
  };

  // Selectors to retrieve current font size and stroke width from Redux store
  const fontSize = useSelector(selectFontSize);
  const strokeWidth = useSelector(selectStrokewidth);

  return (
    <div>
      {/* Dropdown menu for selecting stroke width or font size */}
      <select
        id="line-width"
        onChange={handleChange}
        className={styles.selectProp} // Apply CSS styles for dropdown
        value={props.type === SizeType.STROKEWIDTH ? strokeWidth : fontSize} // Set selected value based on type
      >
        {/* Map through options array to render each option */}
        {props.options.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
}
