import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './colorPicker.module.css';
import { RootState } from '../../redux/store';

export default function ColorPicker(props: { getFunc: (state: RootState) => string; setFunc: (a: string) => any }) {
  const dispatch = useDispatch();
  const color = useSelector(props.getFunc);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    dispatch(props.setFunc(selectedColor));
  };

  return (
    <div>
      <input type="color" value={color} onChange={handleChange} className={styles.colorPicker} />
    </div>
  );
}
