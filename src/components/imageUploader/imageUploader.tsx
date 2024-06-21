import React, { ChangeEvent } from 'react';
import styles from './imageUploader.module.css';
import { useDispatch } from 'react-redux';
import { setImagePriview, setImageType } from '../../redux/slices/imageSlice';
import classNames from 'classnames';

/**
 * ImageUploader component for the image app editor.
 *
 * This component provides a button for users to upload an image. When an image is selected,
 * it sets the image information (preview and type) in the Redux store so that other components can read it
 * and initialize the canvas with the uploaded image.
 *
 * @returns A React component that renders an upload button.
 */
const ImageUploader: React.FC = () => {
  const dispatch = useDispatch();

  /**
   * Handles the change event when a user selects an image.
   * It reads the selected image file, sets the image type, and sets the image preview data in the Redux store.
   *
   * @param event - The change event from the file input.
   */
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Dispatch the image type to the Redux store
      dispatch(setImageType(file?.name?.split('.').pop() ?? 'png'));
      const reader = new FileReader();
      reader.onloadend = () => {
        // Dispatch the image preview data to the Redux store
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
