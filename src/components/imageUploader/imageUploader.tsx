import React, { ChangeEvent } from 'react';
import styles from './imageUploader.module.css';
import { useDispatch } from 'react-redux';
import { setImagePriview, setImageType } from '../../redux/slices/imageSlice';
import classNames from 'classnames';

const ImageUploader: React.FC = () => {
  const dispatch = useDispatch();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setImageType(file?.name?.split('.').pop() ?? 'png'));
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setImagePriview(reader.result as string));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className={classNames(styles['upload-button'], 'upDownButton')}>
        Upload <span className="remove">Image</span>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />{' '}
      </label>
    </div>
  );
};

export default ImageUploader;
