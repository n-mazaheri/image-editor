import { useContext } from 'react';
import { CanvasContext } from '../../contexts/canvasContext';
import classNames from 'classnames';
import { fabric } from 'fabric';
import { useSelector } from 'react-redux';
import {
  selectImageHeight,
  selectImagePreview,
  selectImageType,
  selectImageWidth,
} from '../../redux/slices/imageSlice';

/**
 * ImageSaver component for the image app editor.
 *
 * This component provides a button to save the current state of the canvas as an image.
 * When clicked, it initializes an off-screen canvas with the original size of the background image to preserve the image quality,
 * then saves the canvas content. If there is no background image, it saves the canvas content directly.
 *
 * @returns A React component that renders a save button.
 */
export default function ImageSaver() {
  const { canvasRef, createDataUrl } = useContext(CanvasContext);
  const imageHeight = useSelector(selectImageHeight);
  const imageWidth = useSelector(selectImageWidth);
  const imageType = useSelector(selectImageType);
  const imagePreview = useSelector(selectImagePreview);

  /**
   * Saves the current canvas as an image.
   * If a background image is present, it uses an off-screen canvas with the original image size to avoid quality loss.
   * If no background image is present, it saves the canvas directly.
   */
  const saveCanvasAsImage = async () => {
    if (canvasRef?.current) {
      if (imagePreview) {
        const dataURL = await createDataUrl(imagePreview, imageWidth, imageHeight, imageType);
        const link = document.createElement('a');
        link.href = dataURL!;
        link.download = 'canvas-image.' + imageType;
        link.click();
      } else {
        // Save the current canvas directly if no background image is present
        const dataURL = canvasRef?.current.toDataURL({
          format: imageType,
          quality: 1.0,
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'canvas-image.' + imageType;
        link.click();
      }
    }
  };

  return (
    <div>
      <button onClick={saveCanvasAsImage} className={classNames('toolboxButton', 'upDownButton')}>
        Save <span className="remove">Image</span>
      </button>
    </div>
  );
}
