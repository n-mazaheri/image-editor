import { useDispatch, useSelector } from 'react-redux';
import { selectImagePreview, setImageHeight, setImageWidth } from '../../redux/slices/imageSlice';
import styles from './imageView.module.css';
import { useContext, useEffect } from 'react';
import { fabric } from 'fabric';
import { CanvasContext } from '../../contexts/canvasContext';

export default function ImageView() {
  const imagePreview = useSelector(selectImagePreview);
  const { canvasRef } = useContext(CanvasContext);
  const dispatch = useDispatch();
  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef && !canvasRef.current) {
      canvasRef.current = new fabric.Canvas('canvas');
    }
  }, []);

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
