import { useDispatch, useSelector } from 'react-redux';
import {
  selectImageHeight,
  selectImagePreview,
  selectImageWidth,
  setImageHeight,
  setImagePriview,
  setImageWidth,
} from '../../redux/slices/imageSlice';
import styles from './imageView.module.css';
import { useContext, useEffect } from 'react';
import { fabric } from 'fabric';
import { CanvasContext } from '../../contexts/canvasContext';
import useDimensions from '../../hooks/dimention';

/**
 * ImageView component for the image app editor.
 *
 * This component contains the canvas where images are displayed and manipulated.
 * On load, it initializes the canvas with a blank canvas and sets the `canvasRef` value in the CanvasContext.
 * When a user uploads an image, it sets that image as the canvas background and resizes the canvas to fill 80% of the window width.
 *
 * @returns A React component that renders the canvas element.
 */
export default function ImageView() {
  const imagePreview = useSelector(selectImagePreview);
  const { canvasRef, getCanvasAtResoution } = useContext(CanvasContext);
  const dispatch = useDispatch();
  const { width } = useDimensions();
  const imageHeight = useSelector(selectImageHeight);
  const imageWidth = useSelector(selectImageWidth);

  /**
   * Effect to resize the canvas when the image preview is updated or the window width changes.
   */
  useEffect(() => {
    if (imagePreview && canvasRef?.current) {
      const containerWidth = window.innerWidth * 0.8; // 80% of window width
      const imageAspectRatio = imageWidth / imageHeight;
      const canvasWidth = containerWidth > imageWidth ? imageWidth : containerWidth;
      const canvasHeight = canvasWidth / imageAspectRatio;
      getCanvasAtResoution(canvasWidth, canvasHeight);
    }
  }, [width, imageHeight, imageWidth, imagePreview]);

  /**
   * Effect to initialize the Fabric.js canvas on component mount.
   */
  useEffect(() => {
    if (canvasRef && !canvasRef.current) {
      canvasRef.current = new fabric.Canvas('canvas');
      canvasRef.current.setWidth(window.innerWidth * 0.8);
      canvasRef.current.setHeight(window.innerHeight - 100);
      dispatch(setImagePriview(''));
    }
  }, []);

  /**
   * Effect to set the uploaded image as the canvas background and resize the canvas.
   */
  useEffect(() => {
    if (canvasRef?.current && imagePreview) {
      fabric.Image.fromURL(imagePreview, (img) => {
        canvasRef.current?.setBackgroundImage(img, canvasRef.current.renderAll.bind(canvasRef.current));
        var image = new Image();
        image.src = imagePreview;

        image.onload = function () {
          dispatch(setImageHeight(image.height));
          dispatch(setImageWidth(image.width));
          const containerWidth = window.innerWidth * 0.8; // 80% of window width
          const imageAspectRatio = image.width / image.height;
          const canvasWidth = containerWidth > image.width ? image.width : containerWidth;
          const canvasHeight = canvasWidth / imageAspectRatio;
          canvasRef.current!.setWidth(canvasWidth);
          canvasRef.current!.setHeight(canvasHeight);
          canvasRef.current!.renderAll();
          canvasRef.current!.setBackgroundImage(imagePreview, canvasRef.current!.renderAll.bind(canvasRef.current), {
            top: 0,
            left: 0,
            originX: 'left',
            originY: 'top',
            scaleX: canvasWidth / image.width,
            scaleY: canvasHeight / image.height,
          });
        };
      });
    }
  }, [imagePreview]);

  return (
    <>
      <div className={styles.imageParent}>
        <canvas id="canvas" className={styles.baseImage} />
      </div>
    </>
  );
}
